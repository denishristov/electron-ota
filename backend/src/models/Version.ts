import { Document, Schema } from 'mongoose'
import {  VERSION_STATISTICS_REF, RELEASE_REF } from './constants'
import { IVersionStatisticsDocument } from './VersionStatistics'
import { IReleaseDocument } from './Release'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	hash: string
	appId: string
	description?: string
	statistics: IVersionStatisticsDocument
	releases: IReleaseDocument[]
}

export const VersionSchema = new Schema({
	appId: String,
	downloadUrl: String,
	isBase: Boolean,
	isCritical: Boolean,
	isPublished: Boolean,
	hash: {
		type: String,
		unique: true,
	},
	versionName: {
		type: String,
	},
	description: String,
	statistics: VERSION_STATISTICS_REF,
	releases: [RELEASE_REF],
}, {
	timestamps: true,
})
