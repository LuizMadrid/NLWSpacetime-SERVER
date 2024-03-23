import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticc from '@fastify/static'

import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { memoriesRoutes } from './routes/memories'
import { resolve } from 'node:path'

const app = fastify()

app.register(cors, {
  origin: true,
})
app.register(jwt, {
  secret: 'supersecret-3mlk2moj1j09c09w8kmlFD2APLKl3clka7jowd23',
})
app.register(multipart)
app.register(staticc, {
  root: resolve(__dirname, '../uploads/'),
  prefix: '/uploads',
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running on http://localhost:3333')
  })
