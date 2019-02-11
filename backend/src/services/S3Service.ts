import AWS from 'aws-sdk'
import { SignUploadUrlRequest, SignUploadUrlResponse } from 'shared'

import { AWS_CREDENTIALS } from '../config'

AWS.config.update(AWS_CREDENTIALS)

enum S3Action {
	Get = 'getObject',
	Upload = 'putObject',
}

export interface IFileUploadService {
	signVersionUploadUrl(req: SignUploadUrlRequest): Promise<SignUploadUrlResponse>
	signPictureUploadUrl(req: SignUploadUrlRequest): Promise<SignUploadUrlResponse>
}

interface IS3ConfigOptions {
	Bucket: string
}

@DI.injectable()
export default class S3Service implements IFileUploadService {
	private readonly s3 = new AWS.S3()

	constructor(private readonly s3Config: IS3ConfigOptions) {}

	@bind
	public async signVersionUploadUrl(req: SignUploadUrlRequest): Promise<SignUploadUrlResponse> {
		return await this.constructUrls('versions', req)
	}

	@bind
	public async signPictureUploadUrl(req: SignUploadUrlRequest): Promise<SignUploadUrlResponse> {
		return await this.constructUrls('pictures', req)
	}

	private signUrl(action: S3Action, params: object): Promise<string> {
		return new Promise((resolve, reject) =>
			this.s3.getSignedUrl(action, params, (error, signedRequest) => {
				error && reject(error)
				signedRequest && resolve(signedRequest)
			}),
		)
	}

	private async constructUrls(folderName: string, { name, type }: SignUploadUrlRequest): Promise<SignUploadUrlResponse> {
		const params = {
			...this.s3Config,
			ContentType: type,
			Key: `${folderName}/${name}`,
		}

		return {
			downloadUrl: `https://s3.amazonaws.com/${params.Bucket}/${params.Key}`,
			signedRequest: await this.signUrl(S3Action.Upload, params),
		}
	}
}
