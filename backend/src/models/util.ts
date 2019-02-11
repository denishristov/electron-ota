import { Document } from 'mongoose'
import mongoose from 'mongoose'

export interface ITimestampedDocument {
	createdAt: string
	updatedAt: string
}

export const defaultSchemaOptions = {
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform(doc: Document, ret: any) {
				ret.id = doc.id
				delete ret._id
				delete ret.__v
			},
		},
	},
	existingMongoose: mongoose,
}
