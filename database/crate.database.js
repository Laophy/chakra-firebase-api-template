import admin from 'firebase-admin'

import {
	crateMessages,
	productMessages,
	serverMessages,
} from '../utils/constants.js'
import { handleResponse } from '../utils/responseHandler.js'
import { logAdminAction } from '../utils/logging/admin/logAdminAction.js'
import { handleError } from '../utils/handleError.js'

import { findUserByUID } from '../logic/user/user.logic.js'
import { productModel } from './models/inventory/product.model.js'
import { crateModel } from './models/inventory/crate.model.js'

export const getAllCrates = async () => {
	try {
		const crates = await crateModel.find()
		return handleResponse({
			message: serverMessages.SUCCESS,
			data: crates,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const getCrateById = async crateId => {
	try {
		const crate = await crateModel.findOne({ crateId: crateId })
		if (!crate) {
			return handleResponse(
				{ message: crateMessages.CRATE_NOT_FOUND },
				true
			)
		}
		return handleResponse({
			message: serverMessages.SUCCESS,
			data: crate,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const createCrate = async (authenticatedUserId, crate) => {
	try {
		const {
			crateId,
			visibility,
			name,
			description,
			tag,
			price,
			category,
			shopBackgroundUrl,
			imageUrl,
			products,
		} = crate

		// Check if the authenticated user is a staff member
		const user = await findUserByUID(authenticatedUserId)
		if (!user || !user.isStaff) {
			return handleResponse(
				{ message: serverMessages.UNAUTHORIZED },
				true
			)
		}

		// Check if the crateId already exists
		const existingCrate = await crateModel.findOne({ crateId: crateId })
		if (existingCrate) {
			return handleResponse(
				{ message: crateMessages.CRATE_ALREADY_EXISTS },
				true
			)
		}

		// Basic validation checks
		if (!name || !price) {
			return handleResponse(
				{ message: crateMessages.INVALID_NAME_AND_PRICE },
				true
			)
		}

		// Validate the price
		const parsedPrice = Number(price)
		if (isNaN(parsedPrice) || parsedPrice <= 0) {
			return handleResponse(
				{ message: crateMessages.INVALID_PRICE },
				true
			)
		}

		// Validate the visibility
		if (visibility !== 'private' && visibility !== 'public') {
			return handleResponse(
				{ message: crateMessages.INVALID_VISIBILITY },
				true
			)
		}

		// Validate the products array
		if (products && products.length > 0) {
			for (const product of products) {
				const {
					product: productId,
					minTicket,
					maxTicket,
					odds,
				} = product

				// Check if the product exists in the database
				const existingProduct = await productModel.findById(productId)
				if (!existingProduct) {
					return handleResponse(
						{ message: productMessages.PRODUCT_NOT_FOUND },
						true
					)
				}

				// Validate minTicket, maxTicket, and odds
				if (minTicket < 0 || maxTicket < 0 || odds < 0 || odds > 100) {
					return handleResponse(
						{ message: 'Invalid product ticket or odds values' },
						true
					)
				}
			}
		}

		const newCrate = new crateModel({
			crateId,
			visibility: visibility || 'private',
			name: name,
			description: description || '',
			tag: tag || '',
			price: price,
			category: category || 'mix',
			shopBackgroundUrl:
				shopBackgroundUrl ||
				'https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-018.jpg',
			imageUrl:
				imageUrl ||
				'https://png.pngtree.com/png-vector/20231102/ourmid/pngtree-wooden-crate-wood-png-image_10416605.png',
			products: products || [],
		})

		// Save the crate to the database
		await newCrate.save()
		await logAdminAction(
			user.uid,
			crateMessages.CRATE_CREATED,
			`Staff member ${user.uid} created a new crate: ${name} which costs ${price} and has the id ${newCrate._id}.`
		)
		return handleResponse({
			message: crateMessages.CRATE_CREATED,
			data: { crate: newCrate },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		console.log(errorDetails)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const updateCrate = async (authenticatedUserId, crate) => {
	try {
		const {
			crateId,
			visibility,
			name,
			description,
			tag,
			price,
			category,
			shopBackgroundUrl,
			imageUrl,
			products,
		} = crate

		// Check if the authenticated user is a staff member
		const user = await findUserByUID(authenticatedUserId)
		if (!user || !user.isStaff) {
			return handleResponse(
				{ message: serverMessages.UNAUTHORIZED },
				true
			)
		}

		// Basic validation checks
		if (!name || !price) {
			return handleResponse(
				{ message: crateMessages.INVALID_NAME_AND_PRICE },
				true
			)
		}

		// Validate the price
		const parsedPrice = Number(price)
		if (isNaN(parsedPrice) || parsedPrice <= 0) {
			return handleResponse(
				{ message: crateMessages.INVALID_PRICE },
				true
			)
		}

		// Validate the visibility
		if (visibility !== 'private' && visibility !== 'public') {
			return handleResponse(
				{ message: crateMessages.INVALID_VISIBILITY },
				true
			)
		}

		// Validate the products array
		if (products && products.length > 0) {
			for (const prod of products) {
				const { product, minTicket, maxTicket, odds } = prod

				// Check if the product exists in the database
				const existingProduct = await productModel.findOne({
					productId: product,
				})
				if (!existingProduct) {
					return handleResponse(
						{
							message:
								productMessages.PRODUCT_NOT_FOUND +
								' : ' +
								product,
						},
						true
					)
				}

				// Validate minTicket, maxTicket, and odds
				if (minTicket < 0 || maxTicket < 0 || odds < 0 || odds > 100) {
					return handleResponse(
						{ message: 'Invalid product ticket or odds values' },
						true
					)
				}
			}
		}

		console.log(products)

		// Find the crate by ID and update it
		const updatedCrate = await crateModel.findOneAndUpdate(
			{ crateId },
			{
				crateId,
				visibility,
				name,
				description,
				tag,
				price,
				category,
				shopBackgroundUrl,
				imageUrl,
				products,
			},
			{ new: true, runValidators: true } // Return the updated crate and validate data
		)

		if (!updatedCrate) {
			return handleResponse(
				{ message: crateMessages.CRATE_NOT_FOUND },
				true
			)
		}

		await logAdminAction(
			user.uid,
			crateMessages.CRATE_UPDATED,
			`Staff member ${user.uid} updated crate: ${updatedCrate.name} which costs ${updatedCrate.price} and has the id ${updatedCrate.crateId}.`
		)
		return handleResponse({
			message: crateMessages.CRATE_UPDATED,
			data: { crate: updatedCrate },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		console.log(errorDetails)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const deleteCrate = async (authenticatedUserId, crateId) => {
	try {
		// Check if the authenticated user is a staff member
		const user = await findUserByUID(authenticatedUserId)
		if (!user || !user.isStaff) {
			return handleResponse(
				{ message: serverMessages.UNAUTHORIZED },
				true
			)
		}

		// Find the crate by ID and delete it
		const deletedCrate = await crateModel.findOneAndDelete({
			crateId,
		})

		if (!deletedCrate) {
			return handleResponse(
				{ message: crateMessages.CRATE_NOT_FOUND },
				true
			)
		}

		await logAdminAction(
			user.uid,
			crateMessages.CRATE_DELETED,
			`Staff member ${user.uid} deleted a crate: ${deletedCrate.name} and has the id ${deletedCrate.crateId}.`
		)

		return handleResponse({
			message: crateMessages.CRATE_DELETED,
			data: { crate: deletedCrate },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}
