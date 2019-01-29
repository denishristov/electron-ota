import { Document, Schema, Types } from 'mongoose'
import { IVersionDocument } from './Version'
import { SystemType } from 'shared'
import { VersionDocumentRef } from './refs'

export interface IClientDocument extends Document {
	id: string
	username: string
	osRelease: string
	version: IVersionDocument
	systemType: SystemType
}

export const ClientSchema = new Schema({
	username: String,
	osRelease: String,
	systemType: String,
	version: VersionDocumentRef,
}, {
	timestamps: true,
})
