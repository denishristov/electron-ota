import { IClientService } from '../services/ClientService'

import { SystemType } from 'shared'
import { randomInteger } from '../util/functions'
import { ModelType } from 'typegoose'
import { VersionReports } from '../models/VersionReports'
import { IAppService } from '../services/AppService'
import { Client } from '../models/Client'

const reportTypes = ['downloading', 'downloaded', 'using', 'errorMessages']

const names = [
	'Abigail',
	'Alexandra',
	'Alison',
	'Amanda',
	'Amelia',
	'Amy',
	'Andrea',
	'Angela',
	'Anna',
	'Anne',
	'Audrey',
	'Ava',
	'Bella',
	'Bernadette',
	'Carol',
	'Caroline',
	'Carolyn',
	'Chloe',
	'Claire',
	'Deirdre',
	'Diana',
	'Diane',
	'Donna',
	'Dorothy',
	'Elizabeth',
	'Ella',
	'Emily',
	'Emma',
	'Faith',
	'Felicity',
	'Fiona',
	'Gabrielle',
	'Grace',
	'Hannah',
	'Heather',
	'Irene',
	'Jan',
	'Jane',
	'Jasmine',
	'Jennifer',
	'Jessica',
	'Joan',
	'Joanne',
	'Julia',
	'Karen',
	'Katherine',
	'Kimberly',
	'Kylie',
	'Lauren',
	'Leah',
	'Lillian',
	'Lily',
	'Lisa',
	'Madeleine',
	'Maria',
	'Mary',
	'Megan',
	'Melanie',
	'Michelle',
	'Molly',
	'Natalie',
	'Nicola',
	'Olivia',
	'Penelope',
	'Pippa',
	'Rachel',
	'Rebecca',
	'Rose',
	'Ruth',
	'Sally',
	'Samantha',
	'Sarah',
	'Sonia',
	'Sophie',
	'Stephanie',
	'Sue',
	'Theresa',
	'Tracey',
	'Una',
	'Vanessa',
	'Victoria',
	'Virginia',
	'Wanda',
	'Wendy',
	'Yvonne',
	'Zoe',
]

const types = Object.keys(SystemType)

const releases = [
	'9.0.4',
	'2.6.8',
	'3.4.7',
	'22.6.5',
	'3.0.4',
	'9.6.1',
	'1.5.3',
	'22.6.5',
]

