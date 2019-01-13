import { Document, Schema } from 'mongoose'
import { IVersionDocument } from './Version'
import { SystemType } from 'shared'
import { VERSION_REF } from './constants'

export interface IClientDocument extends Document {
	username: string
	osRelease: string
	systemType: SystemType
	version: IVersionDocument
	updatingVersion: IVersionDocument
	sessionId: string
}

export const ClientSchema = new Schema({
	sessionId: String,
	username: String,
	osRelease: String,
	systemType: String,
	version: VERSION_REF,
	updatingVersion: VERSION_REF,
}, {
	timestamps: true,
})
