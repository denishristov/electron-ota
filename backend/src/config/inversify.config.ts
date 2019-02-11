import { Container } from 'inversify'

import AppService, { IAppService } from '../services/AppService'
import AdminsService, { IAdminsService } from '../services/AdminsService'
import VersionService, { IVersionService } from '../services/VersionService'
import S3Service, { IFileUploadService } from '../services/S3Service'
import RegisterCredentialsService, { IRegisterCredentialsService } from '../services/RegisterCredentialsService'
import ClientService, { IClientService } from '../services/ClientService'
import ReleaseService, { IReleaseService } from '../services/ReleaseService'
import VersionReportsService, { IVersionReportsService } from '../services/VersionReportsService'

import { App } from '../models/App'
import { Admin } from '../models/Admin'
import { Version } from '../models/Version'
import { VersionReports } from '../models/VersionReports'
import { Client } from '../models/Client'

import AuthHook from '../hooks/AuthHook'
import ReportHook from '../hooks/ReportHook'
import ReleaseUpdateHook from '../hooks/ReleaseUpdateHook'
import ClientMediatorManagerHook from '../hooks/ClientMediatorManagerHook'
import ValidationHook from '../hooks/ValidationHook'

import socketio from 'socket.io'

import { S3_CONFIG, PORT } from '.'

import adminMediatorFactory from '../mediators/AdminMediatorFactory'
import clientsMediatorFactory, { ClientsMediatorFactory } from '../mediators/ClientsMediatorFactory'

import { IPreRespondHook, IPostRespondHook, ISocketMediator } from '../util/mediator/interfaces'

import { defaultSchemaOptions } from '../models/util'
import { ModelType } from 'typegoose'

import socketioConfig from './socketioConfig'

const container = new Container()

container.bind<SocketIO.Server>(DI.Server)
	.toConstantValue(socketio(PORT, socketioConfig))

container.bind<IAdminsService>(DI.Services.Admin)
	.to(AdminsService)
	.inSingletonScope()

container.bind<IAppService>(DI.Services.App)
	.to(AppService)
	.inSingletonScope()

container.bind<IVersionService>(DI.Services.Version)
	.to(VersionService)
	.inSingletonScope()

container.bind<IFileUploadService>(DI.Services.FileUpload)
	.toConstantValue(new S3Service(S3_CONFIG))

container.bind<IRegisterCredentialsService>(DI.Services.RegisterCredentials)
	.to(RegisterCredentialsService)
	.inSingletonScope()

container.bind<IReleaseService>(DI.Services.Update)
	.to(ReleaseService)
	.inSingletonScope()

container.bind<IClientService>(DI.Services.Client)
	.to(ClientService)
	.inSingletonScope()

container.bind<IVersionReportsService>(DI.Services.VersionReports)
	.to(VersionReportsService)
	.inSingletonScope()

container.bind<ModelType<Admin>>(DI.Models.Admin)
	.toConstantValue(new Admin().getModelForClass(Admin, defaultSchemaOptions))

container.bind<ModelType<App>>(DI.Models.App)
	.toConstantValue(new App().getModelForClass(App, defaultSchemaOptions))

container.bind<ModelType<Version>>(DI.Models.Version)
	.toConstantValue(new Version().getModelForClass(Version, defaultSchemaOptions))

container.bind<ModelType<VersionReports>>(DI.Models.VersionReports)
	.toConstantValue(new VersionReports().getModelForClass(VersionReports, defaultSchemaOptions))

container.bind<ModelType<Client>>(DI.Models.Client)
	.toConstantValue(new Client().getModelForClass(Client, defaultSchemaOptions))

container.bind<IPreRespondHook>(DI.Hooks.Auth)
	.to(AuthHook)
	.inSingletonScope()

container.bind<IPostRespondHook>(DI.Hooks.ClientMediatorManager)
	.to(ClientMediatorManagerHook)
	.inSingletonScope()

container.bind<IPostRespondHook>(DI.Hooks.Report)
	.to(ReportHook)
	.inSingletonScope()

container.bind<IPostRespondHook>(DI.Hooks.ReleaseUpdate)
	.to(ReleaseUpdateHook)
	.inSingletonScope()

container.bind<IPreRespondHook>(DI.Hooks.Validation)
	.to(ValidationHook)
	.inSingletonScope()

container.bind<ClientsMediatorFactory>(DI.Factories.ClientsMediator)
	.toFactory(clientsMediatorFactory)

container.bind(DI.Factories.AdminsMediator)
	.toFactory(adminMediatorFactory)

container.bind<Map<string, ISocketMediator>>(DI.Mediators)
	.toConstantValue(new Map())

export default container
