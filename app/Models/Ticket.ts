import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public raffleId: number

  @column()
  public userId: number

  @column()
  public number: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Raffle)
  public raflle: BelongsTo<typeof Raffle>

}
