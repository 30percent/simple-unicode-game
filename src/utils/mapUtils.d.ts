declare type FilterMapIteratee<T, S> = (value: S, key: T) => boolean;
export declare function findMapKey<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): T;
export declare function findMapValue<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): S;
export declare function filterMapValue<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): S[];
export {};
