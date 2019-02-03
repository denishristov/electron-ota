import AWS from 'aws-sdk'
import { S3SignUrlRequest, S3SignUrlResponse } from 'shared'

AWS.config.loadFromPath('./src/config/awsCredentials.json')

enum S3Action {
	Get = 'getObject',
	Upload = 'putObject',
}

export interface IFileUploadService {
	signVersionUploadUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse>
	signPictureUploadUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse>
}

interface IS3ConfigOptions {
	Bucket: string
}

@DI.injectable()
export default class S3Service implements IFileUploadService {
	private readonly s3 = new AWS.S3()

	constructor(private readonly s3Config: IS3ConfigOptions) {}

	@bind
	public async signVersionUploadUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse> {
		return await this.constructUrls('versions', req)
	}

	@bind
	public async signPictureUploadUrl(req: S3SignUrlRequest): Promise<S3SignUrlResponse> {
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

	private async constructUrls(folderName: string, { name, type }: S3SignUrlRequest): Promise<S3SignUrlResponse> {
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
