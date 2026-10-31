// Reads Docker Compose secrets mounted under /run/secrets and exposes them
// as the environment variables the app already uses (MONGODB_URI, JWT_SECRET).
// Outside Docker the files don't exist and the app falls back to secrets.env.
import fs from 'fs'

const readSecret = (name) => {
  try {
    return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim()
  } catch {
    return undefined
  }
}

const dbUser = readSecret('db_user')
const dbPassword = readSecret('db_password')
const jwtSecret = readSecret('jwt_secret')

if (dbUser && dbPassword) {
  const host = process.env.DB_HOST || 'mongo'
  const port = process.env.DB_PORT || '27017'
  const name = process.env.DB_NAME || 'fitsphere'
  process.env.MONGODB_URI =
    `mongodb://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}` +
    `@${host}:${port}/${name}?authSource=admin`
}
if (jwtSecret) process.env.JWT_SECRET = jwtSecret
