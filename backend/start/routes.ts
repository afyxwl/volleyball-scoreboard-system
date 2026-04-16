import router from '@adonisjs/core/services/router'

const ScreenController = () => import('#controllers/screen_controller')
const MatchController = () => import('#controllers/match_controller')

router.get('/test', async () => {
  return { status: 'ok' }
})

router.get('/screens', [ScreenController, 'index'])
router.get('/screens/:id', [ScreenController, 'show'])
router.get('/screens/:id/current', [ScreenController, 'current'])

router.get('/matches', [MatchController, 'index'])
router.get('/matches/:id', [MatchController, 'show'])

router.patch('/matches/:id/score/add/:team', [MatchController, 'addPoint'])
router.patch('/matches/:id/score/remove/:team', [MatchController, 'removePoint'])
router.patch('/matches/:id/timeout/:team', [MatchController, 'takeTimeout'])
router.patch('/matches/:id/period/start', [MatchController, 'startPeriod'])
router.patch('/matches/:id/period/end', [MatchController, 'endPeriod'])