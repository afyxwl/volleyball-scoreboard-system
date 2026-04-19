/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'screens.index': {
    methods: ["GET","HEAD"]
    pattern: '/screens'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/screens_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/screens_controller').default['index']>>>
    }
  }
  'screens.current': {
    methods: ["GET","HEAD"]
    pattern: '/screens/:id/current'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/screens_controller').default['current']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/screens_controller').default['current']>>>
    }
  }
  'matches.show': {
    methods: ["GET","HEAD"]
    pattern: '/matches/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['show']>>>
    }
  }
  'matches.update_score': {
    methods: ["PATCH"]
    pattern: '/matches/:id/score'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['updateScore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['updateScore']>>>
    }
  }
  'matches.update_settings': {
    methods: ["PATCH"]
    pattern: '/matches/:id/settings'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['updateSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['updateSettings']>>>
    }
  }
  'matches.timeout': {
    methods: ["PATCH"]
    pattern: '/matches/:id/timeout'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['timeout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['timeout']>>>
    }
  }
  'matches.start_period': {
    methods: ["POST"]
    pattern: '/matches/:id/start-period'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['startPeriod']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['startPeriod']>>>
    }
  }
  'matches.end_period': {
    methods: ["POST"]
    pattern: '/matches/:id/end-period'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['endPeriod']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/matches_controller').default['endPeriod']>>>
    }
  }
}
