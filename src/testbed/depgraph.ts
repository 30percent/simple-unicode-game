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

export class LinkStatics {
  private static linkGraph: LinkGraph = new Map<
    DependencyInt,
    { links: Set<Link> }
  >();
  static isConnected = (to: DependencyInt, from: DependencyInt): boolean => {
    let fromGraphPoint = LinkStatics.linkGraph.get(from);
    if (to === from || fromGraphPoint == null) return false;
    else {
      let isConnected: boolean = false;
      fromGraphPoint.links.forEach((link) => {
        if (isConnected === true) return;
        if (link.to === to) isConnected = true;
        else {
          isConnected = LinkStatics.isConnectedAsync(to, link.to);
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
          isConnected = LinkStatics.isConnectedAsync(to, link.to);
        }
      });
      return isConnected;
    }
  };
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
    if (LinkStatics.isConnected(link.from, link.to)) {
      console.error('Tried to create a cycle mah dude.');
      return;
    }
    if (links != null) {
      links.links.add(link);
    } else {
      LinkStatics.linkGraph.set(link.from, { links: new Set([link]) });
    }
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
