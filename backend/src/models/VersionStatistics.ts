import { Schema, Document } from 'mongoose'
import { IClientDocument } from './Client'
import { CLIENT_REF } from './constants'

interface IUpdateError {
	client: IClientDocument
	errorMessage: string
}

export interface IVersionStatisticsDocument extends Document {
	downloading: IClientDocument[]
	downloaded: IClientDocument[]
	using: IClientDocument[]
	errorMessages: IUpdateError[]
}

export const VersionStatisticSchema = new Schema({
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
