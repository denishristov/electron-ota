import AWS from 'aws-sdk'
import { injectable } from 'inversify';
import { ISignedUrlResponse } from 'shared';

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-2:32adaf7c-546c-4163-9e1d-4a6ff1680fb9',
})

AWS.config.loadFromPath('./src/util/awsCredentials.json')

// console.log(AWS.config)

const defaultBucketParams = { 
	Bucket: 'electron-ota',
	Key: 'versions',
	Expires: 60 * 15
}

export interface IS3Service {
	signUploadUrl(): Promise<ISignedUrlResponse>
}

@injectable()
export default class S3Service {
	private readonly s3 = new AWS.S3()

	signUploadUrl(): Promise<ISignedUrlResponse> {
		return this.signUrl('putObject')
	}

	private signUrl(action: string): Promise<ISignedUrlResponse> {
		return new Promise((resolve, reject) => 
			this.s3.getSignedUrl(action, defaultBucketParams, (error, url) => {
				error && reject(error)
				url && resolve({ url })
			})
		)
	}
}