import { writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path, content } = body
  
  if (!path || !content) {
    throw createError({
      statusCode: 400,
      message: 'Path and content are required'
    })
  }

  try {
    // Resolve the path relative to the content directory
    const fullPath = resolve(process.cwd(), 'content', path)
    writeFileSync(fullPath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error writing file:', error)
    throw createError({
      statusCode: 500,
      message: 'Error writing file'
    })
  }
})
