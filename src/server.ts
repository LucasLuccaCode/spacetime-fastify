import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'
import { authRoutes } from './routes/auth'
import fastifyStatic from '@fastify/static'
import { resolve } from 'path'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(multipart)

app.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'uploads'),
  prefix: '/uploads',
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'spacetime',
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => console.log(`🚀 Server running on http://localhost:3333`))
