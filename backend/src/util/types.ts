export class Empty {}

export type ObjectMap<T> = Map<T, T>

export type Newable<T> = new(...args: any[]) => T
