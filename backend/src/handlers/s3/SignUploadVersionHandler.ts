import { injectable, inject } from "inversify";
import { Services, Handlers } from "../../dependencies/symbols";
import { IS3Service } from "../../services/S3Service";
import { IHandler } from "../../util/mediator/Interfaces";
import { IRequest, ISignedUrlResponse, EventType } from "shared";
import bind from "bind-decorator";

@injectable()
export default class SignUploadVersionHandler implements IHandler<IRequest, ISignedUrlResponse> {
	@inject(Services.S3)
	private readonly s3Service: IS3Service

	readonly eventType = EventType.SignCreateVersionUrl

	@bind
	handle() {
		return this.s3Service.signUploadUrl()
	}
}