// import { observable, ObservableMap } from 'mobx'
// import { ISystemTypeCount, IAppClientCount } from 'shared'
// import { IApi } from '../util/Api'


// @DI.injectable()
// export default class LiveCountersStore {
// 	private readonly appCounters = observable.map<string, ObservableMap<string, ISystemTypeCount>>({})

// 	private readonly appsCounters = observable.map<string, ISystemTypeCount>({})

// 	constructor(
// 		@DI.inject(DI.Api)
// 		private readonly api: IApi,
// 	) {}

// 	public async fetchAppLiveCount() {
// 		const counters = await this.api.emit<IAppClientCount>(EventType.getAppClientCount, { bundleId: this.bundleId })
// 		this.clientCounters.merge(counters)
// 		console.log(counters)
// 	}
// }
export {}