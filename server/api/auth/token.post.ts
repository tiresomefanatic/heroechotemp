import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  // Debug log
  console.log('Config:', {
    clientId: config.public.githubClientId,
    hasSecret: !!config.github?.clientSecret,
    environment: process.env.NODE_ENV
  })
  
  // For production, we need to use environment variables directly
  const clientSecret = process.env.NODE_ENV === 'production' 
    ? process.env.NUXT_GITHUB_CLIENT_SECRET 
    : config.github?.clientSecret

  if (!clientSecret) {
    throw createError({
      statusCode: 500,
      message: 'GitHub client secret is not configured'
    })
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.public.githubClientId,
        client_secret: clientSecret,
        code: body.code
      })
    })

    const data = await response.json()
    
    if (data.error) {
      throw createError({
        statusCode: 400,
        message: data.error_description || 'GitHub authentication failed'
      })
    }
    
    return data
  } catch (error) {
    console.error('Token exchange error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to exchange code for token'
    })
  }
})
