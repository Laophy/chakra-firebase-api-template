# Environment Variables

This project uses the following environment variables. Create a `.env` file in the root directory and add these variables:

## MongoDB Configuration
- `MONGO_CONNECTION_STRING`: MongoDB connection string
- `COLLECTION_PREFIX`: Prefix for MongoDB collections
- `NODE_ENV`: Node environment (e.g., 'dev', 'prod')

## Firebase Configuration
- `FIREBASE_TYPE`: Firebase account type
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID`: Firebase private key ID
- `FIREBASE_PRIVATE_KEY`: Firebase private key
- `FIREBASE_CLIENT_EMAIL`: Firebase client email
- `FIREBASE_CLIENT_ID`: Firebase client ID
- `FIREBASE_AUTH_URI`: Firebase authentication URI
- `FIREBASE_TOKEN_URI`: Firebase token URI
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`: Firebase auth provider X509 cert URL
- `FIREBASE_CLIENT_X509_CERT_URL`: Firebase client X509 cert URL
- `FIREBASE_UNIVERSE_DOMAIN`: Firebase universe domain

Note: Keep your `.env` file secure and never commit it to version control.
