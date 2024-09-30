import {
	adminMessages,
	productMessages,
	serverMessages,
	userMessages,
} from '../utils/constants.js'
import { handleResponse } from '../utils/responseHandler.js'
import { logAdminAction } from '../utils/logging/admin/logAdminAction.js'
import { handleError } from '../utils/handleError.js'
import admin from 'firebase-admin'
import { productModel } from './models/inventory/product.model.js'
import { findUserByUID } from '../logic/user/user.logic.js'

export const getAllProducts = async () => {
	try {
		const products = await productModel.find()
		return handleResponse({
			message: serverMessages.SUCCESS,
			data: products,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const getProductById = async productId => {
	try {
		const product = await productModel.findOne({ productId: productId })
		if (!product) {
			return handleResponse(
				{ message: productMessages.PRODUCT_NOT_FOUND },
				true
			)
		}
		return handleResponse({
			message: serverMessages.SUCCESS,
			data: product,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const createProduct = async (
	authenticatedUserId,
	visibility,
	productId,
	name,
	description,
	price,
	attributes,
	category,
	imageUrl
) => {
	try {
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
				{ message: productMessages.INVALID_NAME_AND_PRICE },
				true
			)
		}

		if (typeof price !== 'number' || price <= 0) {
			return handleResponse(
				{ message: productMessages.INVALID_PRICE },
				true
			)
		}

		const newProduct = new productModel({
			productId,
			visibility: visibility || 'private',
			name: name,
			description: description || '',
			price: price,
			category: category || 'uncategorized',
			attributes: {
				rarity: attributes.rarity || 'common',
			},
			imageUrl:
				imageUrl ||
				'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Product_sample_icon_picture.png/640px-Product_sample_icon_picture.png',
		})

		// Save the product to the database
		await newProduct.save()
		await logAdminAction(
			user.uid,
			productMessages.PRODUCT_CREATED,
			`Staff member ${user.uid} created a new product: ${name} which costs ${price} and has the id ${newProduct._id}.`
		)
		return handleResponse({
			message: productMessages.PRODUCT_CREATED,
			data: { product: newProduct },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		console.log(errorDetails)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const updateProduct = async (
	authenticatedUserId,
	productId,
	visibility,
	name,
	description,
	price,
	attributes,
	category,
	imageUrl
) => {
	try {
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
				{ message: 'Name and price are required' },
				true
			)
		}

		// Validate the price
		const parsedPrice = Number(price)
		if (isNaN(parsedPrice) || parsedPrice <= 0) {
			return handleResponse(
				{ message: 'Price must be a positive number (more than 0)' },
				true
			)
		}

		// Find the product by ID and update it
		const updatedProduct = await productModel.findOneAndUpdate(
			{ productId },
			{
				visibility,
				name,
				description,
				price,
				category,
				imageUrl,
				attributes,
			},
			{ new: true, runValidators: true } // Return the updated product and validate data
		)

		if (!updatedProduct) {
			return handleResponse(
				{ message: productMessages.PRODUCT_NOT_FOUND },
				true
			)
		}

		await logAdminAction(
			user.uid,
			productMessages.PRODUCT_UPDATED,
			`Staff member ${user.uid} updated product: ${updatedProduct.name} which costs ${updatedProduct.price} and has the id ${updatedProduct.productId}.`
		)
		return handleResponse({
			message: productMessages.PRODUCT_UPDATED,
			data: { product: updatedProduct },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		console.log(errorDetails)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const deleteProduct = async (authenticatedUserId, productId) => {
	try {
		// Check if the authenticated user is a staff member
		const user = await findUserByUID(authenticatedUserId)
		if (!user || !user.isStaff) {
			return handleResponse(
				{ message: serverMessages.UNAUTHORIZED },
				true
			)
		}

		// Find the product by ID and delete it
		const deletedProduct = await productModel.findByIdAndDelete(productId)

		if (!deletedProduct) {
			return handleResponse(
				{ message: productMessages.PRODUCT_NOT_FOUND },
				true
			)
		}

		await logAdminAction(
			user.uid,
			productMessages.PRODUCT_DELETED,
			`Staff member ${user.uid} deleted a product: ${deletedProduct.name} and has the id ${deletedProduct.productId}.`
		)

		return handleResponse({
			message: productMessages.PRODUCT_DELETED,
			data: { product: deletedProduct },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}
