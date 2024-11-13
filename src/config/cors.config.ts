// config/cors.config.ts
import * as cors from 'cors'

const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201']

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (origin !== undefined) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true) // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS')) // Reject the origin
      }
    } else {
      callback(null, true) // Allow requests with no origin (like Postman)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}

export { corsOptions }
