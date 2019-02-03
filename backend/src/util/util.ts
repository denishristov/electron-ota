import mongoose from 'mongoose'
import crypto from 'crypto'
import { TimestampedDocument } from 'shared'

export class Empty {}

type Entry<T extends mongoose.Document> =
	Exclude<Exclude<T, '__v'>, '_id'> &
	TimestampedDocument & {
		id: string,
	}

export function toModel<T extends mongoose.Document>(doc: T, it = 0): Entry<T> {
	const result = { id: `${doc.id}`, ...it ? doc : doc.toJSON() }

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

export function byDateDesc(a: TimestampedDocument, b: TimestampedDocument) {
	return +new Date(b.createdAt) - +new Date(a.createdAt)
}

export function getId({ id }: { id: string }) {
	return id
}
