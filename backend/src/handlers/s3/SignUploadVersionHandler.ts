import { injectable, inject } from "inversify";
import { Services, Handlers } from "../../dependencies/symbols";
import { IS3Service } from "../../services/S3Service";
import { IHandler } from "../../util/mediator/Interfaces";
import { IRequest, IS3SignUrlResponse, IS3SignUrlRequest, EventType } from "shared";
import bind from "bind-decorator";

@injectable()
export default class SignUploadVersionHandler implements IHandler<IS3SignUrlRequest, IS3SignUrlResponse> {
	@inject(Services.S3)
	private readonly s3Service: IS3Service

	readonly eventType = EventType.SignUploadVersionUrl

	@bind
	handle(req: IS3SignUrlRequest) {
		return this.s3Service.signVersionUploadUrl(req)
	}
}