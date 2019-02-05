
import { EventType, PublishVersionRequest, PublishVersionResponse, SystemType } from 'shared'
import { IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'
import { Version } from '../models/Version'
import {  ModelType } from 'typegoose'

@DI.injectable()
export default class ReleaseUpdateHook implements IPostRespondHook {
	public eventTypes = new Set([EventType.ReleaseUpdate])

	constructor(
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
		@DI.inject(DI.Models.Version)
		private readonly versions: ModelType<Version>,
	) {}

	@bind
	public async handle(
		_: EventType,
		{ versionId }: PublishVersionRequest,
		{ isSuccessful }: PublishVersionResponse,
	) {
		if (isSuccessful) {
			const { app, ...version } = await this.versions
				.findById(versionId)
				.select(`
					versionName
					isBase
					isCritical
					downloadUrl
					description
					hash
					app
					systems
				`)
				.populate('app')
				.then((version) => version.toJSON())

			const update = { ...version, versionId }
			const supportedSystemTypes = Object.entries(version.systems)
				.filter(([_, value]) => value)
				.map(([systemType, _]) => systemType)

			for (const systemType of supportedSystemTypes) {
				const name = `/${app.bundleId}/${systemType}`
				const mediator = this.mediators.get(name)

				if (!mediator) {
					throw new Error(`mediator ${name} does not exist`)
				}

				mediator.broadcast(EventType.NewUpdate, update)
			}
		}
	}
}
