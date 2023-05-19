import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(memoriesRoutes)

app
  .listen({
    port: 3000,
  })
  .then(() => console.log(`🚀 Server running on http://localhost:3000`))
