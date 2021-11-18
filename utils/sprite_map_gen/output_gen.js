class SpriteOutputGen {
  static getSprite(gridSize, mapping) {
    const output = {
      frames: {}
    };
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
        pivot: {
          // TODO: handle alternate alignments,
          x: .5,
          y: .5
        }
      }
      output.frames[name + ".png"] = remapped;
    })
    return output;
  }
}

module.exports = {
  SpriteOutputGen
}