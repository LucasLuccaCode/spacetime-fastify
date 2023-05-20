import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { FastifyInstance } from 'fastify'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fieldSize: 5_242_880, // 5mb
      },
    })

    if (!upload) {
      return reply.status(400).send({ message: 'Nenhum arquivo enviado.' })
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send({ message: 'Formato de arquivo inválido.' })
    }

    const fileId = randomUUID()
    const ext = extname(upload.filename)
    const filename = fileId.concat(ext)

    const writeStream = createWriteStream(
      resolve(__dirname, '..', '..', 'uploads', filename),
    )

    await pump(upload.file, writeStream)

    const fullURL = `${request.protocol}://${request.hostname}`
    const fileURL = new URL(`/uploads/${filename}`, fullURL).toString()

    return { fileURL }
  })
}
