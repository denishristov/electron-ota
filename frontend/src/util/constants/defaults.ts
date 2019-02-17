import { IEntry } from '../types'
import { SystemType } from 'shared'

export class Placeholder {
	public readonly id: 'placeholder'
}

export const placeholder = new Placeholder()

export const defaultSystemCounts = Object.values(SystemType).group((x) => [x, 0])
