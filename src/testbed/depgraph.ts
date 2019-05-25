import * as fp from 'lodash/fp';
import * as cuid from 'cuid';
import { RefData } from './names.mocks';
type SimpleStrObj = {
  [s: string]: string;
};
enum LinkType {}
export interface Link {
  from: DependencyInt;
  to: DependencyInt;
  asynchronous: boolean;
}

export type LinkGraph = Map<DependencyInt, { links: Set<Link> }>;

function setMap<T, S>(set: Set<T>, iterator: (i: T) => S): S[] {
  let result: S[] = [];
  set.forEach((v) => {
    result.push(iterator(v));
  });
  return result;
}
export class LinkStatics {
  private static linkGraph: LinkGraph = new Map<
    DependencyInt,
    { links: Set<Link> }
  >();
  private static graphUniqs: Set<DependencyInt> = new Set();
  static isConnected = (to: DependencyInt, from: DependencyInt): boolean => {
    let fromGraphPoint = LinkStatics.linkGraph.get(from);
    if (to === from || fromGraphPoint == null) return false;
    else {
      let isConnected: boolean = false;
      fromGraphPoint.links.forEach((link) => {
        if (isConnected === true) return;
        if (link.to === to) isConnected = true;
        else {
          isConnected = LinkStatics.isConnected(to, link.to);
        }
      });
      return isConnected;
    }
  };
  static isConnectedAsync = (
    to: DependencyInt,
    from: DependencyInt,
  ): boolean => {
    let fromGraphPoint = LinkStatics.linkGraph.get(from);
    if (to === from || fromGraphPoint == null) return false;
    else {
      let isConnected: boolean = false;
      fromGraphPoint.links.forEach((link) => {
        if (isConnected === true) return;
        if (link.to === to && link.asynchronous !== true) isConnected = true;
        else {
          isConnected = LinkStatics.isConnectedAsync(to,link.to);
        }
      });
      return isConnected;
    }
  };
  static getNearestDependents = (task: DependencyInt): DependencyInt[] => {
    let fromGraphPoint = LinkStatics.linkGraph.get(task);
    if (fromGraphPoint == null) return [];
    else {
      return setMap(fromGraphPoint.links, (link) => link.to);
    }
  }
  static canIWork = (task: DependencyInt): boolean => {
    let fromGraphPoint = LinkStatics.linkGraph.get(task);
    if (fromGraphPoint == null) return true;
    else {
      let safe: boolean = true;
      fromGraphPoint.links.forEach((link) => {
        if (safe === false) return;
        if (link.asynchronous !== true) safe = false;
      });
      return safe;
    }
  };
  static addLink = (link: Link) => {
    let links = LinkStatics.linkGraph.get(link.from);
    if (link.from === link.to) {
      console.error('Tried to create a link to self.');
      return;
    }
    if (LinkStatics.isConnected(link.from, link.to)) {
      console.error('Tried to create a cycle mah dude.');
      return;
    } else if (LinkStatics.isConnected(link.to, link.from)) {
      console.error('No need to duplicate links.');
      return;
    }
    if (links != null) {
      links.links.add(link);
    } else {
      LinkStatics.linkGraph.set(link.from, { links: new Set([link]) });
    }
    LinkStatics.graphUniqs.add(link.from);
    LinkStatics.graphUniqs.add(link.to);
    console.info ( `Created link between: ${link.from.getName()} and ${link.to.getName()}`)
  };
}

export interface DependencyInt {
  getName: () => string;
  getDescription: () => string;
  setName: (name: string) => void;
  setDescription: (name: string) => void;
  addTag: (str: string) => void;
  addTags: (strs: string[]) => void;
  getTags: () => string[];
}
// TODO: Convert to builder ('mutable until usable')
class Dependency implements DependencyInt {
  private name: string;
  private description: string;
  private tags: Set<string>;
  id: string;

  constructor({ name, description }: SimpleStrObj) {
    this.name = name;
    this.description = description;
    this.tags = new Set();
    this.id = cuid();
  }
  toString() {
    return this.name;
  }
  addTag = (str: string) => {
    this.tags.add(str);
  };
  addTags = (strs: string[]) => {
    strs.map(this.tags.add);
  };
  getTags = (): string[] => {
    let res: string[] = [];
    this.tags.forEach((v) => res.push(v));
    return res;
  };

  setName = (name: string) => (this.name = name);
  getName = () => this.name;
  setDescription = (description: string) => (this.description = description);
  getDescription = () => this.description;
}

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function createDummies(): DependencyInt[] {
  return fp.range(0, 10).map((range) => {
    let dep = new Dependency({
      name: RefData.FIRST_NAMES[range % RefData.FIRST_NAMES.length],
      description: RefData.LAST_NAMES[range % RefData.LAST_NAMES.length],
    });
    dep.addTag(RefData.TAGS[getRandom(0, RefData.TAGS.length - 1)]);
    return dep;
  });
}
export function dummyGraph(dums: DependencyInt[]): void {
  fp.range(0, 50).forEach(() => {
    LinkStatics.addLink({
      to: dums[Math.round(Math.random() * (dums.length - 1))],
      from: dums[Math.round(Math.random() * (dums.length - 1))],
      asynchronous: Math.random() * 2 >= 1
    })
  })
}

function getBottomLength( start: DependencyInt ): number {
  // let count: number = 0;
  if (LinkStatics.getNearestDependents(start).length <= 0) return 1;
  return LinkStatics.getNearestDependents(start).map( getBottomLength ).reduce((a, b) => a + b)
}

export function createGraphView(start: DependencyInt): string {
  let level: string[][] = [];
  let table: string = `<table>`;
  let createElementFromDep = (d: DependencyInt) => {
    return `<td style="color: ${(LinkStatics.canIWork(d) ? 'green' : 'red')}; border-right:1px solid grey"  colspan='${getBottomLength(d)}'>${d.getName()}</td>`;
  }
  // level.push([createElementFromDep(start)]);
  let getFurtherLevels = (curLevel: number, dep: DependencyInt) => {
    let nextLevel = curLevel + 1;
    if (level[nextLevel] == null ) {
      level[nextLevel] = [];
    }
    LinkStatics.getNearestDependents(dep).map((d) => {
      getFurtherLevels(nextLevel, d);
    });
    level[nextLevel] = level[nextLevel].concat(LinkStatics.getNearestDependents(dep).map((d) => createElementFromDep(d)))
  }
  getFurtherLevels(0, start);
  table = table.concat("</table>");
  return "<table>" + level.map((lD) => lD.map((s) => `${s}`).join('')).map((s) => `<tr> ${s} </tr>`).join('') + "</table>"
}