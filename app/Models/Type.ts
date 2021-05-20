import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasManyThrough, HasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'
import Ticket from './Ticket'
import Award from './Award'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public initialNumber: number

  @column()
  public step: number

  @column()
  public ticketsNumber: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=> Raffle)
  public raffles: HasMany<typeof Raffle>
  
  @hasManyThrough([() => Ticket, () => Raffle])
  public tickets: HasManyThrough<typeof Ticket>

  @hasManyThrough([() => Award, () => Raffle])
  public awards: HasManyThrough<typeof Award>

}
