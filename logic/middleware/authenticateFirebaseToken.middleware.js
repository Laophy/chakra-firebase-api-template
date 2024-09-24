import admin from 'firebase-admin'

// Middleware to authenticate Firebase token
export const authenticateFirebaseToken = async (req, res, next) => {
	const token = req.headers.authorizationtoken

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: No token provided' })
	}

	try {
		// Verify the token using Firebase Admin SDK
		const decodedToken = await admin.auth().verifyIdToken(token)

		// Attach the user's Firebase UID to the request object
		req.user = { uid: decodedToken.uid }

		next() // Proceed to the next middleware
	} catch (error) {
		res.status(403).json({ message: 'Unauthorized: Invalid token', error })
	}
}
