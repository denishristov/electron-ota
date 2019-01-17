import mongoose from 'mongoose'
import crypto from 'crypto'

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

export function uuid() {
	return crypto.randomBytes(16).toString('base64')
}

interface ITimestamp {
	createdAt: string
}

export function byDateDesc(a: ITimestamp, b: ITimestamp) {
	return +new Date(b.createdAt) - +new Date(a.createdAt)
}
