import Route from '@ioc:Adonis/Core/Route'



Route.group(() => {
  
 
  Route.resource('raffles', 'RafflesController')
  Route.get('/explorer/:id/sale', 'RafflesController.sale').as('raffles.sale')
  Route.get('/explorer', 'RafflesController.explorer').as('raffles.explorer')
  Route.get('/raffles/:raffle_id/tickets/:id/buy', 'RafflesController.buy').as('raffles.buy')
  Route.get('/raffles/:id/awards', 'AwardsController.create').as('awards.create')
  Route.post('/raffles/:id/awards', 'AwardsController.store').as('awards.store')
  Route.get('/type', 'TypesController.create').as('types.create')
  Route.post('/type', 'TypesController.store').as('types.store')


}).middleware('auth')

Route.get('/register', 'AuthController.register').as('auth.register')
Route.post('/register', 'AuthController.store').as('auth.store')
Route.get('/login', 'AuthController.login').as('auth.login')
Route.post('/login', 'AuthController.verify').as('auth.verify')
Route.get('/logout', 'AuthController.logout').as('auth.logout')

Route.get('/', 'HomeController.index').as('root')