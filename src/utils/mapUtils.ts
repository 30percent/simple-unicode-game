
type FilterMapIteratee<T, S> = (value: S, key: T) => boolean;
export function findMapKey<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): T {
  let entries = o.entries();
  // let iter
  for (let iter of entries) {
    if (iteratee(iter[1], iter[0])) {
      return iter[0];
    }
  }
}
export function findMapValue<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): S {
  let entries = o.entries();
  // let iter
  for (let iter of entries) {
    if (iteratee(iter[1], iter[0])) {
      return iter[1];
    }
  }
}

export function filterMapValue<T, S>(o: Map<T, S>, iteratee: FilterMapIteratee<T, S>): S[] {
  let entries = o.entries();
  let results: S[] = [];
  for (let iter of entries) {
    if (iteratee(iter[1], iter[0])) {
      results.push(iter[1]);
    }
  }
  return results;
}