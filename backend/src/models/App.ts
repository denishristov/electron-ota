import { Document, Schema, Types } from 'mongoose'
import { IVersionDocument } from './Version'
import { SystemType } from 'shared'
import { VersionDocumentRef } from './refs'

export interface IAppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	versions: IVersionDocument[]
	latestVersions: {
		[key in SystemType]: IVersionDocument
	}
}

export const AppSchema = new Schema({
	bundleId: String,
	name: String,
	pictureUrl: String,
	versions: [VersionDocumentRef],
	latestVersions: {
		Windows_RT: VersionDocumentRef,
		Darwin: VersionDocumentRef,
		Linux: VersionDocumentRef,
	},
}, {
	timestamps: true,
})
