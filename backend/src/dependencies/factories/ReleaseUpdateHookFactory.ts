import { interfaces } from 'inversify'
import { ISocketMediator } from '../../util/mediator/Interfaces'
import ReleaseUpdateHook from '../../hooks/ReleaseUpdateHook'
import { Model } from 'mongoose'
import { IVersionDocument } from '../../models/Version'
import { IAppModel } from 'shared'

export type ReleaseUpdateHookFactory = (clientsMediator: ISocketMediator, app: IAppModel) => ReleaseUpdateHook

export default function releaseUpdateHookFactory({ container }: interfaces.Context): ReleaseUpdateHookFactory {
	const versions = container.get<Model<IVersionDocument>>(DI.Models.Version)

	return (clientsMediator: ISocketMediator, app: IAppModel) => {
		return new ReleaseUpdateHook(clientsMediator, versions, app)
	}
}
