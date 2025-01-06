import { defineEventHandler, readBody, createError } from "h3";
import { useRuntimeConfig } from "#imports";

interface TokenRequestBody {
  code: string;
}

interface GithubTokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body.code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is required'
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
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code: body.code
      })
    })

    const data = await response.json()

    if (data.error) {
      throw createError({
        statusCode: 400,
        message: data.error_description || data.error
      })
    }

    return data
  } catch (error: any) {
    console.error('Token exchange error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to exchange code for token'
    })
  }
})
