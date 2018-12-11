import { IRequest, IResponse } from "./Generic";

export interface IUserAuthenticationRequest extends IRequest {
	authToken: string
}

export interface IUserAuthenticationResponse extends IResponse {
	isAuthenticated: boolean
}