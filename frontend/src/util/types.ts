export type ClassName = string | boolean | void | null | number

export interface IEvent {
	stopPropagation: () => void
	preventDefault: () => void
}
