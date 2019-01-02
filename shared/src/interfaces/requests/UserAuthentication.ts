import { IRequest, IResponse } from "./Generic";

export interface IUserAuthenticationRequest extends IRequest {
	authToken: string
}

export interface IUserAuthenticationResponse extends IResponse {
	isAuthenticated: boolean
}

export interface IRegisterKeyPathResponse extends IResponse {
	path: string
}

export interface IRegisterKeyAuthRequest extends IRequest {
	key: string
}

export interface IRegisterKeyAuthResponse extends IResponse {
	isAuthenticated: boolean
}

export interface IRegisterAdminRequest extends IRequest {
	name: string
	password: string
	email: string 
}

export interface IRegisterAdminResponse extends IResponse {
	isSuccessful: boolean
	authToken?: string
}