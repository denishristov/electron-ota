
declare global {
	interface Array<T> {
		toMap<K, V>(cb: (el: T) => ReadonlyArray<[K, V]>): Map<K, V>
		toObject<K, V>(cb: (el: T) => ReadonlyArray<[K, V]>): object
	}
}

if (!Array.prototype.toMap) {
	Array.prototype.toMap = function<T, K, V>(this: T[], ack: (el: T) => ReadonlyArray<[K, V]>): Map<K, V> {
		return new Map(Array.prototype.map.call(this, ack))
	}
}

if (!Array.prototype.toObject) {
	Array.prototype.toObject = function<T, K, V>(this: T[], ack: (el: T) => ReadonlyArray<[K, V]>): any {
		return Array.prototype.map.call(this, ack).reduce((map: any, [key, val]: any[]) => {
			map[key] = val
			return map
		}, {})
	}
}

export {}