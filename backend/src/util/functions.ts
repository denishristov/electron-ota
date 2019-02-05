import crypto from 'crypto'
import { ITimestampedDocument } from '../models/util'

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function uuid() {
	return crypto.randomBytes(16).toString('base64')
}

export function byDateDesc(a: ITimestampedDocument, b: ITimestampedDocument) {
	return +new Date(b.createdAt) - +new Date(a.createdAt)
}

export function getId({ id }: { id: string }) {
	return id
}
