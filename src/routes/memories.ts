import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { resolve, sep } from 'node:path'
import { unlink } from 'node:fs'

import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const id = request.user.sub

    const memories = await prisma.memory.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return memories.map((memory) => ({
      id: memory.id,
      content: memory.content.substring(0, 115).concat('...'),
      coverUrl: memory.coverUrl,
      isPublic: memory.isPublic,
    }))
  })

  app.post('/memories', async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })
    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        userId: request.user.sub,
        content,
        isPublic,
        coverUrl,
      },
    })

    return reply.code(201).send(memory)
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.code(401).send({
        message: 'Você não possui autorização para consultar essa memoria.',
      })
    }

    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })
    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const existingMemory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (existingMemory.userId !== request.user.sub) {
      return reply.code(401).send({
        message: 'Você não possui autorização para atualizar essa memoria.',
      })
    }

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        isPublic,
        coverUrl,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== request.user.sub) {
      return reply.code(401).send({
        message: 'Você não possui autorização para deletar essa memoria.',
      })
    }

    if (memory.coverUrl) {
      const filename = memory.coverUrl.split(sep).pop() as string
      const coverPath = resolve(__dirname, '..', '..', 'uploads', filename)

      unlink(coverPath, (err) => {
        if (err) console.log(err)
      })
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    return reply.status(200).send({ message: 'Memória deletada.' })
  })
}
