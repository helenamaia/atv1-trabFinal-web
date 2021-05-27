import { listDirectoryFiles } from '@adonisjs/ace'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Award from 'App/Models/Award'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import Type from 'App/Models/Type'

export default class RafllesController {
  public async index({ view, auth, params }: HttpContextContract) {

    const user = auth.user!!
    const raffles = await user.related('raffles').query()

    return view.render('raffles/index', { raffles })
  }

  public async create({ view }: HttpContextContract) {
    const raffle = new Raffle()
    const types = await Type.all()
    const award = new Award()
    return view.render('raffles/create', { types, raffle, award })
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const data = await request.only(['title', 'description', 'dateLikelySortition', 'dateStartSale', 'dateEndSale', 'priceTicket', 'typeId'])
    const dataAward = await request.only(['descriptionAward'])
    if (!this.validate(data, dataAward, session, true)) {
      return response.redirect().back()
    }
    const user = auth.user
    const raffle = await Raffle.create({ ...data, userId: user?.id })
    const award = await Award.create({...dataAward, colocation: 1, raffleId: raffle.id})

    let tickets = Array()
    for (let i = 1; i < 1001; i++) {
      const ticket = { "raffleId": raffle.id, "userId": user!!.id, "number": i}
      tickets.push(ticket)
    }
    await Ticket.createMany(tickets)
    response.redirect().toRoute('raffles.index')
  }
  public async show({ view, auth, params }: HttpContextContract) {
    const types = await Type.all()
    const raffle = await this.getRaffle(auth, params.id, true)
    const raffleAward =  await this.getRaffleAward(auth, params.id, true)
    return view.render('raffles/show', { raffle, types, raffleAward})
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const raffle = await this.getRaffle(auth, params.id, true)
    const types = await Type.all()
    return view.render('raffles/edit', { raffle, types})
  }

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const raffle = await this.getRaffle(auth, params.id)
    const data = request.only(['title', 'description', 'dateLikelySortition', 'dateStartSale', 'dateEndSale', 'priceTicket', 'typeId'])
    const dataAward = await request.only(['descriptionAward'])
    if (!this.validate(data, dataAward, session)) {
      return response.redirect().back()
    }

    raffle.merge(data)
    raffle.save()
    response.redirect().toRoute('raffles.index')
  }

  

  


  private async getRaffle(auth: AuthContract, id, preaload = false): Promise<Raffle> {
    const user = auth.user!!
    if(preaload){
      return await user.related('raffles').query().where('id', id).preload('tickets').firstOrFail()
    }else{
      return await user.related('raffles').query().where('id', id).firstOrFail()
    }
  }

  private async getRaffleAward(auth: AuthContract, id, preaload = false): Promise<Raffle> {
    const user = auth.user!!
    if(preaload){
      return await user.related('raffles').query().where('id', id).preload('awards').firstOrFail()
    }else{
      return await user.related('raffles').query().where('id', id).firstOrFail()
    }
  }
  

  
  
 


  private validate(data, dataAward, session, option = false): Boolean {
    const errors = {}

    if (!data.title) {
      this.registerError(errors, 'title', 'Campo obrigatório')
    }

    if(!data.dateLikelySortition){
      this.registerError(errors, 'dateLikelySortition', 'Campo obrigatório')
    }
    if(!data.dateStartSale){
      this.registerError(errors, 'dateStartSale', 'Campo obrigatório')
    }
    if(!data.dateEndSale){
      this.registerError(errors, 'dateEndSale', 'Campo obrigatório')
    }

    if (!data.priceTicket) {
      this.registerError(errors, 'priceTicket', 'Campo obrigatório')
    }

    if(!data.typeId){
      this.registerError(errors, 'typeId', 'Campo obrigatório')
    }
    if(option){
      if(!dataAward.descriptionAward){
        this.registerError(errors, 'descriptionAward', 'Campo obrigatório')
      }
  
      
    }
    
    
    

    if (Object.entries(errors).length > 0) {
      session.flash('error', 'Erro ao salvar a rifa.')
      session.flash('errors', errors)
      session.flashAll()
      return false
    }

    return true
  }

  private registerError(errors, attribute, error) {
    if (!errors[attribute]) {
      errors[attribute] = []
    }
    errors[attribute].push(error)
  }

}
