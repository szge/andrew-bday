import {
    Box,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";
// https://www.npmjs.com/package/chat-ui-react
import { ChatController, MuiChat } from "chat-ui-react";
import React from "react";
import * as Rooms from "./room";

const muiTheme = createTheme({
    palette: {
        primary: {
            main: "#007aff",
        },
    },
});

export type Items = "lighter" | "meat" | "coin" | "fertilizer" | "shears" | "shovel";
const ItemsTypeArray = ["lighter", "meat", "coin", "fertilizer", "shears", "shovel"];
function checkItemsType(value: string): value is Items {
    return ItemsTypeArray.includes(value);
}

let currentRoom: Rooms.Room;
export const inventory = new Set<Items>();

function initializeRooms(): void {
    const room1 = new Rooms.Room1();
    const room2 = new Rooms.Room2();
    const room3 = new Rooms.Room3();
    const room4 = new Rooms.Room4();
    const room5 = new Rooms.Room5();
    const room6 = new Rooms.Room6();
    const room7 = new Rooms.Room7();
    const room8 = new Rooms.Room8();
    room1.east = room2;
    room2.west = room1;
    room2.east = room3;
    room3.west = room2;
    room1.south = room4;
    room4.north = room1;
    room4.east = room5;
    room5.west = room4;
    room2.south = room5;
    room5.north = room2;
    room5.east = room6;
    room6.west = room5;
    room3.south = room6;
    room6.north = room3;
    room5.south = room7;
    room7.north = room5;
    room7.east = room8;
    room8.west = room7;
    room6.south = room8;
    room8.north = room6;
    currentRoom = room5;
}

function App(): React.ReactElement {
    const [chatCtl] = React.useState(new ChatController());

    React.useMemo(() => {
        restartGame(chatCtl);
    }, [chatCtl]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box sx={{ height: "100%", backgroundColor: "gray" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        maxWidth: "640px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        bgcolor: "background.default",
                    }}
                >
                    <MuiChat chatController={chatCtl} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

// main loop for prompting users
async function echo(chatCtl: ChatController): Promise<void> {
    const text = await chatCtl.setActionRequest({
        type: "text",
        placeholder: "Please enter something"
    });

    const text_sane = text.value.trim().toLowerCase();
    if (text_sane.startsWith("look")) {
        lookAround(chatCtl);
    } else if (text_sane.startsWith("pick up ")) {
        pickUp(chatCtl, text_sane.slice(8));
    } else if (text_sane.startsWith("pick up")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: pick up <item>`,
            self: false,
            avatar: "-",
        });
    } else if (text_sane.startsWith("go ")) {
        goTo(chatCtl, text_sane.slice(3));
    } else if (text_sane.startsWith("go")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: go <direction>`,
            self: false,
            avatar: "-",
        });
    } else if (text_sane === "chat" || text_sane === "talk") {
        talk(chatCtl);
    } else if (text_sane === "inventory") {
        printInventory(chatCtl);
    } else if (text_sane === "restart") {
        restartGame(chatCtl);
    } else if (text_sane.startsWith("use ")) {
        roomUse(chatCtl, text_sane.slice(4));
    } else if (text_sane.startsWith("use")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: use <item>`,
            self: false,
            avatar: "-",
        });
    } else if (text_sane.startsWith("help")) {
        helpPrompt(chatCtl);
    } else if (text_sane.startsWith("solve ")) {
        solve(chatCtl, text_sane.slice(6));
    } else if (text_sane.startsWith("solve")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: solve <value>`,
            self: false,
            avatar: "-",
        });
    } else if (text_sane.startsWith("hint")) {
        hint(chatCtl);
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `I'm sorry, I don't understand what you're saying. Try typing 'help me'`,
            self: false,
            avatar: "-",
        });
    }

    await new Promise(r => setTimeout(r, 500));

    echo(chatCtl);
}

async function solve(chatCtl: ChatController, value: string) {
    if (currentRoom instanceof Rooms.Room5) {
        if (value === "2282022") {
            await chatCtl.addMessage({
                type: "text",
                content: `🎉Congrats🎉 You solved the puzzle! 22-8-2022 is Andrew's birthday. Happy birthday Andrew! Feel free to type "restart" to play again.`,
                self: false,
                avatar: "-",
            });
        } else {
            await chatCtl.addMessage({
                type: "text",
                content: `That is not the correct code.`,
                self: false,
                avatar: "-",
            });
        }
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `You are not in the correct room for unlocking the chest.`,
            self: false,
            avatar: "-",
        });
    }
}

async function roomUse(chatCtl: ChatController, item: string) {
    const item_sane = item.trim().toLowerCase();
    if (checkItemsType(item_sane) && inventory.has(item_sane)) {
        currentRoom.use(chatCtl, item_sane);
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `You do not have ${item_sane} in your inventory. Use the inventory command to list your available items.`,
            self: false,
            avatar: "-",
        });
    }
}

async function printInventory(chatCtl: ChatController) {
    if (inventory.size === 0) {
        await chatCtl.addMessage({
            type: "text",
            content: `You have nothing in your inventory.`,
            self: false,
            avatar: "-",
        });
    } else {
        let message = `You have the following items in your inventory: `;
        inventory.forEach((item) => {
            message += item + ", ";
        })
        message = message.slice(0, -2); // remove the last comma
        await chatCtl.addMessage({
            type: "text",
            content: message,
            self: false,
            avatar: "-",
        });
    }
}

