import router from '@adonisjs/core/services/router'
const ScreensController = () => import('#controllers/screens_controller')
const MatchesController = () => import('#controllers/matches_controller')

router.get('/', async () => {
  return { ok: true, message: 'Scoreboard backend is running' }
})

router.get('/screens', [ScreensController, 'index'])
router.get('/screens/:id/current', [ScreensController, 'current'])

router.get('/matches/:id', [MatchesController, 'show'])
router.patch('/matches/:id/score', [MatchesController, 'updateScore'])
router.patch('/matches/:id/settings', [MatchesController, 'updateSettings'])
router.patch('/matches/:id/timeout', [MatchesController, 'timeout'])
router.post('/matches/:id/start-period', [MatchesController, 'startPeriod'])
router.post('/matches/:id/end-period', [MatchesController, 'endPeriod'])