import crypto from 'crypto' // Import crypto module

const ENCRYPTION_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6' // Must be 256 bits (32 characters)
const IV_LENGTH = 16 // For AES, this is always 16

// Helper function to encrypt data
const encryptText = text => {
	let iv = crypto.randomBytes(IV_LENGTH)
	let cipher = crypto.createCipheriv(
		'aes-256-cbc',
		Buffer.from(ENCRYPTION_KEY),
		iv
	)
	let encrypted = cipher.update(text)

	encrypted = Buffer.concat([encrypted, cipher.final()])

	return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decodeEndpoint = req => {
	return Buffer.from(req.params.encodedEndpoint, 'base64').toString('utf-8')
}

export { encryptText, decodeEndpoint }
