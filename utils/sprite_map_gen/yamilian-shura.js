const _ = require('lodash');
const fs = require('fs');
const { SpriteOutputGen } = require('./output_gen');
const gridSize = {
  w: 64,
  h: 64
};
// const mapping = {};
let y = 4;
let x_r = _.range(0, 9);
let y_r = _.range(0, 4);
function direction(ind) {
  return ['Up', 'Left', 'Down', 'Right'][ind];
}
const mapping = _.reduce(y_r, (mapping, y) => {
  return _.reduce(x_r, (int_mapping, x) => {
    int_mapping[`walk_${direction(y)}_${x}`] = {
      x,
      y,
      w: 1,
      h: 1
    }
    return int_mapping;
  }, mapping)
}, {})

console.info(SpriteOutputGen)
const output = SpriteOutputGen.getSprite({gridSize, pivot: {x: .5, y: .5}}, mapping)

fs.writeFile(
  `${__dirname}/../../src/static/sprites/yamilian-shura-1.json`,
  JSON.stringify(output, null, 2),
  'utf-8',
  (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
        console.log(`File is written successfully!`);
    }
  }
);