import { IResponse, IRequest } from "./Generic";

export interface IS3SignUrlRequest extends IRequest {
	name: string
	type: string
}

export interface IS3SignUrlResponse extends IResponse {
	signedRequest: string
	downloadUrl: string
}