/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  screens: {
    index: typeof routes['screens.index']
    current: typeof routes['screens.current']
  }
  matches: {
    show: typeof routes['matches.show']
    updateScore: typeof routes['matches.update_score']
    updateSettings: typeof routes['matches.update_settings']
    timeout: typeof routes['matches.timeout']
    startPeriod: typeof routes['matches.start_period']
    endPeriod: typeof routes['matches.end_period']
  }
}
