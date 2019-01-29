import { Document, Schema, Types } from 'mongoose'
import { SystemType } from 'shared'
import { IAppDocument } from './App'
import { AppDocumentRef } from './refs'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isReleased: boolean
	isBase: boolean
	hash: string
	app: IAppDocument
	description?: string
	systems: {
		[key in SystemType]: boolean
	}
}

export const VersionSchema = new Schema({
	app: AppDocumentRef,
	downloadUrl: String,
	isBase: Boolean,
	isCritical: Boolean,
	isPublished: Boolean,
	isReleased: Boolean,
	hash: {
		type: String,
		unique: true,
		sparse: true,
		index: true,
	},
	versionName: {
		type: String,
	},
	description: String,
	systems: {
		Windows_RT: Boolean,
		Darwin: Boolean,
		Linux: Boolean,
	},
}, {
	timestamps: true,
})
