import mongoose from 'mongoose'
import { referralModel } from './referral.model.js'

const collectionName = 'users'
/**
 * User Schema
 * Defines the structure and properties of a user in the system.
 *
 * Fields:
 * - uid: Unique identifier for the user (required, unique, indexed)
 * - displayName: User's display name (optional, default: empty string)
 * - username: User's unique username (optional, default: empty string)
 * - createdAt: Timestamp of user creation (default: current date)
 * - photoURL: URL to user's profile photo (default: example URL)
 * - email: User's email address (required, unique)
 * - apiKey: Unique API key for the user (default: generated UUID)
 * - lastLoginAt: Timestamp of user's last login (default: null)
 * - bio: User's biography (optional, max 500 characters, default: empty string)
 * - banned: Object containing ban information (isBanned, unbanDate, reason)
 * - isStaff: Boolean indicating if user is staff (default: false)
 * - isHighStaff: Boolean indicating if user is high-level staff (default: false)
 * - referralCode: User's unique referral code (optional, default: null)
 * - affiliate: Object containing affiliate information (default: created referral ID)
 * - title: Object containing user's title and color (optional, default: empty strings)
 * - balance: User's account balance (required, min: 0)
 */
const schema = new mongoose.Schema(
	{
		uid: { type: String, required: true, unique: true, index: true },
		displayName: { type: String, unique: false, default: '' },
		username: { type: String, unique: false, default: '' },
		createdAt: { type: Date, default: Date.now },
		photoURL: {
			type: String,
			default: 'https://example.com/default-avatar.png',
		},
		email: { type: String, required: true, unique: true },
		apiKey: {
			type: String,
			unique: true,
			default: () => crypto.randomUUID(),
		},
		lastLoginAt: { type: Date, default: null },
		bio: { type: String, maxlength: 500, default: '' },
		banned: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'banned_users',
			default: null,
		},
		isStaff: { type: Boolean, default: false },
		isHighStaff: { type: Boolean, default: false },
		referralCode: {
			type: String,
			unique: true,
			sparse: true,
			default: null,
		},
		affiliate: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'referrals',
			default: null,
		},
		title: {
			title: { type: String, default: '' },
			color: { type: String, default: '' },
		},
		balance: {
			type: Number,
			required: true,
			min: 0,
			validate: {
				validator: function (v) {
					return typeof v === 'number' && !isNaN(v)
				},
				message: props => `${props.value} is not a valid number!`,
			},
			default: 0,
		},
		inventory: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products',
					required: true,
				},
				quantity: { type: Number, required: true, min: 0 },
				acquiredAt: { type: Date, default: Date.now }, // Optional: track when the user acquired the item
			},
		],
	},
	{
		collection: collectionName,
	}
)

// Index for faster queries on email and uid
schema.index({ email: 1, uid: 1 })

export const userModel = mongoose.model(collectionName, schema)
