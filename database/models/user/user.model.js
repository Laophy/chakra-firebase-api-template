import mongoose from 'mongoose'

const collectionName = 'users'
/**
 * User Schema
 * Defines the structure and properties of a user in the system.
 *
 * Fields:
 * - uid: Unique identifier for the user (required, unique, indexed)
 * - displayName: User's display name (required)
 * - username: User's unique username (required, unique, indexed)
 * - createdAt: Timestamp of user creation (default: current date)
 * - photoURL: URL to user's profile photo
 * - email: User's email address (required, unique)
 * - apiKey: Unique API key for the user
 * - lastLoginAt: Timestamp of user's last login
 * - bio: User's biography (max 500 characters)
 * - banned: Object containing ban information (isBanned, unbanDate, reason)
 * - isStaff: Boolean indicating if user is staff
 * - isHighStaff: Boolean indicating if user is high-level staff
 * - referralCode: User's unique referral code
 * - affiliate: Object containing affiliate information
 * - title: Object containing user's title and color
 * - balance: User's account balance
 */
const schema = new mongoose.Schema(
	{
		uid: { type: String, required: true, unique: true, index: true },
		displayName: { type: String, required: true },
		username: { type: String, required: true, unique: true, index: true },
		createdAt: { type: Date, default: Date.now },
		photoURL: { type: String, default: '' },
		email: { type: String, required: true, unique: true },
		apiKey: { type: String, unique: true },
		lastLoginAt: { type: Date },
		bio: { type: String, maxlength: 500 },
		banned: {
			isBanned: { type: Boolean, default: false },
			unbanDate: { type: Date },
			reason: { type: String },
		},
		isStaff: { type: Boolean, default: false },
		isHighStaff: { type: Boolean, default: false },
		referralCode: { type: String, unique: true, sparse: true },
		affiliate: {
			code: { type: String, unique: true, sparse: true },
			users: { type: Number, default: 0 },
			totalDeposited: { type: Number, default: 0 },
			totalOpened: { type: Number, default: 0 },
			totalEarnings: { type: Number, default: 0 },
			unclaimedEarnings: { type: Number, default: 0 },
			lastChanged: { type: Date },
		},
		title: {
			title: { type: String },
			color: { type: String },
		},
		balance: { type: Number, default: 0 },
	},
	{
		collection: collectionName,
		timestamps: true,
	}
)

// Index for faster queries on username, email, and uid
schema.index({ username: 1, email: 1, uid: 1 })

// This creates a compound index on the 'username', 'email', and 'uid' fields.
// It improves query performance for operations that search or sort by these fields.
// The '1' indicates an ascending order index for all fields.

export const userModel = mongoose.model(collectionName, schema)
