/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  newAccount: {
    store: typeof routes['new_account.store']
  }
  accessToken: {
    store: typeof routes['access_token.store']
    destroy: typeof routes['access_token.destroy']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  screens: {
    current: typeof routes['screens.current']
    index: typeof routes['screens.index']
    store: typeof routes['screens.store']
    update: typeof routes['screens.update']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
  }
  matches: {
    show: typeof routes['matches.show']
    getHistory: typeof routes['matches.get_history']
    updateScore: typeof routes['matches.update_score']
    updateSettings: typeof routes['matches.update_settings']
    timeout: typeof routes['matches.timeout']
    startPeriod: typeof routes['matches.start_period']
    endPeriod: typeof routes['matches.end_period']
    resetMatch: typeof routes['matches.reset_match']
  }
}
