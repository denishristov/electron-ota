import { IApi } from './Api'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { noop } from '../util/functions'
import { EventType, SignUploadUrlResponse, SignUploadUrlRequest } from 'shared'
import { fileExtensionRegex } from '../util/constants/regex'

const { CancelToken } = axios

type ProgressCallback = (progress: number) => void

interface IFileUpload {
	upload: Promise<any>
	onProgress: (callback: ProgressCallback) => void
	cancelSource: CancelTokenSource
	downloadUrl: string
}

export interface IUploadService {
	uploadVersion(name: string, file: File): Promise<IFileUpload>
	uploadPicture(picture: File): Promise<IFileUpload>
}

@DI.injectable()
export default class UploadService implements IUploadService {
	constructor(
		@DI.inject(DI.Services.Api)
		private readonly api: IApi,
	) {}

	public uploadVersion(name: string, file: File) {
		return this.uploadFile(EventType.SignUploadVersionUrl, file, name)
	}

	public uploadPicture(picture: File) {
		const match = picture.name.match(fileExtensionRegex)
		const name = match ? `${Date.now()}.${match[0]}` : picture.name

		return this.uploadFile(EventType.SignUploadPictureUrl, picture, name)
	}

	private async uploadFile(eventType: EventType, file: File, name?: string) {
		const {
			signedRequest,
			downloadUrl,
		} = await this.api.fetch({
			eventType,
			requestType: SignUploadUrlRequest,
			responseType: SignUploadUrlResponse,
			request: {
				name: name || file.name,
				type: file.type,
			},
		})

		const cancelSource = CancelToken.source()
		const holder: { onProgress: ProgressCallback } =  {
			onProgress: noop,
		}

		const onProgress = (cb: ProgressCallback) => {
			holder.onProgress = cb
		}

		const upload = axios.put(signedRequest, file, {
			headers: {
				'Content-Type': file.type,
			},
			onUploadProgress: ({ loaded, total }) => {
				holder.onProgress(Math.round((loaded * 100) / total))
			},
			cancelToken: cancelSource.token,
		})

		return { onProgress, cancelSource, upload, downloadUrl }
	}
}
