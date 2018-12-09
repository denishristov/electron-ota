export interface IUserAuthenticationRequest {
	authToken: string
}

export interface IUserAuthenticationResponse {
	isAuthenticated: boolean
	errorMessage?: string
}