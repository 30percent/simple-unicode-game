// import { Record } from "immutable";
import * as Immutable from "immutable"
import * as cuid from 'cuid';
import * as fp from 'lodash/fp';
import { Stringy, GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";

export type PersonParams = {
    name: string
    hp: number
}

export class Person extends Immutable.Record({hp: 0, _id: 0, name: ""}) implements GameObject, HealthInt {
    hp: number;
    _id: number;
    name: string;

    constructor(params: PersonParams){
        let toSup = fp.assign({
            _id: cuid()
        }, params);
        super(toSup);
    }
    asString() {
        return `${this.name}. Health: ${this.hp}`;
    }
}