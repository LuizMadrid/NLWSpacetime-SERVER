import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (req, reply) => {
    const upload = await req.file({
      limits: { fileSize: 5_242_880 },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /ˆ(image|video)\/[a-zA-Z]+/
    const isValidMimeType = mimeTypeRegex.test(upload.mimetype)

    if (!isValidMimeType) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const fileExtension = extname(upload.filename)

    const fileName = fileId.concat(fileExtension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = req.protocol.concat('://').concat(req.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    console.log(fileUrl)
  })
}
