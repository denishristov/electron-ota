import { interfaces } from 'inversify'
import { IApi } from '../../util/Api'
import { IAppModel } from 'shared'
import App, { IApp } from '../../stores/App'

export type AppFactory = (appModel: IAppModel) => IApp

export default function appFactory({ container }: interfaces.Context): AppFactory {
	const api = container.get<IApi>(DI.Api)

	return (appModel: IAppModel) => {
		return new App(appModel, api)
	}
}
