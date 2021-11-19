const _ = require('lodash');

class SpriteOutputGen {
  static getSprite({gridSize, pivot}, mapping) {
    const output = {
      frames: {}
    };
    pivot = _.isNil(pivot) ? {x: .5, y: .5} : pivot;
    Object.keys(mapping).forEach(name => {
      const obj = mapping[name];
      const remapped = {
        frame: {
          x: obj.x * gridSize.w,
          y: obj.y * gridSize.h,
          w: obj.w * gridSize.w,
          h: obj.h * gridSize.h,
          rotated: false,
          trimmed: false
        },
        // spriteSourceSize: {
        //   x: obj.x * gridSize.w,
        //   y: obj.y * gridSize.h,
        //   w: obj.w * gridSize.w,
        //   h: obj.h * gridSize.h,
        // },
        // sourceSize: {
        //   w: obj.w * gridSize.w,
        //   h: obj.h * gridSize.h,
        // },
        pivot: pivot
      }
      output.frames[name + ".png"] = remapped;
    })
    return output;
  }
}

module.exports = {
  SpriteOutputGen
}