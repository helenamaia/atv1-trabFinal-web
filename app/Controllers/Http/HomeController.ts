import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Raffle from 'App/Models/Raffle'
import Ticket from 'App/Models/Ticket'






export default class HomeController {
  public async index ({view, auth}: HttpContextContract) {
    const user = auth.user
    if(user){
      const raffles = await user.related('raffles').query()
      const rafflesParticipate = await Database.rawQuery(
        `SELECT DISTINCT raffles.* FROM raffles, tickets WHERE tickets.user_id=${user.id} AND raffles.id=tickets.raffle_id`
      )
      const ticketsBuy = await user.related('tickets').query().preload('raflle')
      const total = ticketsBuy.reduce((sum, ticket) => sum + ticket.raflle.priceTicket, 0)
      console.log(total);
      
      

      return view.render('home/index', {raffles, rafflesParticipate})

    }
  
    return view.render('home/public')
  }

}
