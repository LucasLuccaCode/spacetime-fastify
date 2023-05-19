import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({})

    return memories.map((memory) => ({
      id: memory.id,
      content: memory.content.substring(0, 115).concat('...'),
      coverUrl: memory.coverUrl,
      isPublic: memory.isPublic,
    }))
  })
}
