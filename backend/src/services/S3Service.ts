import AWS from 'aws-sdk'
import { IS3SignUrlRequest, IS3SignUrlResponse } from 'shared'

AWS.config.loadFromPath('./src/config/awsCredentials.json')

enum S3Action {
	Get = 'getObject',
	Upload = 'putObject',
}

export interface IS3Service {
	signVersionUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
	signPictureUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
}

interface IS3ConfigOptions {
	Bucket: string
}

@DI.injectable()
export default class S3Service {
	private readonly s3 = new AWS.S3()

	constructor(private readonly s3Config: IS3ConfigOptions) {}

	@bind
	public async signVersionUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		return await this.constructUrls('versions', req)
	}

	@bind
	public async signPictureUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
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

	private async constructUrls(folderName: string, { name, type }: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
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
