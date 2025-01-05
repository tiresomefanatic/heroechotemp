import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const filePath = query.path as string
  
  if (!filePath) {
    throw createError({
      statusCode: 400,
      message: 'Path parameter is required'
    })
  }

  try {
    // Resolve the path relative to the content directory
    const fullPath = resolve(process.cwd(), 'content', filePath)
    const content = readFileSync(fullPath, 'utf-8')
    return { content }
  } catch (error) {
    console.error('Error reading file:', error)
    throw createError({
      statusCode: 500,
      message: 'Error reading file'
    })
  }
})
