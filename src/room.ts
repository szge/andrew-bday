import { Items } from "./App";
/*
Room layout looks like this:
 1 | 2 | 3
===========
 4 | 5 | 6
===========
   | 7 | 8
 ^ (empty room)
*/
export abstract class Room {
    north: Room | null;
    east: Room | null;
    south: Room | null;
    west: Room | null;

    constructor() {
        this.north = null;
        this.east = null;
        this.south = null;
        this.west = null;
    }

    // talk to whatever in the room
    abstract talk(): string;

    // interact with the room in some way
    abstract use(action: string, currentInventory: Set<Items>): void;

    // write the current state of the room
    abstract description(): string;
}

export class Room1 extends Room {
    dogIsFed: boolean;
    lighterOnGround: boolean;

    constructor() {
        super();
        this.dogIsFed = false;
        this.lighterOnGround = true;
    }

    talk() {
        if (this.dogIsFed) {
            return `You talk to the dog.\n*chewing noises*`;
        } else {
            return `You talk to the dog.\n*barking noises*`
        }
    }

    use(action: string, currentInventory: Set<Items>) {

    }

    description() {
        if (this.dogIsFed) {
            if (this.lighterOnGround) {
                return `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. The Dog is happily chewing away at the meat you gave it. There is a golden lighter on the ground.`;
            } else {
                return `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. The Dog is happily chewing away at the meat you gave it.`;
            }
        } else {
            return `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. An angry, hungry Dog sits in the corner of the room. It looks like it is guarding a shiny object.`;
        }
    }
}

export class Room2 extends Room {
    talk() {
        return `I used to operate a big natural gas plant in the day. I don't really know how I ended up in this room. I miss turning those valves.
Now I just shuffle around in this room all day. You know, when I first got here there was a N painted on the floor that wore away from all my pacing around.`;
    }

    use(action: string, currentInventory: Set<Items>) {

    }

    description(): string {
        return `There is a Natural gas plant manager staring out of the window. There are open doorways to the east, south, and west.`;
    }
}

