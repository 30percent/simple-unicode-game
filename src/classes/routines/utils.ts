import { find, filter } from 'lodash/fp';
export function setFind<T>(set: Set<T>, comparator: (v: T) => boolean): T {
  return find(comparator, Array.from(set.values()));
}
export function setFilter<T>(set: Set<T>, comparator: (v: T) => boolean): T[] {
  return filter(comparator, Array.from(set.values()));
}
