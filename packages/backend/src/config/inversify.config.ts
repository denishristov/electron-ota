import { Container } from 'inversify'

import AppService, { IAppService } from '../services/AppService'
import AdminsService, { IAdminsService } from '../services/AdminsService'
import VersionService, { IVersionService } from '../services/VersionService'
import S3Service, { IFileUploadService } from '../services/S3Service'
import RegisterCredentialsService, { IRegisterCredentialsService } from '../services/RegisterCredentialsService'
import ClientService, { IClientService } from '../services/ClientService'
import ReleaseService, { IReleaseService } from '../services/ReleaseService'
import VersionReportsService, { IVersionReportsService } from '../services/VersionReportsService'
import ClientCounterService, { IClientCounterService } from '../services/ClientCounterService'

import { App } from '../models/App'
import { Admin } from '../models/Admin'
import { Version } from '../models/Version'
import { VersionReports } from '../models/VersionReports'
import { Client } from '../models/Client'

import AuthHook, { IAuthHook } from '../hooks/AuthHook'
import ReportHook, { IReportHook } from '../hooks/ReportHook'
import ReleaseUpdateHook, { IReleaseUpdateHook } from '../hooks/ReleaseUpdateHook'
import DeleteClientMediatorHook, { IDeleteClientMediatorHook } from '../hooks/DeleteClientMediatorHook'
import ValidationHook, { IValidationHook } from '../hooks/ValidationHook'
import CreateClientMediatorHook, { ICreateClientMediatorHook } from '../hooks/CreateClientMediatorHook'

import socketio from 'socket.io'

import { S3_CONFIG, PORT } from '.'

import adminMediatorFactory, { AdminMediatorFactory } from '../mediators/AdminMediatorFactory'
import clientsMediatorFactory, { ClientsMediatorFactory } from '../mediators/ClientsMediatorFactory'

import { ISocketMediator } from '../util/mediator/interfaces'

import { defaultSchemaOptions } from '../models/util'
import { ModelType } from 'typegoose'

import socketioConfig from './socketioConfig'
import { REGISTER_KEY } from './index'

const container = new Container()

container.bind<SocketIO.Server>(nameof<SocketIO.Server>())
	.toConstantValue(socketio(PORT, socketioConfig))

container.bind<IAdminsService>(nameof<IAdminsService>())
	.to(AdminsService)
	.inSingletonScope()

container.bind<IAppService>(nameof<IAppService>())
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(nameof<IVersionService>())
	.to(VersionService)
	.inSingletonScope()

container.bind<IFileUploadService>(nameof<IFileUploadService>())
	.toConstantValue(new S3Service(S3_CONFIG))

container.bind<IRegisterCredentialsService>(nameof<IRegisterCredentialsService>())
	.toConstantValue(new RegisterCredentialsService(REGISTER_KEY))

container.bind<IReleaseService>(nameof<IReleaseService>())
	.to(ReleaseService)
	.inSingletonScope()

container.bind<IClientService>(nameof<IClientService>())
	.to(ClientService)
	.inSingletonScope()

container.bind<IVersionReportsService>(nameof<IVersionReportsService>())
	.to(VersionReportsService)
	.inSingletonScope()

container.bind<IClientCounterService>(nameof<IClientCounterService>())
	.to(ClientCounterService)
	.inSingletonScope()

container.bind<ModelType<Admin>>(nameof<Admin>())
	.toConstantValue(new Admin().getModelForClass(Admin, defaultSchemaOptions))

container.bind<ModelType<App>>(nameof<App>())
	.toConstantValue(new App().getModelForClass(App, defaultSchemaOptions))

container.bind<ModelType<Version>>(nameof<Version>())
	.toConstantValue(new Version().getModelForClass(Version, defaultSchemaOptions))

container.bind<ModelType<VersionReports>>(nameof<VersionReports>())
	.toConstantValue(new VersionReports().getModelForClass(VersionReports, defaultSchemaOptions))

container.bind<ModelType<Client>>(nameof<Client>())
	.toConstantValue(new Client().getModelForClass(Client, defaultSchemaOptions))

container.bind<IAuthHook>(nameof<IAuthHook>())
	.to(AuthHook)
	.inSingletonScope()

container.bind<IValidationHook>(nameof<IValidationHook>())
	.to(ValidationHook)
	.inSingletonScope()

container.bind<ICreateClientMediatorHook>(nameof<ICreateClientMediatorHook>())
	.to(CreateClientMediatorHook)
	.inSingletonScope()

container.bind<IDeleteClientMediatorHook>(nameof<IDeleteClientMediatorHook>())
	.to(DeleteClientMediatorHook)
	.inSingletonScope()

container.bind<IReportHook>(nameof<IReportHook>())
	.to(ReportHook)
	.inSingletonScope()

container.bind<IReleaseUpdateHook>(nameof<IReleaseUpdateHook>())
	.to(ReleaseUpdateHook)
	.inSingletonScope()

container.bind<ClientsMediatorFactory>(nameof<ClientsMediatorFactory>())
	.toFactory(clientsMediatorFactory)

container.bind<AdminMediatorFactory>(nameof<AdminMediatorFactory>())
	.toFactory(adminMediatorFactory)

container.bind<Map<string, ISocketMediator>>(nameof<Map<string, ISocketMediator>>())
	.toConstantValue(new Map())

export default container
