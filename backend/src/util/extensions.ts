
declare global {
	interface Array<T> {
		toMap<K, V>(cb: (el: T) => ReadonlyArray<[K, V]>): Map<K, V>;	
	}
}

if (!Array.prototype.toMap) {
	Array.prototype.toMap = function<T, K, V>(this: T[], cb: (el: T) => ReadonlyArray<[K, V]>): Map<K, V> {
		return new Map(...this.map(cb))
	}
  }

export {}