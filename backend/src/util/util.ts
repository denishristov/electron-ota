import mongoose from 'mongoose'

export function toPlain<T extends mongoose.Document>(doc: T) {
	const result = { id: doc.id, ...doc.toObject() }

	delete result._id
	delete result.__v

	return result
}

export function mongooseRef(refName: string) {
	return {
		ref: refName,
		type: mongoose.Schema.Types.ObjectId,
	}
}

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
