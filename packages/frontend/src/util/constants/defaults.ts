import { SystemType } from 'shared'

export const defaultSystemCounts = Object.values(SystemType).group((x) => [x, 0])

export const messages = {
	immediately: 'Release this version when its uploaded.',
	critical: 'Sets critical flag to true.',
	base: 'Version is distributed through app stores.',
}
