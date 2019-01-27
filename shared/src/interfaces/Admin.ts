import { IRequest, IResponse } from './Generic'

export interface IUserLoginRequest extends IRequest {
	email?: string
	name?: string
	password: string
}

export interface IUserLoginResponse extends IResponse {
	isAuthenticated: boolean
	authToken?: string
}

export interface IUserAuthenticationRequest extends IRequest {
	authToken: string
}

export interface IUserAuthenticationResponse extends IResponse {
	isAuthenticated: boolean
}

export interface IRegisterKeyPathResponse extends IResponse {
	path: string
}

export interface IRegisterAdminRequest extends IRequest {
	key: string
	name: string
	password: string
	email: string
}

export interface IRegisterAdminResponse extends IResponse {
	isSuccessful: boolean
	authToken?: string
}