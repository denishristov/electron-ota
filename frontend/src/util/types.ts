export type ClassName = string | boolean | void | null | number

export interface IEvent {
	stopPropagation: () => void
	preventDefault: () => void
}

export interface IAnimatable {
	animation: React.CSSProperties
}

export interface IEntry {
	id: string
}

export type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
