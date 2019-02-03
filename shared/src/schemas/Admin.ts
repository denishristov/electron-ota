// tslint:disable:max-classes-per-file
import { Email, Regex, Min, StringSchema, Token, Max } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'

export class AdminLoginRequest {
	@Email()
	@Max(256)
	public email?: string

	@Min(4)
	@Max(256)
	public name?: string

	@Required()
	@Max(256)
	@Regex(/^[a-zA-Z0-9]{8,64}$/)
	public password: string
}

export class AdminLoginResponse {
	@Required()
	@BooleanSchema()
	public isAuthenticated: boolean

	@Required()
	@Token()
	public authToken?: string
}

export class AdminAuthenticationRequest {
	@Required()
	@Token()
	public authToken: string
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
	public email?: string

	@Min(4)
	@Max(256)
	public name?: string

	@Required()
	@Max(256)
	@Regex(/^[a-zA-Z0-9]{8,64}$/)
	public password: string
}

export class RegisterAdminResponse {
	@Required()
	@BooleanSchema()
	public isSuccessful: boolean

	@Required()
	@Token()
	public authToken?: string
}
