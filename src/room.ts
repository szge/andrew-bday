import { Items } from "./App";

export abstract class Room {
    up: Room | null;
    right: Room | null;
    down: Room | null;
    left: Room | null;

    constructor() {
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
    }

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

    use(action: string, currentInventory: Set<Items>) {

    }

    description() {
        if (this.dogIsFed) {
            if (this.lighterOnGround) {
                return `You see the letter "D" scrawled on the wall. The Dog is happily chewing away at the meat you gave it. There is a golden lighter on the ground.`;
            } else {
                return `You see the letter "D" scrawled on the wall. The Dog is happily chewing away at the meat you gave it.`;
            }
        } else {
            return `You see the letter "D" scrawled on the wall. An angry, hungry Dog sits in the corner of the room. It looks like it is guarding a shiny object.`;
        }
    }
}