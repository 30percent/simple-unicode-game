import * as fp from 'lodash/fp';
import { Stringy } from "../interfaces/GameObject";
import { produce } from 'immer';
import { BaseItem } from './item';
type ItemHolder = {
  [id: string]: {
    readonly object: BaseItem,
    readonly amount: number
  }
}
export class Inventory implements Stringy {
  readonly items: ItemHolder;

  constructor() {
    this.items = {};
  }

  addItem(item: BaseItem): Inventory {
    return produce(this, (draft) => {
      if (fp.has(item._id, this.items)) {
        draft.items[item._id].amount += 1;
      } else {
        fp.noop();
        draft.items[item._id] = {
          object: item,
          amount: 1
        }
      }
    });
  }

  removeItem(item: BaseItem): Inventory {
    return produce(this, (draft) => {
      if (fp.has(item._id, draft.items)) {
        draft.items[item._id].amount -= 1;
        if (draft.items[item._id].amount <= 0) {
          draft.items = fp.unset(item._id, draft.items);
        }
      }
    })
  }

  asString(): string {
    return fp.map((item) => {
      return `${item.object.asString()}: ${item.amount}`
    }, this.items).join('\n');
  }
}