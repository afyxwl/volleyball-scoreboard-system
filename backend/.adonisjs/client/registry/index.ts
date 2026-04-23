/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'new_account.store': {
    methods: ["POST"],
    pattern: '/auth/register',
    tokens: [{"old":"/auth/register","type":0,"val":"auth","end":""},{"old":"/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'access_token.store': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_token.store']['types'],
  },
  'access_token.destroy': {
    methods: ["POST"],
    pattern: '/auth/logout',
    tokens: [{"old":"/auth/logout","type":0,"val":"auth","end":""},{"old":"/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_token.destroy']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/auth/me',
    tokens: [{"old":"/auth/me","type":0,"val":"auth","end":""},{"old":"/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'screens.current': {
    methods: ["GET","HEAD"],
    pattern: '/screens/:id/current',
    tokens: [{"old":"/screens/:id/current","type":0,"val":"screens","end":""},{"old":"/screens/:id/current","type":1,"val":"id","end":""},{"old":"/screens/:id/current","type":0,"val":"current","end":""}],
    types: placeholder as Registry['screens.current']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'screens.index': {
    methods: ["GET","HEAD"],
    pattern: '/screens',
    tokens: [{"old":"/screens","type":0,"val":"screens","end":""}],
    types: placeholder as Registry['screens.index']['types'],
  },
  'screens.store': {
    methods: ["POST"],
    pattern: '/screens',
    tokens: [{"old":"/screens","type":0,"val":"screens","end":""}],
    types: placeholder as Registry['screens.store']['types'],
  },
  'screens.update': {
    methods: ["PATCH"],
    pattern: '/screens/:id',
    tokens: [{"old":"/screens/:id","type":0,"val":"screens","end":""},{"old":"/screens/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['screens.update']['types'],
  },
  'matches.show': {
    methods: ["GET","HEAD"],
    pattern: '/matches/:id',
    tokens: [{"old":"/matches/:id","type":0,"val":"matches","end":""},{"old":"/matches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['matches.show']['types'],
  },
  'matches.get_history': {
    methods: ["GET","HEAD"],
    pattern: '/matches/:id/history',
    tokens: [{"old":"/matches/:id/history","type":0,"val":"matches","end":""},{"old":"/matches/:id/history","type":1,"val":"id","end":""},{"old":"/matches/:id/history","type":0,"val":"history","end":""}],
    types: placeholder as Registry['matches.get_history']['types'],
  },
  'matches.update_score': {
    methods: ["PATCH"],
    pattern: '/matches/:id/score',
    tokens: [{"old":"/matches/:id/score","type":0,"val":"matches","end":""},{"old":"/matches/:id/score","type":1,"val":"id","end":""},{"old":"/matches/:id/score","type":0,"val":"score","end":""}],
    types: placeholder as Registry['matches.update_score']['types'],
  },
  'matches.update_settings': {
    methods: ["PATCH"],
    pattern: '/matches/:id/settings',
    tokens: [{"old":"/matches/:id/settings","type":0,"val":"matches","end":""},{"old":"/matches/:id/settings","type":1,"val":"id","end":""},{"old":"/matches/:id/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['matches.update_settings']['types'],
  },
  'matches.timeout': {
    methods: ["PATCH"],
    pattern: '/matches/:id/timeout',
    tokens: [{"old":"/matches/:id/timeout","type":0,"val":"matches","end":""},{"old":"/matches/:id/timeout","type":1,"val":"id","end":""},{"old":"/matches/:id/timeout","type":0,"val":"timeout","end":""}],
    types: placeholder as Registry['matches.timeout']['types'],
  },
  'matches.start_period': {
    methods: ["POST"],
    pattern: '/matches/:id/start-period',
    tokens: [{"old":"/matches/:id/start-period","type":0,"val":"matches","end":""},{"old":"/matches/:id/start-period","type":1,"val":"id","end":""},{"old":"/matches/:id/start-period","type":0,"val":"start-period","end":""}],
    types: placeholder as Registry['matches.start_period']['types'],
  },
  'matches.end_period': {
    methods: ["POST"],
    pattern: '/matches/:id/end-period',
    tokens: [{"old":"/matches/:id/end-period","type":0,"val":"matches","end":""},{"old":"/matches/:id/end-period","type":1,"val":"id","end":""},{"old":"/matches/:id/end-period","type":0,"val":"end-period","end":""}],
    types: placeholder as Registry['matches.end_period']['types'],
  },
  'matches.reset_match': {
    methods: ["POST"],
    pattern: '/matches/:id/reset',
    tokens: [{"old":"/matches/:id/reset","type":0,"val":"matches","end":""},{"old":"/matches/:id/reset","type":1,"val":"id","end":""},{"old":"/matches/:id/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['matches.reset_match']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
