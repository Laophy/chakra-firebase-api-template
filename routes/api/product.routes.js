import { Router } from 'express'
import fetch from 'node-fetch'
import * as ProductDB from '../../database/product.database.js'
import { authenticateFirebaseToken } from '../../logic/middleware/authenticateFirebaseToken.middleware.js'
import { handleResponse } from '../../utils/responseHandler.js'
import { decodeEndpoint } from '../../logic/middleware/encryptResponse.middleware.js'
import {
	handleRequest,
	validateParams,
	validateRequestBody,
} from '../../logic/middleware/requestHandler.middleware.js'

const router = Router()

router.get('/product.:encodedEndpoint', async (req, res, next) => {
	const endpoint = decodeEndpoint(req)
	console.log('endpoint', endpoint)
	switch (endpoint) {
		case 'getProducts':
			handleRequest(req, res, async () => {
				console.log('attempting to get all products')
				return await ProductDB.getAllProducts()
			})
			break
		default:
			if (endpoint.startsWith('getProductById/')) {
				handleRequest(req, res, async () => {
					console.log('attempting to get a product by id')
					const productId = endpoint.split('/')[1]
					validateParams({ productId }, ['productId'])

					return await ProductDB.getProductById(productId)
				})
			} else {
				next()
			}
	}
})

router.post(
	'/product.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			case 'createProduct':
				handleRequest(req, res, async () => {
					console.log('attempting to create product')
					const {
						visibility,
						productId,
						name,
						description,
						price,
						attributes,
						category,
						imageUrl,
					} = req.body.product
					const authenticatedUserId = req.user.uid
					validateRequestBody(req.body, ['product']) // Required fields for creating a product

					const result = await ProductDB.createProduct(
						authenticatedUserId,
						visibility,
						productId,
						name,
						description,
						price,
						attributes,
						category,
						imageUrl
					)

					return result
				})
				break
			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

router.put(
	'/product.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			case 'updateProduct':
				handleRequest(req, res, async () => {
					console.log('attempting to update product')
					const {
						visibility,
						name,
						productId,
						description,
						price,
						attributes,
						category,
						imageUrl,
					} = req.body.product
					const authenticatedUserId = req.user.uid
					validateRequestBody(req.body, ['product']) // Required fields for creating a product

					const result = await ProductDB.updateProduct(
						authenticatedUserId,
						productId,
						visibility,
						name,
						description,
						price,
						attributes,
						category,
						imageUrl
					)

					return result
				})
				break
			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

router.delete(
	'/product.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			case 'deleteProduct':
				handleRequest(req, res, async () => {
					console.log('attempting to delete a product')
					const { productId } = req.params
					const authenticatedUserId = req.user.uid
					validateParams(req.params, ['productId'])

					const result = await ProductDB.deleteProduct(
						authenticatedUserId,
						productId
					)

					return result
				})
				break
			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

export default router
