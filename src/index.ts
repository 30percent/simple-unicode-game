import { init, startTicking, moveYou } from "./execution";
import { Direction } from "./classes/location";

export default class Main {
    constructor() {
        console.log('Typescript Webpack starter launched');
        
        init();
        startTicking((res) => {
            document.getElementById("first-location").innerHTML = res;
        });
        document.addEventListener('keyup', (event) => {
            moveYou(__directionFromKey(event));
        })
    }
}

function __directionFromKey(event: KeyboardEvent): Direction {
    switch(event.keyCode) {
        case 37:
            return Direction.Left
        case 38:
            return Direction.Up
        case 39:
            return Direction.Right
        case 40:
            return Direction.Down
        default:
            return null;
    }
}

let start = new Main();