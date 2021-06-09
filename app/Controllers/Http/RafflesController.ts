
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Award from 'App/Models/Award'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'
import Type from 'App/Models/Type'
import { DateTime } from 'luxon'

export default class RafllesController {
  public async index({ view, auth}: HttpContextContract) { 
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
    data.dateLikelySortition = DateTime.fromISO(data.dateLikelySortition)
    data.dateEndSale = DateTime.fromISO(data.dateEndSale)
    data.dateStartSale = DateTime.fromISO(data.dateStartSale)
    const dataAward = await request.only(['descriptionAward'])
    if (!this.validate(data, dataAward, session, true)) {
      return response.redirect().back()
    }
    const user = auth.user!!
    const raffle = await user.related('raffles').create(data)
    raffle.related('awards').create({...dataAward, colocation: 1})
    
    const type = await Type.query().where('id', data.typeId).firstOrFail()
    console.log(type);
    let tickets = Array()
    for (let i = 0, j = type.initialNumber; i < type.ticketsNumber; i++, j+=type.step) {
      const ticket = { "raffleId": raffle.id, "number": j }
      tickets.push(ticket)
    }
    await Ticket.createMany(tickets)
    response.redirect().toRoute('raffles.index')
  }

  public async show({request, view, params }: HttpContextContract) {
    const types = await Type.all()
    const raffle = await Raffle.query().where('raffles.id', params.id).preload('awards').firstOrFail()
    let pag = request.input('pag', 1)
    const limit = 100

    const tam = (await raffle.related('tickets').query()).length / limit

    const tickets = await raffle.related('tickets').query().paginate(pag, limit)
    pag = parseInt(pag)

    const dateNow = DateTime.now()
    let period = false
    if(dateNow <= raffle.dateEndSale && dateNow >= raffle.dateStartSale){
       period = true
      
    }else{
      period = false
      
    }
    let sortition = false
    if(raffle.dateSortition){ 
      sortition = true
    }
    
    
    
    return view.render('raffles/show', { raffle, types, pag, tam, tickets, period, sortition })
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const raffle = await this.getRaffle(auth, params.id, true)
    const types = await Type.all()
    return view.render('raffles/edit', { raffle, types })
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

  
  public async explorer({ view }: HttpContextContract) {

  const rafflesAll = await Raffle.all()

  
    return view.render('raffles/explorer', { rafflesAll })
  }

  public async buy({ params, response, auth }: HttpContextContract) {
    let ticket = await Ticket.query().where('raffle_id', params.raffle_id).where('id', params.id).firstOrFail()
    ticket.userId = auth.user!!.id
    ticket.save()
    response.redirect().toRoute('raffles.index', { raffle_id: ticket.raffleId, id: ticket.id})
  }
  


  private async getRaffle(auth: AuthContract, id, preaload = false): Promise<Raffle> {
    const user = auth.user!!
    if (preaload) {
      return await user.related('raffles').query().where('raffles.id', id).preload('tickets').preload('awards').firstOrFail()
    } else {
      return await user.related('raffles').query().where('raffles.id', id).firstOrFail()
    }
  }

  private validate(data, dataAward, session, option = false): Boolean {
    const errors = {}

    if (!data.title) {
      this.registerError(errors, 'title', 'Campo obrigatório')
    }

    if (!data.dateLikelySortition) {
      this.registerError(errors, 'dateLikelySortition', 'Campo obrigatório')
    }
    if (!data.dateStartSale) {
      this.registerError(errors, 'dateStartSale', 'Campo obrigatório')
    }
    if (!data.dateEndSale) {
      this.registerError(errors, 'dateEndSale', 'Campo obrigatório')
    }

    if (!data.priceTicket) {
      this.registerError(errors, 'priceTicket', 'Campo obrigatório')
    }

    if (!data.typeId) {
      this.registerError(errors, 'typeId', 'Campo obrigatório')
    }
    if (option) {
      if (!dataAward.descriptionAward) {
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
