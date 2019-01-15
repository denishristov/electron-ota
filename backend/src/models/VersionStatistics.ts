import { Schema, Document } from 'mongoose'
import { IClientDocument } from './Client'
import { CLIENT_REF, VERSION_REF } from './constants'
import { IVersionDocument } from './Version'

interface IUpdateError {
	client: IClientDocument
	errorMessage: string
}

export interface IVersionStatisticsDocument extends Document {
	downloading: IClientDocument[]
	downloaded: IClientDocument[]
	using: IClientDocument[]
	errorMessages: IUpdateError[]
	version: IVersionDocument
}

export const VersionStatisticSchema = new Schema({
	version: VERSION_REF,
	downloading: [CLIENT_REF],
	downloaded: [CLIENT_REF],
	using: [CLIENT_REF],
	errorMessages: [{
		errorMessage: String,
		client: CLIENT_REF,
	}],
}, {
	timestamps: true,
})
