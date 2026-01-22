import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRouter from './routes/index.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Ydays backend running' })
})

app.use('/', apiRouter)


const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening : http://localhost:${port}`)
})