async function lookAround(chatCtl: ChatController): Promise<void> {
    currentRoom.description(chatCtl);
}

async function pickUp(
    chatCtl: ChatController,
    item: string
): Promise<void> {
    const item_sane = item.trim().toLowerCase();
    if (checkItemsType(item_sane)) {
        currentRoom.pickUp(chatCtl, item_sane);
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `There is no item called ${item_sane} in the room.`,
            self: false,
            avatar: "-",
        });
    }
}

async function goTo(chatCtl: ChatController, direction: string): Promise<void> {
    const direction_sane = direction.trim().toLowerCase();
    if (["north", "east", "south", "west"].includes(direction_sane)) {
        if (
            (direction_sane === "north" && currentRoom.north != null) ||
            (direction_sane === "east" && currentRoom.east != null) ||
            (direction_sane === "south" && currentRoom.south != null) ||
            (direction_sane === "west" && currentRoom.west != null)
        ) {
            switch (direction_sane) {
                case "north": {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You walk to the room to the north.`,
                        self: false,
                        avatar: "-",
                    });
                    if (currentRoom.north) currentRoom = currentRoom.north;
                    break;
                }
                case "east": {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You walk to the room to the east.`,
                        self: false,
                        avatar: "-",
                    });
                    if (currentRoom.east) currentRoom = currentRoom.east;
                    break;
                }
                case "south": {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You walk to the room to the south.`,
                        self: false,
                        avatar: "-",
                    });
                    if (currentRoom.south) currentRoom = currentRoom.south;
                    break;
                }
                case "west": {
                    await chatCtl.addMessage({
                        type: "text",
                        content: `You walk to the room to the west.`,
                        self: false,
                        avatar: "-",
                    });
                    if (currentRoom.west) currentRoom = currentRoom.west;
                    break;
                }
            }
        } else {
            const valid_directions: string[] = [];
            if (currentRoom.north != null) valid_directions.push("north");
            if (currentRoom.east != null) valid_directions.push("east");
            if (currentRoom.south != null) valid_directions.push("south");
            if (currentRoom.west != null) valid_directions.push("west");
            let message = `You cannot go ${direction_sane} from this room. Try going `;
            switch (valid_directions.length) {
                case 0: {
                    console.log(
                        "wtf. the current room has no connected rooms!!"
                    );
                    break;
                }
                case 1: {
                    message += valid_directions[0] + ".";
                    break;
                }
                case 2: {
                    message +=
                        valid_directions[0] +
                        " or " +
                        valid_directions[1] +
                        ".";
                    break;
                }
                case 3: {
                    message +=
                        valid_directions[0] +
                        ", " +
                        valid_directions[1] +
                        ", or " +
                        valid_directions[2];
                    break;
                }
                case 4: {
                    message +=
                        valid_directions[0] +
                        ", " +
                        valid_directions[1] +
                        ", " +
                        valid_directions[2] +
                        ", or " +
                        valid_directions[3];
                    break;
                }
            }
            await chatCtl.addMessage({
                type: "text",
                content: message,
                self: false,
                avatar: "-",
            });
        }
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `${direction_sane} is not a valid direction. Try "north", "east", "south", or "west".`,
            self: false,
            avatar: "-",
        });
    }
}

async function restartGame(chatCtl: ChatController): Promise<void> {
    initializeRooms();
    inventory.clear();
    await chatCtl.addMessage({
        type: "text",
        content: `Welcome to Andrew's birthday game!`,
        self: false,
        avatar: "-",
    });
    helpPrompt(chatCtl);
    await chatCtl.addMessage({
        type: "text",
        content: `After getting too drunk on ale at the local tavern celebrating your birthday last night, you wake up from your slumber and find yourself in a torch-lit square room.
        
There are pieces of hay strewn about the floor and there is a mild animal odour in the air, similar to a barn. The walls, floor, and ceiling are all built from stones and seem fairly solid.`,
        self: false,
        avatar: "-",
    });
    echo(chatCtl);
}

async function talk(chatCtl: ChatController): Promise<void> {
    currentRoom.talk(chatCtl);
}

async function hint(chatCtl: ChatController) {
    function randomIntFromInterval(min: number, max: number) {
        // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const randInt = randomIntFromInterval(0, 4);
    let message = "";
    switch (randInt) {
        case 0: {
            message = `The letter associated with each room probably has something to do with something in the room.`;
            break;
        }
        case 1: {
            message = `The grid pattern on the chest looks awfully familiar...`;
            break;
        }
        case 2: {
            message = `Have you tried talking to everything?`;
            break;
        }
        case 3: {
            message = `Look at your inventory to see what items could be useful.`;
            break;
        }
        case 4: {
            message = `The letters in the rooms could maybe form some sort of word... maybe a `;
            break;
        }
    }
    await chatCtl.addMessage({
        type: "text",
        content: message,
        self: false,
        avatar: "-",
    });
}

async function helpPrompt(chatCtl: ChatController): Promise<void> {
    await chatCtl.addMessage({
        type: "text",
        content: `"look": Describes surroundings.
"pick up <item>": Picks up item, if allowed.
"go <direction>": Moves that direction, if allowed.
"chat": Talk to the thing in the room.
"inventory": Tells you what you're holding.
"restart": Restarts game from beginning.
"use <item>": Uses an item you have.
"help me": Displays this message.
"solve <value>": when in the chest room, attempt to solve the puzzle.
"hint": get a randomized, vaguely helpful hint.`,
        self: false,
        avatar: "-",
    });
}

export default App;
