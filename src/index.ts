import { init, startTicking, moveYou } from "./execution";
import { Direction, simpleLocationDraw, Location } from "./classes/location";
import { List } from "immutable";
import { GameObject } from "./classes/interfaces/GameObject";
import { getCurrentLocation } from "./classes/state";
import { symbolLocationDraw } from "./classes/enhancements/location-draw";
import { Person } from "./classes/person";

const css = require("./main.css");

export default class Main {
    constructor() {
        console.log('Typescript Webpack starter launched');
        
        init();
        startTicking((res: List<GameObject>) => {
            document.getElementById("first-location").innerHTML = symbolLocationDraw(getCurrentLocation(res), res);
            document.getElementById("person-info").innerHTML = res.filter((obj) => {
                return obj instanceof Person
            }).map((person) => person.asString()).join("\n");
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