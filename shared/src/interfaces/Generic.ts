export interface IRequest {
	authToken?: string
}

export interface IResponse {
	errorMessage?: string
}

export interface ITimestampedDocument {
	createdAt: string
	updatedAt: string
}