/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'screens.index': {
    methods: ["GET","HEAD"],
    pattern: '/screens',
    tokens: [{"old":"/screens","type":0,"val":"screens","end":""}],
    types: placeholder as Registry['screens.index']['types'],
  },
  'screens.current': {
    methods: ["GET","HEAD"],
    pattern: '/screens/:id/current',
    tokens: [{"old":"/screens/:id/current","type":0,"val":"screens","end":""},{"old":"/screens/:id/current","type":1,"val":"id","end":""},{"old":"/screens/:id/current","type":0,"val":"current","end":""}],
    types: placeholder as Registry['screens.current']['types'],
  },
  'matches.show': {
    methods: ["GET","HEAD"],
    pattern: '/matches/:id',
    tokens: [{"old":"/matches/:id","type":0,"val":"matches","end":""},{"old":"/matches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['matches.show']['types'],
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
