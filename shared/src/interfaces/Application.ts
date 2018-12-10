export interface ICreateApplicationRequest {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface ICreateApplicationResponse {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface IUpdateApplicationRequest {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IUpdateApplicationResponse {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IDeleteApplicationRequest {
	id: string
}

export interface IDeleteApplicationResponse {
	id: string
}