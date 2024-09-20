import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

// Initialize the environment
dotenv.config()

// Validate required environment variables
const requiredEnvVars = [
	'MONGO_CONNECTION_STRING',
	'COLLECTION_PREFIX',
	'NODE_ENV',
]
requiredEnvVars.forEach(varName => {
	if (!process.env[varName]) {
		console.error(`Error: Missing required environment variable ${varName}`)
		process.exit(1)
	}
})

// Create App
const app = express()

// Check NODE_ENV
const isProduction = process.env.NODE_ENV === 'prod'

// Express Config Defaults
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

// Setup API routing
import api from './routes/router.js'
app.use('/api', api)

// Find Port
const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

// Initialize MongoDB Connection
const connectToMongoDB = async () => {
	const mongoString =
		process.env.MONGO_CONNECTION_STRING + process.env.COLLECTION_PREFIX
	try {
		await mongoose.connect(mongoString, { ssl: true })
		console.log('Database Connected')
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
		process.exit(1)
	}
}

connectToMongoDB()

app.get('/health', async (req, res) => {
	res.send({ message: 'Healthy!', status: 200 })
})

// Service Connection
app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
})

export default app
