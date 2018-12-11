import { IApi } from "../util/Api"
import { observable } from "mobx"
import { EventTypes } from "shared"
import bind from 'bind-decorator'
import { ICreateApplicationRequest } from 'shared'

export default class ApplicationsStore {
	@observable
	private readonly applications: any

	constructor(private readonly api: IApi) {
		
	}

	@bind async fetch(){
		// console.log(await this.api.emit<any,any>(EventTypes.GetApplications, {}))
	}	
}