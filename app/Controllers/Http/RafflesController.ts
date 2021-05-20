import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'
import Type from 'App/Models/Type'

export default class RafllesController {
  public async index ({view, auth, params}: HttpContextContract) {

    const user = auth.user!!
    const raffles = await user.related('raffles').query()

    return view.render('raffles/index', { raffles })
  }

  public async create({ view }: HttpContextContract) {
    
    return view.render('raffles/create')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await request.only(['title', 'dateLikelySortition', 'dateStartSale', 'dateEndSale', 'priceTicket'])
    const user = auth.user
    await Raffle.create({ ...data, userId: user?.id , typeId: 1})
    response.redirect().toRoute('raffles.index')
  }
  

  private async getRaffle(auth: AuthContract, id): Promise<Raffle> {
    const user = auth.user!!
    return await user.related('raffles').query().firstOrFail()
  }


}
