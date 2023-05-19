import fastify from 'fastify'

const app = fastify()

app.get('/users', async (request) => {
  return console.log('NLW Spacetime')
})

app
  .listen({
    port: 3000,
  })
  .then(() => console.log(`🚀 Server running on http://localhost:3000`))
