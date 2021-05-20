import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Raffle from 'App/Models/Raffle'

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
    const data = request.only(['name'])
    const user = auth.user
    await List.create({ ...data, userId: user?.id })
    response.redirect().toRoute('lists.index')
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    return view.render('lists/edit', { list })
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    const data = request.only(['name'])
    list.merge(data)
    list.save()
    response.redirect().toRoute('lists.index')
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    list.delete()
    response.redirect().toRoute('lists.index')
  }

  private async getRaffle(auth: AuthContract, id): Promise<Raffle> {
    const user = auth.user!!
    return await user.related('raffles').query().firstOrFail()
  }


}
