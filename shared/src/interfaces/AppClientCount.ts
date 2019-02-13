export interface IAppsClientCount {
	[bundleId: string]: ISystemTypeCount
}

export interface IAppClientCount {
	[versionName: string]: ISystemTypeCount
}

export interface ISystemTypeCount {
	[systemType: string]: number
}
