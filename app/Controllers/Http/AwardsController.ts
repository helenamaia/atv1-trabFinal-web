import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Award from 'App/Models/Award'
import Raffle from 'App/Models/Raffle';

export default class AwardsController {

  public async create({ view, auth, params }: HttpContextContract) {

    const award = new Award();
    const raffle = await this.getRaffle(auth, params.id, true)
    const colocation = 1 + ((await raffle.related('awards').query().max('colocation', 'colocation').first())?.colocation || 0)
    return view.render('Awards/create', { award, raffle, colocation })
  }

  public async store({ request, response, auth, session, params }: HttpContextContract) {
    const data = await request.only(['descriptionAward', 'colocation'])
    const raffle = await this.getRaffle(auth, params.id, true)
    if (!this.validate(data, session, true)) {
      return response.redirect().back()
    }

    const award = await Award.create({ ...data, raffleId: raffle.id })

    response.redirect().toRoute('raffles.index')
  }

  private async getRaffle(auth: AuthContract, id, preaload = false): Promise<Raffle> {
    const user = auth.user!!
    if (preaload) {
      return await user.related('raffles').query().where('id', id).preload('tickets').firstOrFail()
    } else {
      return await user.related('raffles').query().where('id', id).firstOrFail()
    }
  }

  private validate(data, dataAward, session, option = false): Boolean {
    const errors = {}


    if (!data.descriptionAward) {
      this.registerError(errors, 'descriptionAward', 'Campo obrigatório')
    }

    if (!data.colocation) {
      this.registerError(errors, 'colocation', 'Campo obrigatório')
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
