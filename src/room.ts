import { ChatController } from "chat-ui-react";
import { inventory, Items } from "./App";
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
    abstract talk(chatCtl: ChatController): void;

    // interact with the room in some way. assume item is in inventory.
    abstract use(chatCtl: ChatController, item: Items): void;

    // pick up something in the room
    abstract pickUp(chatCtl: ChatController, item: Items): void;

    // write the current state of the room
    abstract description(chatCtl: ChatController): void;
}

export class Room1 extends Room {
    dogIsFed: boolean;
    lighterOnGround: boolean;

    constructor() {
        super();
        this.dogIsFed = false;
        this.lighterOnGround = true;
    }

    async talk(chatCtl: ChatController) {
        if (this.dogIsFed) {
            await chatCtl.addMessage({
                type: "text",
                content: `*chewing noises*`,
                self: false,
                avatar: "-",
            });
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `*barking noises*`,
                self: false,
                avatar: "-",
            });
        }
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        // pick up lighter
        if (!this.dogIsFed) {
            await chatCtl.addMessage({
                type: "text",
                content: `You try to pick up the lighter but the aggressive Dog almost bites your hand off.`,
                self: false,
                avatar: "-",
            });
        } else if (this.lighterOnGround) {
            await chatCtl.addMessage({
                type: "text",
                content: `You pick up the lighter from the ground.`,
                self: false,
                avatar: "-",
            });
            inventory.add("lighter");
            this.lighterOnGround = false;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `There is no such item to pick up. Maybe you already picked it up?`,
                self: false,
                avatar: "-",
            });
        }
    }

    async use(chatCtl: ChatController, item: Items) {
        // give meat to dog
        if (item === "meat") {
            inventory.delete("meat");
            await chatCtl.addMessage({
                type: "text",
                content: `You give the meat to the Dog.`,
                self: false,
                avatar: "-",
            });
            this.dogIsFed = true;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `You cannot use that item here.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async description(chatCtl: ChatController) {
        let message: string;

        if (this.dogIsFed) {
            if (this.lighterOnGround) {
                message = `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. The Dog is happily chewing away at the meat you gave it. There is a golden lighter on the ground.`;
            } else {
                message = `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. The Dog is happily chewing away at the meat you gave it.`;
            }
        } else {
            message = `You see the letter "D" scrawled on the wall. There are open doorways to the south and east. An angry, hungry Dog sits in the corner of the room. It looks like it is guarding a shiny object.`;
        }
        
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room2 extends Room {
    shovelOnGround: boolean;
    gaveGoldCoin: boolean;

    constructor() {
        super();
        this.shovelOnGround = true;
        this.gaveGoldCoin = false;
    }

    async talk(chatCtl: ChatController) {
        let message: string;
        if (!this.gaveGoldCoin) {
            message = `The woman says: I used to operate a big nuclear energy plant back in the day. I don't really know how I got here. I think I'm in the wrong time and dimension.

Now I just shuffle around in this room all day. You know, when I first got here there was a N painted on the floor that wore away from all my pacing around.

You know what? You can have this gold coin I found. I don't really have any use for it.`;
            inventory.add("coin");
            this.gaveGoldCoin = true;
        } else {
            message = `The woman says: I used to operate a big nuclear energy plant back in the day. I don't really know how I got here. I think I'm in the wrong time and dimension.

Now I just shuffle around in this room all day. You know, when I first got here there was a N painted on the floor that wore away from all my pacing around.`;
            
        }
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
    
    async pickUp(chatCtl: ChatController, item: Items) {
        if (item === "shovel" && this.shovelOnGround) {
            inventory.add("shovel");
            await chatCtl.addMessage({
                type: "text",
                content: `You pick up the shovel.`,
                self: false,
                avatar: "-",
            });
            this.shovelOnGround = false;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `There is no such item to pick up.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async use(chatCtl: ChatController, item: string) {
        await chatCtl.addMessage({
            type: "text",
            content: `You cannot use that item here.`,
            self: false,
            avatar: "-",
        });
    }

    async description(chatCtl: ChatController) {
        if (this.shovelOnGround) {
            await chatCtl.addMessage({
                type: "text",
                content: `There is a Nuclear energy plant manager staring out of the window. There is a shovel on the ground. There are open doorways to the east, south, and west.`,
                self: false,
                avatar: "-",
            });
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `There is a Nuclear energy plant manager staring out of the window. There are open doorways to the east, south, and west.`,
                self: false,
                avatar: "-",
            });
        }
    }
}

export class Room3 extends Room {
    meatOnGround: boolean;
    
    constructor() {
        super();
        this.meatOnGround = true;
    }

    async talk(chatCtl: ChatController) {
        const message = `There is nothing in the room to talk to. Your voice echoes around the room.`;
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
    
    async pickUp(chatCtl: ChatController, item: Items) {
        if (this.meatOnGround && item === "meat") {
            await chatCtl.addMessage({
                type: "text",
                content: `You pick up the meat.`,
                self: false,
                avatar: "-",
            });
            inventory.add("meat");
            this.meatOnGround = false;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `There is no such item to pick up.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async use(chatCtl: ChatController, item: string) {
        // this room has no interaction
        await chatCtl.addMessage({
            type: "text",
            content: `You cannot use that item here.`,
            self: false,
            avatar: "-",
        });
    }

    async description(chatCtl: ChatController) {
        let message: string;
        if (this.meatOnGround) {
            message = `The room is almost completely empty, except for a small mud mound with a depression on top. Maybe it's some kind of nest for an animal?
        
There is a small wooden sign on the otherwise barren brick east wall. It seems to have had something written on it in chalk, but whatever it is, it has long since worn away.

A chunk of meat lies in the corner.

There are open doorways to the west and south.`;
        } else {
            message = `The room is almost completely empty, except for a small mud mound with a depression on top. Maybe it's some kind of nest for an animal?
        
There is a small wooden sign on the otherwise barren brick east wall. It seems to have had something written on it in chalk, but whatever it is, it has long since worn away.

There are open doorways to the west and south.`;
        }

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room4 extends Room {
    wenchHasGoldCoin: boolean;

    constructor() {
        super();
        this.wenchHasGoldCoin = false;
    }

    async talk(chatCtl: ChatController) {
        let message: string;
        if (this.wenchHasGoldCoin) {
            message = `The Wench says: Thank you so much my dear! This is worth almost our family's entire yearly wages. My brother will certainly appreciate the gift. As a token of my appreciation, I will tell you a little history about this place.
            
Long ago, I was a young girl from a boring village down South. I lived with my brother and mother in a small wooden shack, and my simple life consisted of cooking, working the field, and churning butter.

One day, in the middle of the night, an evil wizard named Cipharius broke into our abode and kidnapped me with his magic. He said that I would be married off to King Sol of the Northern Kingdom.

He took me far, far North and trapped me in this dungeon. It was pretty empty when I first got here, but since then he has placed magical animals in the rooms, presumably to eventually show and impress the King.

If I remember correctly, the first animal he placed was an albatross in the northeastern-most room of the dungeon. Cipharius cast a spell to confine me to this room, so I don't really know what happened to it.
`;
        } else {
            message = `The Wench says: This is my fourth year of confinement. I dream of leaving this miserable dungeon and returning to my family. I wish to present my brother with a tremendous dowry so that he may marry a beautiful woman.`;
        }

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }

    async use(chatCtl: ChatController, item: string) {
        // give gold coin to wench
        if (item === "coin") {
            inventory.delete("coin");
            await chatCtl.addMessage({
                type: "text",
                content: `You give the coin to the Wench.`,
                self: false,
                avatar: "-",
            });
            this.wenchHasGoldCoin = true;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `You cannot use that item here.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        await chatCtl.addMessage({
            type: "text",
            content: `There is no such item to pick up.`,
            self: false,
            avatar: "-",
        });
    }

    async description(chatCtl: ChatController) {
        const message = `A Wench sits on a chair next to her bed. She is reading from an old book of wedding rituals by candelight.
        
There are open doorways to the north and east.`;

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room5 extends Room {
    shearsOnGround: boolean;

    constructor() {
        super();
        this.shearsOnGround = true;
    }

    async talk(chatCtl: ChatController) {
        const message = `There is nothing in the room to talk to. Your voice echoes around the room.`;
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }

    async use(chatCtl: ChatController, item: string) {
        await chatCtl.addMessage({
            type: "text",
            content: `You cannot use that item here.`,
            self: false,
            avatar: "-",
        });
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        if (this.shearsOnGround && item === "shears") {
            inventory.add("shears");
            await chatCtl.addMessage({
                type: "text",
                content: `You pick up the shears.`,
                self: false,
                avatar: "-",
            });
            this.shearsOnGround = false;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `There is no such item to pick up.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async description(chatCtl: ChatController) {
        let message: string;
        if (this.shearsOnGround) {
            message = `There is a locked chest in the centre of the room. There is a numeric keypad, along with a drawing of a grid with the following information:
8 | 2 | 2
2 | 9 | 0
   | 2 | 2

To attempt to solve the puzzle, type "solve <value>".

A pair of shears lies on the ground near your feet.

There are open doorways to the north, east, west, and south.`;
        } else {
            message = `There is a locked chest in the centre of the room. There is a numeric keypad, along with a drawing of a grid with the following information:
8 | 2 | 2
2 | 9 | 0
   | 2 | 2

To attempt to solve the puzzle, type "solve <value>".

There are open doorways to the north, east, west, and south.`;
        }

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room6 extends Room {
    magicFertilizer: boolean;

    constructor() {
        super();
        this.magicFertilizer = false;
    }

    async talk(chatCtl: ChatController) {
        const message = `There is nothing in the room to talk to. Your voice echoes around the room.`;
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }

    async use(chatCtl: ChatController, item: string) {
        // worms come out when fertilizer is used
        if (item === "fertilizer") {
            inventory.delete("fertilizer");
            await chatCtl.addMessage({
                type: "text",
                content: `You use the magic fertilizer on the ground. Suddenly, a giant Echinacea plant erupts out of the ground.`,
                self: false,
                avatar: "-",
            });
            this.magicFertilizer = true;
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `You cannot use that item here.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        await chatCtl.addMessage({
            type: "text",
            content: `There is no such item to pick up.`,
            self: false,
            avatar: "-",
        });
    }

    async description(chatCtl: ChatController) {
        let message: string;
        if (this.magicFertilizer) {
            message = `The giant Echinacea plant stands proudly in the middle of the room, filling it with a strong smell of flowers.

There are open doorways to the north, west, and south.`;
        } else {
            message = `The middle of the room has a patch of floor removed, exposing some dirt. Other than the small barred window on the eastern wall, there isn't much to look at.

There are open doorways to the north, west, and south.`;
        }

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room7 extends Room {
    candleLit: boolean;
    webCut: boolean;

    constructor() {
        super();
        this.candleLit = false;
        this.webCut = false;
    }

    async talk(chatCtl: ChatController) {
        if (this.candleLit) {
            return `The humongous spider stares at you with its eight eyes.`;
        } else {
            return `Nothing responds to your voice. Your voice echoes around the room.`;
        }
    }

    async use(chatCtl: ChatController, item: string) {
        // use shears to cut web
        // use lighter to light candle
        if (item === "shears") {
            if (this.webCut) {
                await chatCtl.addMessage({
                    type: "text",
                    content: `You have already cut the spider web; there is nothing else to cut.`,
                    self: false,
                    avatar: "-",
                });
            } else {
                await chatCtl.addMessage({
                    type: "text",
                    content: `You use your shears to cut the spider web.`,
                    self: false,
                    avatar: "-",
                });
                this.webCut = true;
            }
        } else if (item === "lighter") {
            if (this.webCut) {
                if (this.candleLit) {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You have already lit the candle; there is nothing else to light.`,
                        self: false,
                        avatar: "-",
                    });
                } else {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You use your lighter to light the candle. The room lights up.`,
                        self: false,
                        avatar: "-",
                    });
                    this.candleLit = true;
                }
            } else {
                await chatCtl.addMessage({
                    type: "text",
                    content: `There is nothing to light.`,
                    self: false,
                    avatar: "-",
                });
            }
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `You cannot use that item here.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        await chatCtl.addMessage({
            type: "text",
            content: `There is no such item to pick up.`,
            self: false,
            avatar: "-",
        });
    }

    async description(chatCtl: ChatController) {
        let message: string;
        if (this.candleLit) {
            message = `The room is now lit up. You can see spider webs cover almost every surface, including the floor, walls, furniture, and dusty old shelves.
            
A gigantic human-sized spider appears in your peripheral vision, which startles you. You jump back, but it seems unbothered by your presence. It isn't here to harm you.

Now that you can see the room in full detail, you see a letter "S" carved into a big stone tile on the floor.

There are open doorways to the north and east.`;
        } else if (this.webCut) {
            message = `With the little ambient light coming from the adjacent rooms, you can barely make out a candleholder with a half-used candle underneath the web you cut.
            
There are open doorways to the north and east.`;
        } else {
            message = `The room is almost pitch black. There is a musty smell, and everything you feel in the dark is covered with super sticky cobwebs. 
    
With the ambient light coming from the adjacent rooms, you can see a shiny object on a shelf, but it is so densely covered with cobwebs that you can't identify what it is.
            
There are open doorways to the north and east.`;
        }

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

export class Room8 extends Room {
    pickedUpFertilizer: boolean;

    constructor() {
        super();
        this.pickedUpFertilizer = false;
    }

    async talk(chatCtl: ChatController) {
        await chatCtl.addMessage({
            type: "text",
            content: `The raccoon stares at you curiously.`,
            self: false,
            avatar: "-",
        });
    }

    async pickUp(chatCtl: ChatController, item: Items) {
        await chatCtl.addMessage({
            type: "text",
            content: `There is no such item to pick up.`,
            self: false,
            avatar: "-",
        });
    }

    async use(chatCtl: ChatController, item: string) {
        // scoop up fertilizer with shovel
        if (item === "shovel" && !this.pickedUpFertilizer) {
            inventory.delete("shovel");
            await chatCtl.addMessage({
                type: "text",
                content: `You scoop up the magic fertilizer with your shovel and put it in your inventory.`,
                self: false,
                avatar: "-",
            });
            inventory.add("fertilizer");
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `You cannot use that item here.`,
                self: false,
                avatar: "-",
            });
        }
    }

    async description(chatCtl: ChatController) {
        const message = `A Raccoon and her two cubs are burrowing through a pile of trash on the south side of the room.

In the middle of the room, a large sack labelled "fertilizer" contains a white granulous substance.

Someone has scrawled a letter "R" into the south wall.

There are open doorways to the north and west.`;

        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}