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
export declare type PlaceParams = {
    name: string;
    roomLimit: Vector;
    symbol?: string;
    _id?: string;
    combat_zone?: boolean;
};
export declare class Place implements GameObject {
    symbol: string;
    _id: string;
    name: string;
    objects: Map<string, Vector>;
    walls: Vector[];
    roomLimit: Vector;
    combat_zone: boolean;
    constructor(params: PlaceParams);
    asString(): string;
    addObject(pos: Vector, objectId: string): Place;
    addWall(pos: Vector): Place;
    removeObject(objectId: string): Place;
    setObjectLocation(objectId: string, pos: Vector): Place;
    validPos(pos: Vector): boolean;
    isPositionOccupied(pos: Vector): boolean;
    isWallAtPosition(pos: Vector): boolean;
    objectIdAtPosition(pos: Vector): string;
    positionObjectAt(id: string): Vector | null;
    isPositionInbounds(pos: Vector): boolean;
}
export declare function moveObject(location: Place, objectId: string, pos: Vector): Place;
export declare function simpleLocationDraw(location: Place): string;
export declare function getLocationMatrix(location: Place): number[][];
export declare function getVectorFromDirection(location: Place, objectId: string, direction: Direction, amount: number): Vector;
export declare function moveDirection(location: Place, objectId: string, direction: Direction, amount: number): Place;
export {};
