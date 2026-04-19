import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

const allowedOrigins = env
  .get('CORS_ORIGIN', '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const corsConfig = defineConfig({
  enabled: true,
  origin: app.inDev ? true : allowedOrigins,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig