# DRAMORA — Vercel-ready short drama web

## Deploy
1. Upload this folder/repository to Vercel.
2. Add Environment Variable: `QUICKPLAY_API_KEY`.
3. If the API provider uses a different authentication header, set `QUICKPLAY_API_KEY_HEADER` (default: `x-api-key`) and optionally `QUICKPLAY_API_PREFIX` (e.g. `Bearer`).
4. Deploy.

The browser calls `/api/quickplay`; the Vercel serverless function keeps the API key out of the client bundle.

## API routes used
- `/api/v2/discover`
- `/api/v2/search`
- `/api/v2/detail`
- `/api/v2/video`

The upstream API expects `category_p` for the provider, plus `query` for search, `id` for detail, and `chapterId` for video.
