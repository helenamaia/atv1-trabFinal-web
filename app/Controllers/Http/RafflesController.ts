import { listDirectoryFiles } from '@adonisjs/ace'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
    const types = await Type.all()
    return view.render('raffles/create', { types })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await request.only(['title', 'dateLikelySortition', 'dateStartSale', 'dateEndSale', 'priceTicket', 'typeId'])
    const user = auth.user
    const raffle = await Raffle.create({ ...data, userId: user?.id })
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
    return view.render('raffles/show', { raffle, types })
  }


  private async getRaffle(auth: AuthContract, id, preaload = false): Promise<Raffle> {
    const user = auth.user!!
    if(preaload){
      return await user.related('raffles').query().where('id', id).preload('tickets').firstOrFail()
    }else{
      return await user.related('raffles').query().where('id', id).firstOrFail()
    }
  }


}
