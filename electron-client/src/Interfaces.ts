export interface UpdateServiceOptions {
	bundleId: string
	updateServerUrl: string
	versionName: string
	userDataPath?: string
	checkHashAfterDownload?: boolean
	checkHashBeforeLoad?: boolean
}

export interface UpdateResponse extends INewUpdate {
	isUpToDate: boolean
	update?: INewUpdate
}

interface Update {
	versionName: string
	isCritical: boolean
	isBase: boolean
	hash: string
	description?: string
}

export interface INewUpdate extends Update {
	downloadUrl: string
	versionId: string
}

export interface UpdateInfo extends Update {
	fileName: string
	filePath: string
}

export interface IRegistrationResponse {
	id: string
}
