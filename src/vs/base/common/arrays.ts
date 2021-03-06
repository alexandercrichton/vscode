/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

/**
 * Returns the last element of an array.
 * @param array The array.
 * @param n Which element from the end (default ist zero).
 */
export function tail<T>(array: T[], n: number = 0): T {
	return array[array.length - (1 + n)];
}

/**
 * Iterates the provided array and allows to remove
 * elements while iterating.
 */
export function forEach<T>(array: T[], callback: (element: T, remove: Function) => void): void {
	for (var i = 0, len = array.length; i < len; i++) {
		callback(array[i], function () {
			array.splice(i, 1);
			i--; len--;
		});
	}
}

export function equals<T>(one: T[], other: T[], itemEquals: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
	if (one.length !== other.length) {
		return false;
	}

	for (var i = 0, len = one.length; i < len; i++) {
		if (!itemEquals(one[i], other[i])) {
			return false;
		}
	}

	return true;
}

export function binarySearch<T>(array: T[], key: T, comparator: (op1: T, op2: T) => number): number {
	let low = 0,
		high = array.length - 1;

	while (low <= high) {
		let mid = ((low + high) / 2) | 0;
		let comp = comparator(array[mid], key);
		if (comp < 0) {
			low = mid + 1;
		} else if (comp > 0) {
			high = mid - 1;
		} else {
			return mid;
		}
	}
	return -(low + 1);
}

/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */
export function findFirst<T>(array: T[], p: (x: T) => boolean): number {
	let low = 0, high = array.length;
	if (high === 0) {
		return 0; // no children
	}
	while (low < high) {
		let mid = Math.floor((low + high) / 2);
		if (p(array[mid])) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}
	return low;
}

/**
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @return The first n elemnts from array when sorted with compare.
 */
export function top<T>(array: T[], compare: (a: T, b: T) => number, n: number): T[] {
	if (n === 0) {
		return [];
	}
	const result = array.slice(0, n).sort(compare);
	for (let i = n, m = array.length; i < m; i++) {
		const element = array[i];
		if (compare(element, result[n - 1]) < 0) {
			result.pop();
			const j = findFirst(result, e => compare(element, e) < 0);
			result.splice(j, 0, element);
		}
	}
	return result;
}

export function merge<T>(arrays: T[][], hashFn?: (element: T) => string): T[] {
	const result = new Array<T>();
	if (!hashFn) {
		for (let i = 0, len = arrays.length; i < len; i++) {
			result.push.apply(result, arrays[i]);
		}
	} else {
		const map: { [k: string]: boolean } = {};
		for (let i = 0; i < arrays.length; i++) {
			for (let j = 0; j < arrays[i].length; j++) {
				let element = arrays[i][j],
					hash = hashFn(element);

				if (!map.hasOwnProperty(hash)) {
					map[hash] = true;
					result.push(element);
				}
			}
		}
	}
	return result;
}

/**
 * @returns a new array with all undefined or null values removed. The original array is not modified at all.
 */
export function coalesce<T>(array: T[]): T[] {
	if (!array) {
		return array;
	}

	return array.filter(e => !!e);
}

/**
 * @returns true if the given item is contained in the array.
 */
export function contains<T>(array: T[], item: T): boolean {
	return array.indexOf(item) >= 0;
}

/**
 * Swaps the elements in the array for the provided positions.
 */
export function swap(array: any[], pos1: number, pos2: number): void {
	const element1 = array[pos1];
	const element2 = array[pos2];

	array[pos1] = element2;
	array[pos2] = element1;
}

/**
 * Moves the element in the array for the provided positions.
 */
export function move(array: any[], from: number, to: number): void {
	array.splice(to, 0, array.splice(from, 1)[0]);
}

/**
 * @returns {{false}} if the provided object is an array
 * 	and not empty.
 */
export function isFalsyOrEmpty(obj: any): boolean {
	return !Array.isArray(obj) || (<Array<any>>obj).length === 0;
}

/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equalness by returning a unique string for each.
 */
export function distinct<T>(array: T[], keyFn?: (t: T) => string): T[] {
	if (!keyFn) {
		return array.filter((element, position) => {
			return array.indexOf(element) === position;
		});
	}

	const seen: { [key: string]: boolean; } = Object.create(null);
	return array.filter((elem) => {
		const key = keyFn(elem);
		if (seen[key]) {
			return false;
		}

		seen[key] = true;

		return true;
	});
}

export function uniqueFilter<T>(keyFn: (t: T) => string): (t: T) => boolean {
	const seen: { [key: string]: boolean; } = Object.create(null);

	return element => {
		const key = keyFn(element);

		if (seen[key]) {
			return false;
		}

		seen[key] = true;
		return true;
	};
}

export function firstIndex<T>(array: T[], fn: (item: T) => boolean): number {
	for (let i = 0; i < array.length; i++) {
		const element = array[i];

		if (fn(element)) {
			return i;
		}
	}

	return -1;
}

export function first<T>(array: T[], fn: (item: T) => boolean, notFoundValue: T = null): T {
	const index = firstIndex(array, fn);
	return index < 0 ? notFoundValue : array[index];
}

export function commonPrefixLength<T>(one: T[], other: T[], equals: (a: T, b: T) => boolean = (a, b) => a === b): number {
	let result = 0;

	for (var i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
		result++;
	}

	return result;
}

export function flatten<T>(arr: T[][]): T[] {
	return arr.reduce((r, v) => r.concat(v), []);
}

export function range(to: number, from = 0): number[] {
	const result: number[] = [];

	for (let i = from; i < to; i++) {
		result.push(i);
	}

	return result;
}

export function fill<T>(num: number, valueFn: () => T, arr: T[] = []): T[] {
	for (let i = 0; i < num; i++) {
		arr[i] = valueFn();
	}

	return arr;
}

export function index<T>(array: T[], indexer: (t: T) => string): { [key: string]: T; };
export function index<T, R>(array: T[], indexer: (t: T) => string, merger?: (t: T, r: R) => R): { [key: string]: R; };
export function index<T, R>(array: T[], indexer: (t: T) => string, merger: (t: T, r: R) => R = t => t as any): { [key: string]: R; } {
	return array.reduce((r, t) => {
		const key = indexer(t);
		r[key] = merger(t, r[key]);
		return r;
	}, Object.create(null));
}

/**
 * Inserts an element into an array. Returns a function which, when
 * called, will remove that element from the array.
 */
export function insert<T>(array: T[], element: T): () => void {
	array.push(element);

	return () => {
		const index = array.indexOf(element);
		if (index > -1) {
			array.splice(index, 1);
		}
	};
}