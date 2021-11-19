import _ = require('lodash');
import * as spritejs from 'spritejs';
import { dirAsString, Direction } from '../classes/structs/Direction';
import * as TWEEN from '@tweenjs/tween.js';

const { Scene, Path, Sprite, Group, Layer } = spritejs;

const css = require('../main.css');
const sprite_css = require('../styles/sprite_styles.css');


// next, support "quick" swapping
export default class Main {
  scene: spritejs.Scene;
  activeAnim: spritejs.Animation | null;
  currentDir: Direction | null;
  tweenGroup: TWEEN.Group; //going to do some silly things to test
  walkActive: boolean = false;
  activeKeys: Direction[] = [];
  // tween: TWEEN.Tween<any>;

  constructor () {
    this.tweenGroup = new TWEEN.Group();
    document.addEventListener('keydown', async (event) => {
      const movin = __directionFromKey(event);
      if (_.isNil(this.scene) || _.isNil(movin)) return;
      const character: spritejs.Sprite = this.scene.getElementById('character') as spritejs.Sprite;
      
      if (
        this.activeKeys.indexOf(movin.dir) >= 0
        || _.isNil(character)
      ) {
        return;
      }
      // there has to be a better way :thinking:
      this.activeKeys.push(movin.dir);
      this.tweenGroup.removeAll();
      this.genTween(character, this.activeKeys);
    });

    createSpriteInstance().then((scene) => {
      this.scene = scene;
      requestAnimationFrame(this.animate);
    });
    document.addEventListener('keyup', async (event) => {
      this.walkActive = false;
      const movin = __directionFromKey(event);
      this.activeKeys = this.activeKeys.filter(k => k != movin.dir);

      this.tweenGroup.getAll().forEach(f => f.stop());
      this.tweenGroup.removeAll();
      const character = this.scene.getElementById('character') as spritejs.Sprite;
      if (this.activeKeys.length > 0 && !_.isNil(character)) {
        this.genTween(character, this.activeKeys);
      }
    });
  }

  genTween(sprite: spritejs.Sprite, dir: Direction[]) {
    let {x: curX, y: curY} = sprite.attributes;
    let {xTrans, yTrans} = dir.reduce((acc, dir) => {
      switch (dir) {
        case Direction.Up:
          acc.yTrans = '-32';
          break;
        case Direction.Down:
          acc.yTrans = '+32';
          break;
        case Direction.Left:
          acc.xTrans = '-32';
          break;
        case Direction.Right:
          acc.xTrans = '+32';
          break;
      }
      return acc;
    }, {xTrans: '+0', yTrans: '+0'})
    let dirStr = dirAsString(dir[0]);
    let newTween = new TWEEN.Tween<spritejs.ArgAttrs>({x: curX, y: curY, frame: 0}, this.tweenGroup);
    newTween
      .to({
        x: xTrans,
        y: yTrans,
        frame: 8
      }, 250)
      .onUpdate((tweenO) => {
        sprite.attr({
          texture: `walk_${dirStr}_${Math.floor(tweenO.frame)}.png`,
          x: tweenO.x,
          y: tweenO.y
        })
      })
      .onStop(() => {
        sprite.attr({
          texture: `walk_${dirStr}_${0}.png`
        })
      })
      .repeat(Infinity)
      .start();
  }

  private animate = () => {
    const fore_layer = this.scene.children.find(i => i.id === 'foreground-1');
    requestAnimationFrame(this.animate);
    // timeline can be used here to control flow of time
    this.tweenGroup.update();
  }
}

async function spriteWalkTest(scene: spritejs.Scene, layer: spritejs.Layer) {
  await scene.preload([
    'static/sprites/yamilian-shura.png',
    'static/sprites/yamilian-shura-1.json'
  ]);
  
  const shura_front = new Sprite('walk_Left_1.png');
  shura_front.attr({
    anchor: [.25, .5],
    x: 32*2,
    y: 32 * 2,
    id: 'character'
  })
  layer.append(shura_front);
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
    'static/tilesets/hyptosis_tile-art-batch-1-grid.png',
    'static/tilesets/hyptosis_tile-art-batch-1.json'
  ])
  const back_layer = scene.layer('background-1');
  const fore_layer = scene.layer('foreground-1');
  await spriteWalkTest(scene, fore_layer);
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
  return scene;
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
      const grass1 = new Sprite(grassName);
      grass1.attr({
        pos: [x*32,y*32]
      });
      layer.append(grass1);
    }
  }
}
function __directionFromKey(event: KeyboardEvent): {dir: Direction, dist: number} {
  let dir: Direction, dist: number;
  dist = (event.shiftKey == true) ? 2 : 1;
  switch (event.key) {
    case "ArrowLeft":
      dir = Direction.Left;
      break;
    case "ArrowUp":
      dir = Direction.Up;
      break;
    case "ArrowRight":
      dir = Direction.Right;
      break;
    case "ArrowDown":
      dir = Direction.Down;
      break;
    default:
      dir = null;
  }
  return {dir, dist};
}
const start = new Main();