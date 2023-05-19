import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

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

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      userId: z.coerce.string().uuid(),
      content: z.string(),
      isPublic: z.coerce.boolean(),
      coverUrl: z.string(),
    })
    const { userId, content, isPublic, coverUrl } = bodySchema.parse(
      request.body,
    )

    const memory = await prisma.memory.create({
      data: {
        userId,
        content,
        isPublic,
        coverUrl,
      },
    })

    return memory
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.coerce.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    })

    if (!memory) {
      throw new Error('Memória não encontrada.')
    }

    return memory
  })
}
