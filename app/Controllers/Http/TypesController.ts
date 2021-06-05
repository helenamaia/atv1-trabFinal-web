 import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'

export default class TypesController {

  public async create({ view }: HttpContextContract) {
    const type = new Type()
    return view.render('types/create', { type })
  }
  public async store({ request, response, session }: HttpContextContract) {
    const data = await request.only(['description', 'initialNumber', 'step', 'ticketsNumber'])
    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

    await Type.create(data)

    response.redirect().toRoute('root')
  }

  private validate(data, session): Boolean {
    const errors = {}


    if (!data.description) {
      this.registerError(errors, 'description', 'Campo obrigatório')
    }

    if (!data.initialNumber) {
      this.registerError(errors, 'colocation', 'Campo obrigatório')
    }

    if (!data.step) {
      this.registerError(errors, 'colocation', 'Campo obrigatório')
    }

    if (!data.ticketsNumber) {
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
