import { Document, Schema } from 'mongoose'
import { IVersionDocument } from './Version'
import { SystemType } from 'shared'
import { VERSION_REF } from './constants'

export interface IClientDocument extends Document {
	username: string
	osRelease: string
	version: IVersionDocument
	systemType: SystemType
}

export const ClientSchema = new Schema({
	username: String,
	osRelease: String,
	systemType: String,
	version: VERSION_REF,
}, {
	timestamps: true,
})
