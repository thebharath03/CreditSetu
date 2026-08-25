import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import documentsRouter from './routes/documents.js'

const app = express()
const port = process.env.PORT ?? 4000

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/documents', documentsRouter)

app.listen(port, () => {
  console.log(`CreditSetu API listening on http://localhost:${port}`)
})
