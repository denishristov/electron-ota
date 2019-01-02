import { IRequest, IResponse } from "./Generic";

export interface IUserLoginRequest extends IRequest {
	email?: string
	name?: string
	password: string
}

export interface IUserLoginResponse extends IResponse {
	isAuthenticated: boolean
	authToken?: string
}