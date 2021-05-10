import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SystemsController {
  public async index ({}: HttpContextContract) {
  }

  public async get ({view}: HttpContextContract) {

    return view.render('systems/get')
  }
  public async about ({view}: HttpContextContract) {

    return view.render('systems/about')
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
