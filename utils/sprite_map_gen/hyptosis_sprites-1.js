const fs = require('fs');
const { SpriteOutputGen } = require('./output_gen');
const gridSize = {
  w: 32,
  h: 32
};
const mapping = {
  goblin: {
    x: 0,
    y: 7,
    w: 1,
    h: 2
  },
  zombie: {
    x: 4,
    y: 7,
    w: 1,
    h: 2
  },
  wizard: {
    x: 0,
    y: 5,
    w: 1,
    h: 2,
    align: "center"
  },
  barbarian: {
    x: 4,
    y: 5,
    w: 1,
    h: 2,
    align: "center",
  }
}
console.info(SpriteOutputGen)
const output = SpriteOutputGen.getSprite({gridSize}, mapping)

fs.writeFile(
  `${__dirname}/../../src/static/sprites/hyptosis_sprites-1.json`,
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