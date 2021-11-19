const fs = require('fs');
const { SpriteOutputGen } = require('./output_gen');
const gridSize = {
  w: 32,
  h: 32
};
const mapping = {};
for(let x = 0; x < 6; x++) {
  for(let y = 0; y < 7; y++) {
    mapping[`grass_${x}_${y}`] = {
      x: x + 20,
      y: y + 0,
      w: 1,
      h: 1
    }
  }
}
mapping['wall_0_1'] = {
  x: 0,
  y: 0,
  w: 1,
  h: 1
}
mapping['ladder_hole_1'] = {
  x: 4,
  y: 2,
  w: 1,
  h: 1
};
// const mapping = {
//   grass1: {
//     x: 20,
//     y: 0,
//     w: 1,
//     h: 1,
//   }, 
//   grass2: {
//     x: 21,
//     y: 0,
//     w: 1,
//     h: 1,
//   },
//   grass3: {
//     x: 20,
//     y: 0,
//     w: 1,
//     h: 1,
//   }
// }
console.info(SpriteOutputGen)
const output = SpriteOutputGen.getSprite({gridSize}, mapping)

fs.writeFile(
  `${__dirname}/../../src/static/tilesets/hyptosis_tile-art-batch-1.json`,
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