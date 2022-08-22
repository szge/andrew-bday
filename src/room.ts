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
            return `You talk to the dog.\n*barking noises*`;
        }
    }

    use(action: string, currentInventory: Set<Items>) {}

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
        return `The woman says: I used to operate a big natural gas plant in the day. I don't really know how I ended up in this room. I miss turning those valves.

Now I just shuffle around in this room all day. You know, when I first got here there was a N painted on the floor that wore away from all my pacing around.`;
    }

    use(action: string, currentInventory: Set<Items>) {}

    description(): string {
        return `There is a Natural gas plant manager staring out of the window. There are open doorways to the east, south, and west.`;
    }
}

export class Room3 extends Room {
    talk() {
        return `There is nothing in the room to talk to. Your voice echoes around the room.`;
    }

    use(action: string, currentInventory: Set<Items>) {}

    description(): string {
        return `The room is almost completely empty, except for a small mud mound with a depression on top. Maybe it's some kind of nest for an animal?
        
There is a small wooden sign on the otherwise barren brick east wall. It seems to have had something written on it in chalk, but whatever it is, it has long since worn away.

There are open doorways to the west and south.`;
    }
}

export class Room4 extends Room {
    wenchHasGoldCoin: boolean;

    constructor() {
        super();
        this.wenchHasGoldCoin = false;
    }

    talk() {
        if (this.wenchHasGoldCoin) {
            return `The Wench says: Thank you so much my dear! This is worth almost our family's entire yearly wages. My brother will certainly appreciate the gift. As a token of my appreciation, I will tell you a little history about this place.
            
Long ago, I was a young girl from a boring village down South. I lived with my brother and mother in a small wooden shack, and my simple life consisted of cooking, working the field, and churning butter.

One day, in the middle of the night, an evil wizard named Cipharius broke into our abode and kidnapped me with his magic. He said that I would be married off to King Sol of the Northern Kingdom.

He took me far, far North and trapped me in this dungeon. It was pretty empty when I first got here, but since then he has placed magical animals in the rooms, presumably to eventually show and impress the King.

If I remember correctly, the first animal he placed was an albatross in the northeastern-most room of the dungeon. Cipharius cast a spell to confine me to this room, so I don't really know what happened to it.
`;
        } else {
            return `The Wench says: This is my fourth year of confinement. I dream of leaving this miserable dungeon and returning to my family. I wish to present my brother with a tremendous dowry so that he may marry a beautiful woman.`;
        }
    }

    use(action: string, currentInventory: Set<Items>) {}

    description(): string {
        return `A Wench sits on a chair next to her bed. She is reading from an old book of wedding rituals by candelight.
        
There are open doorways to the north and east.`;
    }
}

export class Room5 extends Room {
    talk() {
        return `There is nothing in the room to talk to. Your voice echoes around the room.`;
    }

    use(action: string, currentInventory: Set<Items>) {}

    description(): string {
        return `There is a locked chest in the centre of the room. There is a numeric keypad, along with a drawing of a grid with the following information:
 8 | 2 | 2
 2 | 9 | 0
    | 2 | 2

There are open doorways to the north, east, west, and south.`;
    }
}

export class Room6 extends Room {
    magicFertilizer: boolean;

    constructor() {
        super();
        this.magicFertilizer = false;

    }

    talk() {
        return `There is nothing in the room to talk to. Your voice echoes around the room.`;
    }

    use(action: string, currentInventory: Set<Items>) {}

    description() {
        if (this.magicFertilizer) {
            return `The Earthworms munch away at the magic soil. They squirm around happily.`;
        } else {
            return `The middle of the room has a patch of floor removed, exposing some dirt. Other than the small barred window on the eastern wall, there isn't much to look at.

There are open doorways to the north, west, and south.`;
        }
    }
}