import mongoose from 'mongoose'

export function toPlain<T extends mongoose.Document>(doc: T) {
	const result = { id: doc.id, ...doc.toObject() }
	delete result._id
	delete result.__v
	// delete result.createdAt
	// delete result.updatedAt
	return result
}
