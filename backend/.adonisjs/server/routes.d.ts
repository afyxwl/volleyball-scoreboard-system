import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'screens.index': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_score': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.timeout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.start_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.end_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'screens.index': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'screens.index': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'matches.update_score': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.timeout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'matches.start_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.end_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}