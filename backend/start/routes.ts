import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AccessTokenController = () => import('#controllers/access_token_controller')
const NewAccountController = () => import('#controllers/new_account_controller')
const ProfileController = () => import('#controllers/profile_controller')

const ScreensController = () => import('#controllers/screens_controller')
const MatchesController = () => import('#controllers/matches_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return { ok: true, message: 'Scoreboard backend is running' }
})

router.group(() => {
  router.delete('/users/:id', [UsersController, 'destroy'])
  router.delete('/screens/:id', [ScreensController, 'destroy'])
  router.patch('/screens/:id/assign', [ScreensController, 'assignUser'])
}).use(middleware.superAdmin())
/**
 * Auth
 */
router.post('/auth/register', [NewAccountController, 'store'])
router.post('/auth/login', [AccessTokenController, 'store'])
router.post('/auth/logout', [AccessTokenController, 'destroy']).use(middleware.auth())
router.get('/auth/me', [ProfileController, 'show']).use(middleware.auth())

/**
 * Public TV route
 */
router.get('/screens/:id/current', [ScreensController, 'current'])

router
  .group(() => {
    router.get('/users', [UsersController, 'index'])
    router.post('/users', [UsersController, 'store'])

    router.get('/screens', [ScreensController, 'index'])
    router.post('/screens', [ScreensController, 'store'])
    router.patch('/screens/:id', [ScreensController, 'update'])
    router.get('/screens/:id/matches/history', [MatchesController, 'screenHistory'])
    
    router.post('/matches', [MatchesController, 'store'])
    router.get('/matches/history', [MatchesController, 'history'])
    router.get('/matches/:id', [MatchesController, 'show'])
    router.get('/matches/:id/history', [MatchesController, 'getHistory'])

    router.patch('/matches/:id/score', [MatchesController, 'updateScore'])
    router.patch('/matches/:id/settings', [MatchesController, 'updateSettings'])
    router.patch('/matches/:id/timeout', [MatchesController, 'timeout'])
    router.patch('/matches/:id/fouls', [MatchesController, 'updateFouls'])

    router.post('/matches/:id/pause-period', [MatchesController, 'pausePeriod'])
    router.post('/matches/:id/start-period', [MatchesController, 'startPeriod'])
    router.post('/matches/:id/end-period', [MatchesController, 'endPeriod'])
    router.post('/matches/:id/reset', [MatchesController, 'resetMatch'])

  })
  .use(middleware.auth())