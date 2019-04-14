// tslint:disable:max-classes-per-file
import { Email, Regex, Min, StringSchema, Max, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'

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
	@StringSchema()
	public authToken: string
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
	@StringSchema()
	public authToken: string
}

export class AdminEditProfileRequest {
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
