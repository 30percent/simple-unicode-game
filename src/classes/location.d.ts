import { Record, Map } from "immutable";
import { GameObject } from "./interfaces/GameObject";
export declare type LocationParams = {
    name: string;
    roomLimit: Vector;
};
export declare enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
}
declare const Vector_base: Record.Class;
export declare class Vector extends Vector_base {
    x: number;
    y: number;
}
declare const Location_base: Record.Class;
export declare class Location extends Location_base implements GameObject {
    _id: number;
    name: string;
    objects: Map<number, Vector>;
    roomLimit: Vector;
    constructor(params: LocationParams);
    asString(): string;
    addObject(pos: Vector, object: GameObject): Location;
    hasObject(object: GameObject): boolean;
    isPositionOccupied(pos: Vector): boolean;
    isPositionInbounds(pos: Vector): boolean;
}
export declare function moveObject(location: Location, objectId: number, pos: Vector): Location;
export declare function simpleLocationDraw(location: Location): string;
export declare function moveDirection(location: Location, objectId: number, direction: Direction, amount: number): Location;
