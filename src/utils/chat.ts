import { Place } from './../classes/place';
import { get } from 'lodash/fp';
type ChatItem = { text: string; options?: { text: string; nextid: number }[] };
class chat {
  items: ChatItem[];
  currentId: number;

  constructor(items: ChatItem[]) {
    this.items = items;
  }
}

let exampleChat = new chat([
  {
    text: 'Hello player!',
    options: [
      {
        text: 'Hi there',
        nextid: -1,
      },
    ],
  },
]);

function getResponse(place: Place, userId: number): string {
  // find nearest character
  // get chatup line

  return get(`items.${exampleChat.currentId}`, exampleChat);
}
