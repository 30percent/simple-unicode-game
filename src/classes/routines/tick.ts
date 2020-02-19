import * as BlueProm from 'bluebird';

export async function tickFoo(
  count: number,
  time: number,
  tickAction: Function,
): BlueProm<any> {
  let iter = 0;
  return new BlueProm((resolve, _reject) => {
    let interval: any;
    function _next() {
      iter++;
      tickAction();
      if (count > 0 && iter >= count) {
        clearInterval(interval);
        resolve();
      }
      console.log(`Ran tick: ${iter}/${count}`)
    }
    interval = setInterval(_next, time);
  })
}
