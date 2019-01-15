import { Document, Schema } from 'mongoose'
import {  VERSION_STATISTICS_REF, RELEASE_REF } from './constants'
import { IVersionStatisticsDocument } from './VersionStatistics'
import { IReleaseDocument } from './Release'
import { SystemType } from 'shared'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	hash: string
	appId: string
	description?: string
	systems: {
		[key in SystemType]: boolean
	}
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
	systems: {
		Windows_RT: Boolean,
		Darwin: Boolean,
		Linux: Boolean,
	},
}, {
	timestamps: true,
})
