import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasManyThrough,
  HasManyThrough
} from '@ioc:Adonis/Lucid/Orm'
import Raffle from './Raffle'
import Ticket from './Ticket'
import Award from './Award'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public admin: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(()=> Raffle)
  public raffles: HasMany<typeof Raffle>
  
  @hasManyThrough([() => Ticket, () => Raffle])
  public tickets: HasManyThrough<typeof Ticket>

  @hasManyThrough([() => Award, () => Raffle])
  public awards: HasManyThrough<typeof Award>

}
