export interface IRegisterCredentialsService {
	verify(key: string): boolean
}

@injectable()
export default class RegisterCredentialsService implements IRegisterCredentialsService {
	constructor(private readonly registerKey: string) {}

	@bind
	public verify(key: string): boolean {
		return key === this.registerKey
	}
}
