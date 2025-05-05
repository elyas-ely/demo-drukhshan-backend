import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { connectDb } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import otherRoutes from './routes/otherRoutes.js'
import { errorHandler } from './middlewares/error-handler.js'
import { logger } from './utils/logger.js'
import dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

// Connect to database
connectDb()

// Middleware for parsing JSON
app.use('*', async (c, next) => {
  if (c.req.header('content-type') === 'application/json') {
    c.req.json = await c.req.json()
  }
  await next()
})

// Serve static files
app.use('/*', serveStatic({ root: './public' }))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.route('/users', userRoutes)
app.route('/posts', postRoutes)
app.route('/others', otherRoutes)

// Error handling
app.onError(errorHandler)

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      status: 404,
      message: 'Not Found',
      path: c.req.path,
    },
    404
  )
})

const port = process.env.PORT || 4000

// Start the server
const server = Bun.serve({
  fetch: app.fetch,
  port: port,
  development: process.env.NODE_ENV !== 'production',
})

logger.info(`Server started on http://localhost:${port}`)
