import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'







export default class HomeController {
  public async index ({view, auth}: HttpContextContract) {
    const user = auth.user
    if(user){
      const raffles = await user.related('raffles').query()
      const rafflesParticipate = await Database.rawQuery(
        `SELECT DISTINCT raffles.* FROM raffles, tickets WHERE tickets.user_id=${user.id} AND raffles.id=tickets.raffle_id`
      )

    
      for (const raffle of rafflesParticipate) {
        raffle.awards = await Database.rawQuery(`SELECT DISTINCT awards.* FROM raffles, awards WHERE awards.raffle_id=${raffle.id}`)
        
      
      }
      for (const raffle of rafflesParticipate) {
        raffle.tickets = await Database.rawQuery(`SELECT DISTINCT tickets.* FROM raffles, tickets WHERE tickets.raffle_id=${raffle.id}`)
        
        console.log(raffle.tickets);
        
      }
      

      //const ticketsBuy = await user.related('tickets').query().preload('raflle')
      //const total = ticketsBuy.reduce((sum, ticket) => sum + ticket.raflle.priceTicket, 0)
      //console.log(total);
      
      
      
      

      return view.render('home/index', {raffles, rafflesParticipate, user })

    }
  
    return view.render('home/public')
  }

}
