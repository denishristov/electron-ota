import mongoose from 'mongoose'
import crypto from 'crypto'

interface ITimestampedDocument {
	createdAt: string
	updatedAt: string
}

type Entry<T extends mongoose.Document> =
	Exclude<Exclude<T, '__v'>, '_id'> &
	ITimestampedDocument & {
		id: string,
	}

// type IPlainDocument<T extends> = Exclude<Exclude<T, '_id'>, '__v'>

export function plain<T extends mongoose.Document>(doc: T): Entry<T> {
	const result = { id: doc.id, ...doc.toJSON() }

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

export function uuid() {
	return crypto.randomBytes(16).toString('base64')
}

export function byDateDesc(a: ITimestampedDocument, b: ITimestampedDocument) {
	return +new Date(b.createdAt) - +new Date(a.createdAt)
}
