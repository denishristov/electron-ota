type Pair<V> = [string, V]

declare global {
	interface Array<T> {
		toMap<K, V>(cb: (el: T) => ReadonlyArray<[K, V]>): Map<K, V>
		group<K, V>(cb: (el: T, index?: number) => Pair<V>): { [key: string]: V }
	}
}

Object.defineProperties(Array.prototype, {
	toMap: {
		value<T, K, V>(this: T[], cb: (el: T) => ReadonlyArray<[K, V]>): Map<K, V> {
			return new Map(Array.prototype.map.call(this, cb))
		},
	},
	group: {
		value<T, V>(this: T[], cb: (el: T, index?: number) => Pair<V>): { [key: string]: V } {
			return Array.prototype.map.call(this, cb)
				.reduce((map: any, [key, val]: any[]) => {
					map[key] = val
					return map
				}, {})
		},
	},
})

export {}
