import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'access_token.store': { paramsTuple?: []; params?: {} }
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'screens.index': { paramsTuple?: []; params?: {} }
    'screens.store': { paramsTuple?: []; params?: {} }
    'screens.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.get_history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_score': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.timeout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.start_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.end_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.reset_match': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'screens.index': { paramsTuple?: []; params?: {} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.get_history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'screens.current': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'screens.index': { paramsTuple?: []; params?: {} }
    'matches.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.get_history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'access_token.store': { paramsTuple?: []; params?: {} }
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'screens.store': { paramsTuple?: []; params?: {} }
    'matches.start_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.end_period': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.reset_match': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'screens.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_score': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.update_settings': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matches.timeout': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}