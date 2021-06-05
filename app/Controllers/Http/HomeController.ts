import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'






export default class HomeController {
  public async index ({view, auth}: HttpContextContract) {
    const user = auth.user
    if(user){
      const raffles = await user.related('raffles').query()
    // const rafflesParticipate = await Raffle.query().groupBy('tickets.user_id').preload('tickets').firstOrFail()
     // const rafflesParticipate = await Raffle.related('tickets').query().groupBy('') 
   //   console.log(rafflesParticipate);


      return view.render('home/index', {raffles})

    }
  
    return view.render('home/public')
  }

}
