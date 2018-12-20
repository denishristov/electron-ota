import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IS3SignUrlRequest, IS3SignUrlResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IS3Service } from '../../services/S3Service'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class SignUploadPictureHandler implements IHandler<IS3SignUrlRequest, IS3SignUrlResponse> {
	public readonly eventType = EventType.SignUploadPictureUrl

	@inject(Services.S3)
	private readonly s3Service: IS3Service

	@bind
	public handle(req: IS3SignUrlRequest) {
		return this.s3Service.signPictureUploadUrl(req)
	}
}
