import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import authConfig from 'Config/auth'

export default class HomeController {
  public async index ({view, auth}: HttpContextContract) {
    const user = auth.user
    if(user){
      const raffles = await user.related('raffles').query()
      return view.render('home/index', {raffles})
    }
  
    return view.render('home/public')
  }

}
