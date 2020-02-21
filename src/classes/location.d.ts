import { GameObject } from "./interfaces/GameObject";
import { Direction } from './structs/Direction';
declare type VectorMut = {
    x: number;
    y: number;
};
export declare class Vector {
    x: number;
    y: number;
    constructor(params: VectorMut);
    toString(): string;
}
export declare type LocationParams = {
    name: string;
    roomLimit: Vector;
    symbol?: string;
    _id?: string;
};
export declare class Location implements GameObject {
    symbol: string;
    _id: string;
    name: string;
    objects: Map<string, Vector>;
    walls: Vector[];
    roomLimit: Vector;
    constructor(params: LocationParams);
    asString(): string;
    addObject(pos: Vector, objectId: string): Location;
    addWall(pos: Vector): Location;
    removeObject(objectId: string): Location;
    setObjectLocation(objectId: string, pos: Vector): Location;
    validPos(pos: Vector): boolean;
    isPositionOccupied(pos: Vector): boolean;
    isWallAtPosition(pos: Vector): boolean;
    objectIdAtPosition(pos: Vector): string;
    positionObjectAt(id: string): Vector | null;
    isPositionInbounds(pos: Vector): boolean;
}
export declare function moveObject(location: Location, objectId: string, pos: Vector): Location;
export declare function simpleLocationDraw(location: Location): string;
export declare function getLocationMatrix(location: Location): number[][];
export declare function getVectorFromDirection(location: Location, objectId: string, direction: Direction, amount: number): Vector;
export declare function moveDirection(location: Location, objectId: string, direction: Direction, amount: number): Location;
export {};
