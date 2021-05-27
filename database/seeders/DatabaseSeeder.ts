import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Type from 'App/Models/Type'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class DatabaseSeederSeeder extends BaseSeeder {
  public async run () {
    const user1 = await User.create({name: 'Albino', email: 'albino@albino.com', password: '123', admin: false})
    const user2 = await User.create({name: 'Nego', email: 'nego@nego.com', password: '123', admin: true})
    const user3 = await User.create({name: 'violeta', email: 'violeta@violeta.com', password: '123', admin: false})
    const user4 = await User.create({name: 'tigrinho', email: 'tigrinho@tigrinho.com', password: '123', admin: false})
    const user5 = await User.create({name: 'morfeu', email: 'morfeu@morfeu.com', password: '123', admin: false})

    const type1 = await Type.create({description: 'festas', initialNumber: 1, step: 2, ticketsNumber: 50})
    const type2 = await Type.create({description: 'beneficente', initialNumber: 100, step: 10, ticketsNumber: 100})


    const raffle1 = await user1.related('raffles').create({title: 'Festa Junina', dateLikelySortition: DateTime.fromFormat("May 25 2021", "MMMM d yyyy"), dateStartSale: DateTime.fromFormat("April 07 2021", "MMMM d yyyy"), dateEndSale: DateTime.fromFormat("May 07 2021", "MMMM d yyyy"), priceTicket: 2, typeId: type1.id})
    const raffle2 = await user2.related('raffles').create({title: 'Halloween', dateLikelySortition: DateTime.fromFormat("February 10 2022", "MMMM d yyyy"), dateStartSale: DateTime.fromFormat("December 21 2021", "MMMM d yyyy"), dateEndSale: DateTime.fromFormat("January 30 2022", "MMMM d yyyy"), priceTicket: 5, typeId: type1.id })
    const raffle3 = await user2.related('raffles').create({title: 'Semana da inclusão', dateLikelySortition: DateTime.fromFormat("july 09 2021", "MMMM d yyyy"), dateStartSale: DateTime.fromFormat("August 15 2021", "MMMM d yyyy"),dateEndSale: DateTime.fromFormat("August 14 2021", "MMMM d yyyy"), priceTicket: 10, typeId: type2.id })

    await raffle1.related('awards').create({descriptionAward: '50 reais', colocation: 3}) 
    await raffle1.related('awards').create({descriptionAward: '100 reais', colocation: 2}) 
    await raffle1.related('awards').create({descriptionAward: '200 reais', colocation: 2}) 
    
    await raffle2.related('awards').create({descriptionAward: 'caderno', colocation: 3}) 
    await raffle2.related('awards').create({descriptionAward: 'mochila', colocation: 2})
    await raffle2.related('awards').create({descriptionAward: 'kit escola', colocation: 1})

    await raffle1.related('tickets').create({userId: user1.id, number: 1})
    await raffle1.related('tickets').create({userId: user2.id, number: 2})
    await raffle1.related('tickets').create({userId: user2.id, number: 3})
    await raffle1.related('tickets').create({userId: user1.id, number: 4})
    await raffle1.related('tickets').create({userId: user1.id, number: 5})


  }
}
