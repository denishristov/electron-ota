import AWS from 'aws-sdk'
import { injectable } from 'inversify';
import { IS3SignUrlRequest, IS3SignUrlResponse } from 'shared';

AWS.config.loadFromPath('./src/util/awsCredentials.json')

enum S3Action {
	Get = 'getObject',
	Upload = 'putObject',
}

export interface IS3Service {
	signVersionUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
	signPictureUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse>
}

@injectable()
export default class S3Service {
	private readonly s3 = new AWS.S3()

	private static readonly defaultParams = {
		Bucket: 'electron-ota',
		ACL: 'public-read',
		Expires: 60 * 20,
	}

	async signVersionUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		return await this.constructUrls('versions', req)
	}

	async signPictureUploadUrl(req: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		return await this.constructUrls('pictures', req)
	}

	private signUrl(action: S3Action, params: any): Promise<string> {
		return new Promise((resolve, reject) => 
			this.s3.getSignedUrl(action, params, (error, signedRequest) => {
				error && reject(error)
				signedRequest && resolve(signedRequest)
			})
		)
	}

	private async constructUrls(folderName: string, { name, type }: IS3SignUrlRequest): Promise<IS3SignUrlResponse> {
		const params = {
			...S3Service.defaultParams,
			ContentType: type,
			Key: `${folderName}/${name}`,
		}

		return {
			downloadUrl: `https://s3.amazonaws.com/${params.Bucket}/${params.Key}`,
			signedRequest: await this.signUrl(S3Action.Upload, params),
		}
	}
}