import * as fp from 'lodash/fp';
import * as BlueProm from 'bluebird';

export async function tickFoo(
  count: number,
  time: number,
  tickAction: Function,
): BlueProm<any> {
  let iter = 0;
  async function _next(): BlueProm<any> {
    await BlueProm.delay(time);
    iter++;
    if (count > 0 && iter >= count) return;
    tickAction();
    return _next();
  }
  return await _next();

  // This is the 'pretty way', but it gets really messy for large numbers or infinite
  // return fp.reduce((previous: Promise<any>) => {
  //     return previous.then(() => {
  //         return Promise.delay(time).then(() => {
  //             return tickAction();
  //         });
  //     });
  // }, Promise.resolve(""), fp.range(0, count));
}
