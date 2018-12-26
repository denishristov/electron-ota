export interface IUpdateServiceOptions {
	bundleId: string
	updateServerUrl: string
	userDataPath: string
	versionName: string
}

export interface IUpdateResponse extends INewUpdate {
	isUpToDate: boolean
}

export interface INewUpdate {
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	description?: string
}

export interface IUpdateInfo {
	fileName: string
	filePath: string
	isCritical: boolean
	isBase: boolean
	description?: string
}
