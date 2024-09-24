import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import admin from 'firebase-admin'

// Initialize the environment
dotenv.config()

// Validate required environment variables
const requiredEnvVars = [
	'MONGO_CONNECTION_STRING',
	'COLLECTION_PREFIX',
	'NODE_ENV',
	'FIREBASE_TYPE',
	'FIREBASE_PROJECT_ID',
	'FIREBASE_PRIVATE_KEY_ID',
	'FIREBASE_PRIVATE_KEY',
	'FIREBASE_CLIENT_EMAIL',
	'FIREBASE_CLIENT_ID',
	'FIREBASE_AUTH_URI',
	'FIREBASE_TOKEN_URI',
]
requiredEnvVars.forEach(varName => {
	if (!process.env[varName]) {
		console.error(`Error: Missing required environment variable ${varName}`)
		process.exit(1)
	}
})
try {
	const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

	// Initialize Firebase Admin SDK using environment variables
	admin.initializeApp({
		credential: admin.credential.cert({
			type: process.env.FIREBASE_TYPE,
			project_id: process.env.FIREBASE_PROJECT_ID,
			private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
			private_key: privateKey,
			client_email: process.env.FIREBASE_CLIENT_EMAIL,
			client_id: process.env.FIREBASE_CLIENT_ID,
			auth_uri: process.env.FIREBASE_AUTH_URI,
			token_uri: process.env.FIREBASE_TOKEN_URI,
			auth_provider_x509_cert_url:
				process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
			client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
		}),
	})
	console.log('Firebase Admin SDK initialized successfully')
} catch (error) {
	console.error('Error initializing Firebase Admin SDK:', error)
	process.exit(1)
}

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
