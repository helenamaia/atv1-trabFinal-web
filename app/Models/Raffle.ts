import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Type from './Type'
import Award from './Award'
import Ticket from './Ticket'

export default class Raffle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public typeId: number

  @column()
  public title: string

  @column()
  public description: string

  
  @column.dateTime()
  public dateLikelySortition: DateTime

  @column.dateTime()
  public dateStartSale: DateTime
  
  @column.dateTime()
  public dateEndSale: DateTime

  @column.dateTime()
  public dateSortition: DateTime

  @column()
  public priceTicket: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Type)
  public type: BelongsTo<typeof Type>

  @hasMany(()=> Award)
  public awards: HasMany<typeof Award> 

  @hasMany(()=> Ticket)
  public tickets: HasMany<typeof Ticket> 

}
