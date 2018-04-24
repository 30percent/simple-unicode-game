import * as fp from 'lodash/fp';
import * as Promise from 'Bluebird';

export function tickFoo(count: number, time: number, tickAction: Function): Promise<any> {
    let curProm = Promise.resolve("");
    let iter = 0;
    function _next(): Promise<any> {
        return Promise.delay(time).then(() => {
            iter++;
            if(count > 0 && iter >= count) return;
            tickAction()
            return _next();
        });
    }
    return curProm.then(_next);

    // This is the 'pretty way', but it gets really messy for large numbers or infinite 
    // return fp.reduce((previous: Promise<any>) => {
    //     return previous.then(() => {
    //         return Promise.delay(time).then(() => {
    //             return tickAction();
    //         });
    //     });
    // }, Promise.resolve(""), fp.range(0, count));
}