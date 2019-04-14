import { SystemType } from 'shared'
import { colors } from './styles';

export const defaultSystemCounts = Object.values(SystemType).group((x) => [x, 0])

export const messages = {
	immediately: 'Release this version when its uploaded.',
	critical: 'Sets critical flag to true.',
	base: 'Version is distributed through app stores.',
}

export const reportTypes = ['downloading', 'downloaded', 'using', 'errorMessages']

export const actionColors = {
	downloading: colors.data.purple,
	downloaded: colors.data.green,
	using: colors.data.blue,
	errorMessages: colors.data.red,
}
