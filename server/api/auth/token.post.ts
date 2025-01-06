import { defineEventHandler, readBody, createError } from "h3";

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
  try {
    const body = await readBody<TokenRequestBody>(event);

    if (!body.code) {
      throw createError({
        statusCode: 400,
        message: "Authorization code is required",
      });
    }

    if (!process.env.NUXT_GITHUB_CLIENT_ID || !process.env.NUXT_GITHUB_CLIENT_SECRET) {
      throw createError({
        statusCode: 500,
        message: "GitHub OAuth credentials are not configured",
      });
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NUXT_GITHUB_CLIENT_ID,
        client_secret: process.env.NUXT_GITHUB_CLIENT_SECRET,
        code: body.code,
      }),
    });

    const data = (await response.json()) as GithubTokenResponse;

    if (data.error) {
      throw createError({
        statusCode: 400,
        message: data.error_description || data.error,
      });
    }

    if (!data.access_token) {
      throw createError({
        statusCode: 400,
        message: "No access token received from GitHub",
      });
    }

    return {
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Failed to exchange GitHub token",
    });
  }
});
