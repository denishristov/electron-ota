// tslint:disable:max-classes-per-file
import { Email, Regex, Min, StringSchema, Max, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'
import { AuthenticatedRequest } from './generic'

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/

export class AdminPublicModel {
	public name: string

	public email: string

	public pictureUrl: string
}
export class AdminLoginRequest {
	@Email()
	public email?: string

	public name?: string

	@Required()
	public password: string
}

export class AdminLoginResponse {
	@Required()
	@BooleanSchema()
	public isAuthenticated: boolean

	@StringSchema()
	public authToken?: string
}

export class AdminAuthenticationResponse {
	@Required()
	@BooleanSchema()
	public isAuthenticated: boolean
}

export class RegisterKeyPathResponse {
	@Required()
	@StringSchema()
	public path: string
}

export class RegisterAdminRequest {
	@Required()
	@StringSchema()
	public key: string

	@Email()
	@Max(256)
	public email: string

	@Min(4)
	@Max(256)
	public name: string

	@Required()
	@Regex(passwordRegex)
	public password: string
}

export class RegisterAdminResponse {
	@Required()
	@BooleanSchema()
	public isSuccessful: boolean

	@StringSchema()
	public authToken?: string
}

export class AdminEditProfileRequest extends AuthenticatedRequest {
	@Email()
	public email?: string

	@Min(4)
	@Max(256)
	public name?: string

	@Regex(passwordRegex)
	public oldPassword?: string

	@Regex(passwordRegex)
	public newPassword?: string

	@Uri()
	public pictureUrl?: string
}
