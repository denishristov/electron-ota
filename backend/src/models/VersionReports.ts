import { Schema, Document, Types } from 'mongoose'
import { IClientDocument } from './Client'
import { ClientDocumentRef, VersionDocumentRef } from './refs'
import { IVersionDocument } from './Version'

interface IUpdateError {
	client: IClientDocument
	errorMessage: string
}

export interface IVersionReportsDocument extends Document {
	downloading: IClientDocument[]
	downloaded: IClientDocument[]
	using: IClientDocument[]
	errorMessages: IUpdateError[]
	version: IVersionDocument
}

export const VersionReportsSchema = new Schema({
	version: VersionDocumentRef,
	downloading: [ClientDocumentRef],
	downloaded: [ClientDocumentRef],
	using: [ClientDocumentRef],
	errorMessages: [{
		errorMessage: String,
		client: ClientDocumentRef,
	}],
}, {
	timestamps: true,
})
