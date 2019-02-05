import { Typegoose } from 'typegoose'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

export interface ITimestampedDocument {
	createdAt: string
	updatedAt: string
}

// export type ModelType<T> = ModelType<T>

// export type JSON<T extends Document> = Exclude<Exclude<T, '__v'>, '_id'>

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
