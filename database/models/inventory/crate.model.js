import mongoose from 'mongoose'

const collectionName = 'crates'

const crateSchema = new mongoose.Schema(
	{
		crateId: {
			type: String,
			unique: true,
			required: true,
		},
		visibility: { type: String, default: 'private' },
		name: { type: String, required: true, default: '' },
		description: { type: String, default: '' },
		tag: { type: String, default: '' },
		price: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value > 0
				},
				message: 'Price must be a positive number (greater than 0)',
			},
		},
		category: { type: String, default: 'mix' },
		shopBackgroundUrl: {
			type: String,
			default:
				'https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-018.jpg',
		},
		imageUrl: {
			type: String,
			default:
				'https://png.pngtree.com/png-vector/20231102/ourmid/pngtree-wooden-crate-wood-png-image_10416605.png',
		},
		products: {
			type: [
				{
					product: {
						type: String,
						required: true,
					},
					minTicket: {
						type: Number,
						required: true,
						min: 0,
					},
					maxTicket: {
						type: Number,
						required: true,
						min: 0,
					},
					odds: {
						type: Number,
						required: true,
						min: 0,
						max: 100,
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
)

export const crateModel = mongoose.model(collectionName, crateSchema)
