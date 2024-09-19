import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'

// Initialize the environment
dotenv.config()

// Create App
const app = express()

// Check NODE_ENV
const isProduction = process.env.NODE_ENV === 'prod'

// Express Config Defaults
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setup API routing
import api from './routes/router.js'
app.use('/api', api)

// Find Port
const port = 8080
const host = '0.0.0.0'

// Initialize MongoDB Connection
const mongoString =
	process.env.MONGO_CONNECTION_STRING + process.env.COLLECTION_PREFIX
if (mongoString) {
	mongoose.connect(mongoString, { ssl: true })
	const db = mongoose.connection
	db.once('connected', () => {
		console.log('Database Connected')
	})
} else {
	console.log(
		'Looks like you are missing a MongoDB connection string in your .env!'
	)
}

app.get('/health', async (req, res) => {
	res.send({ message: 'Healthy!', status: 200 })
})

// Service Connection
app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
})

export default app
