import { interfaces } from 'inversify'
import { IApi } from '../../services/Api'
import { AppModel } from 'shared'
import App, { IApp } from '../../stores/App'

export type AppFactory = (appModel: AppModel) => IApp

export default function appFactory({ container }: interfaces.Context): AppFactory {
	const api = container.get<IApi>(DI.Services.Api)

	return (appModel: AppModel) => {
		return new App(appModel, api)
	}
}
