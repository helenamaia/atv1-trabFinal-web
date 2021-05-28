import Route from '@ioc:Adonis/Core/Route'
import Raffles from 'Database/migrations/1621037796293_raffles'


Route.group(() => {
  Route.resource('raffles', 'RafflesController')
  Route.get('/raffles/:id/awards', 'AwardsController.create').as('awards.create')
  Route.post('/raffles/:id/awards', 'AwardsController.store').as('awards.store')
  Route.get('/raffles/all', 'RafflesController.all').as('raffles.all')


}).middleware('auth')


Route.get('/register', 'AuthController.register').as('auth.register')
Route.post('/register', 'AuthController.store').as('auth.store')
Route.get('/login', 'AuthController.login').as('auth.login')
Route.post('/login', 'AuthController.verify').as('auth.verify')
Route.get('/logout', 'AuthController.logout').as('auth.logout')

Route.get('/', 'HomeController.index').as('root')