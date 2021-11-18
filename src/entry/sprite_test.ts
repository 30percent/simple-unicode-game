import * as spritejs from 'spritejs';
const { Scene, Path, Sprite, Group, Layer } = spritejs;

const css = require('../main.css');
const sprite_css = require('../styles/sprite_styles.css');

export default class Main {
  constructor () {
    createSpriteInstance().then(() => {
      
    });
  }
}

async function createSpriteInstance() {
  const sprite_container = document.getElementById('sprite-test');
  const scene = new Scene({
    container: sprite_container,
    width: 20*32,
    height: 20*32,
  });
  await scene.preload([
    'static/sprites/hyptosis_sprites-1.png',
    'static/sprites/hyptosis_sprites-1.json'
  ])
  await scene.preload([
    'static/tilesets/hyptosis_tile-art-batch-1.png',
    'static/tilesets/hyptosis_tile-art-batch-1.json'
  ])
  const back_layer = scene.layer('background-1');
  const fore_layer = scene.layer('foreground-1');
  createBackground(back_layer);
  const barbarian = new Sprite('barbarian.png');
  barbarian.attr({
    pos: [0, 0]
  })
  const goblin = new Sprite('goblin.png');
  goblin.attr({
    pos: [1, 0]
  });
  fore_layer.append(barbarian, goblin);

  const animation = barbarian.animate([
    {translate: [0,0]},
    {translate: [50, 0]},
    {translate: [50, 50]}
  ], {
    duration: 1000,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'ease-in-out',
  });

}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function createBackground(layer: any) {
  const grassGrp = new Group();
  grassGrp.attr({
    size: [32*5, 32*5],
    pos: [0, 0],
    anchor: [0,0],
    bgcolor: '#fff'
  });
  layer.append(grassGrp);
  for(let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      const grassName = `grass_${getRandomInt(0, 1)}_${getRandomInt(0, 2)}.png`;
      console.log(grassName);
      const grass1 = new Sprite(grassName);
      grass1.attr({
        pos: [x*32,y*32]
      });
      layer.append(grass1);
    }
  }
}

const start = new Main();