import { SystemType } from 'shared'

export const defaultSystemCounts = Object.values(SystemType).group((x) => [x, 2])
