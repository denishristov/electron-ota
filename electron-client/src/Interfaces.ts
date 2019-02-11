export interface IUpdateServiceOptions {
	bundleId: string
	updateServerUrl: string
	versionName?: string
	userDataPath?: string
	checkHashAfterDownload?: boolean
	checkHashBeforeLoad?: boolean
}

export interface IUpdateResponse extends INewUpdate {
	isUpToDate: boolean
	update?: INewUpdate
}

interface IUpdate {
	versionName: string
	isCritical: boolean
	isBase: boolean
	hash: string
	description?: string
}

export interface INewUpdate extends IUpdate {
	downloadUrl: string
	versionId: string
}

export interface IUpdateInfo extends IUpdate {
	fileName: string
	filePath: string
}

export interface IRegistrationResponse {
	id: string
}