const dates = [
	'04/19/2019 10:41:09 AM',
	'04/19/2019 10:44:44 AM',
	'04/19/2019 10:48:53 AM',
	'04/19/2019 10:49:21 AM',
	'04/19/2019 11:09:21 AM',
	'04/19/2019 11:16:44 AM',
	'04/19/2019 11:23:11 AM',
	'04/19/2019 11:29:08 AM',
	'04/19/2019 11:31:24 AM',
	'04/19/2019 11:34:21 AM',
	'04/19/2019 11:41:55 AM',
	'04/19/2019 11:42:00 AM',
	'04/19/2019 11:46:58 AM',
	'04/19/2019 11:47:51 AM',
	'04/19/2019 11:56:32 AM',
	'04/19/2019 12:05:02 PM',
	'04/19/2019 12:06:42 PM',
	'04/19/2019 12:13:10 PM',
	'04/19/2019 12:21:45 PM',
	'04/19/2019 12:22:40 PM',
	'04/19/2019 12:27:19 PM',
	'04/19/2019 12:37:30 PM',
	'04/19/2019 12:42:40 PM',
	'04/19/2019 12:50:07 PM',
	'04/19/2019 12:51:04 PM',
	'04/19/2019 12:57:20 PM',
	'04/19/2019 01:00:56 PM',
	'04/19/2019 01:02:30 PM',
	'04/19/2019 01:08:43 PM',
	'04/19/2019 01:22:32 PM',
	'04/19/2019 01:33:57 PM',
	'04/19/2019 01:53:30 PM',
	'04/19/2019 02:00:04 PM',
	'04/19/2019 02:12:08 PM',
	'04/19/2019 02:14:15 PM',
	'04/19/2019 02:15:15 PM',
	'04/19/2019 02:17:54 PM',
	'04/19/2019 02:32:59 PM',
	'04/19/2019 02:39:05 PM',
	'04/19/2019 02:56:54 PM',
	'04/19/2019 03:02:58 PM',
	'04/19/2019 03:03:02 PM',
	'04/19/2019 03:07:15 PM',
	'04/19/2019 03:12:35 PM',
	'04/19/2019 03:29:13 PM',
	'04/19/2019 03:44:42 PM',
	'04/19/2019 03:53:23 PM',
	'04/19/2019 03:58:47 PM',
	'04/19/2019 04:00:09 PM',
	'04/19/2019 04:02:18 PM',
	'04/19/2019 04:05:07 PM',
	'04/19/2019 04:05:47 PM',
	'04/19/2019 04:14:08 PM',
	'04/19/2019 04:17:44 PM',
	'04/19/2019 04:19:21 PM',
	'04/19/2019 04:22:39 PM',
	'04/19/2019 04:36:25 PM',
	'04/19/2019 04:48:46 PM',
	'04/19/2019 04:52:25 PM',
	'04/19/2019 05:01:22 PM',
	'04/19/2019 05:02:50 PM',
	'04/19/2019 05:06:22 PM',
	'04/19/2019 05:27:35 PM',
	'04/19/2019 05:34:01 PM',
	'04/19/2019 05:41:50 PM',
	'04/19/2019 05:51:43 PM',
	'04/19/2019 05:52:20 PM',
	'04/19/2019 05:55:53 PM',
	'04/19/2019 06:22:25 PM',
	'04/19/2019 06:26:06 PM',
	'04/19/2019 06:33:33 PM',
	'04/19/2019 06:34:07 PM',
	'04/19/2019 06:35:09 PM',
	'04/19/2019 06:37:53 PM',
	'04/19/2019 06:48:12 PM',
	'04/19/2019 06:53:27 PM',
	'04/19/2019 07:00:16 PM',
	'04/19/2019 07:00:52 PM',
	'04/19/2019 07:01:18 PM',
	'04/19/2019 07:15:39 PM',
	'04/19/2019 07:23:37 PM',
	'04/19/2019 07:29:40 PM',
	'04/19/2019 07:33:26 PM',
	'04/19/2019 07:34:17 PM',
	'04/19/2019 07:38:41 PM',
	'04/19/2019 07:55:00 PM',
	'04/19/2019 07:58:52 PM',
	'04/19/2019 08:04:04 PM',
	'04/19/2019 08:04:39 PM',
	'04/19/2019 08:05:00 PM',
	'04/19/2019 08:19:14 PM',
	'04/19/2019 08:23:20 PM',
	'04/19/2019 08:29:58 PM',
	'04/19/2019 08:32:41 PM',
	'04/19/2019 08:37:41 PM',
	'04/19/2019 09:08:16 PM',
	'04/19/2019 09:09:49 PM',
	'04/19/2019 09:18:19 PM',
	'04/19/2019 09:18:36 PM',
	'04/19/2019 09:21:20 PM',
	'04/19/2019 09:25:30 PM',
	'04/19/2019 09:27:55 PM',
	'04/19/2019 09:33:46 PM',
	'04/19/2019 09:33:55 PM',
	'04/19/2019 09:38:36 PM',
	'04/19/2019 09:44:42 PM',
	'04/19/2019 09:51:36 PM',
	'04/19/2019 09:58:03 PM',
	'04/19/2019 10:03:16 PM',
	'04/19/2019 10:03:50 PM',
	'04/19/2019 10:07:23 PM',
	'04/19/2019 10:09:58 PM',
	'04/19/2019 10:10:01 PM',
	'04/19/2019 10:14:48 PM',
	'04/19/2019 10:15:47 PM',
	'04/19/2019 10:17:41 PM',
	'04/19/2019 10:19:36 PM',
	'04/19/2019 10:19:43 PM',
	'04/19/2019 10:20:06 PM',
	'04/19/2019 10:21:00 PM',
	'04/19/2019 10:25:10 PM',
	'04/19/2019 10:30:22 PM',
	'04/19/2019 10:36:02 PM',
	'04/19/2019 10:38:26 PM',
	'04/19/2019 10:42:07 PM',
	'04/19/2019 10:42:51 PM',
	'04/19/2019 10:54:25 PM',
	'04/19/2019 10:57:59 PM',
	'04/19/2019 10:59:37 PM',
	'04/19/2019 11:08:23 PM',
	'04/19/2019 11:12:45 PM',
	'04/19/2019 11:13:50 PM',
	'04/19/2019 11:14:32 PM',
	'04/19/2019 11:17:12 PM',
	'04/19/2019 11:25:36 PM',
	'04/19/2019 11:47:42 PM',
	'04/19/2019 11:53:48 PM',
	'04/19/2019 11:58:37 PM',

].map((z) => new Date(z))

@injectable()
export default class Seed {
	constructor(
		@inject(nameof<Client>())
		private readonly Clients: ModelType<Client>,
		@inject(nameof<VersionReports>())
		private readonly VersionReportModel: ModelType<VersionReports>,
		@inject(nameof<IAppService>())
		private readonly appService: IAppService,
	) { }

	public async seed() {
		console.log('start')
		const users = await this.Clients.find()

		const { versions } = await this.appService.getAppVersions({ appId: '5c66bc65781c7c4e2d980b89' })
		console.log(versions)
		for (const version of versions) {
			for (const type of reportTypes) {
				for (const user of users.slice(0, randomInteger(50, 100))) {
					console.log(type)
					await this.VersionReportModel.findOneAndUpdate({ version: version.id }, {
						$push: { [type]: { client: user.id, timestamp: dates[randomInteger(0, dates.length)] } },
					})
				}
			}
		}

		console.log('done')
	}
}
