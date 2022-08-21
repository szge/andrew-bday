import {
    Box,
    CssBaseline,
    Divider,
    ThemeProvider,
    createTheme,
} from "@mui/material";
// https://www.npmjs.com/package/chat-ui-react
import {
    ChatController,
    MuiChat,
} from "chat-ui-react";
import React from "react";
import * as Rooms from "./room";

const muiTheme = createTheme({
    palette: {
        primary: {
            main: "#007aff",
        },
    },
});

export type Items = "lighter" | "meat" | "coin" | "magic soil" | "shears";

const visitedRooms = new Set<Rooms.Room>();
let currentRoom: Rooms.Room;
const inventory = new Set<Items>();

function initializeRooms(): void {
    const room1 = new Rooms.Room1();
    const room2 = new Rooms.Room2();
    room1.east = room2;
    room2.west = room1;
    currentRoom = room1;
}

function App(): React.ReactElement {
    const [chatCtl] = React.useState(
        new ChatController({})
    );

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
                    <Divider />
                    <Box sx={{ flex: "1 1 0%", minHeight: 0 }}>
                        <MuiChat chatController={chatCtl} />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

// main loop for prompting users
async function echo(chatCtl: ChatController): Promise<void> {
    const text = await chatCtl.setActionRequest({
        type: "text",
        placeholder: "Please enter something",
    });

    if (text.value.startsWith("look")) {
        lookAround(chatCtl);
    } else if (text.value.startsWith("pick up ")) {
        pickUp(chatCtl, text.value.slice(8));
    } else if (text.value.startsWith("pick up")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: pick up <item>`,
            self: false,
            avatar: "-",
        });
    } else if (text.value.startsWith("go ")) {
        goTo(chatCtl, text.value.slice(3));
    } else if (text.value.startsWith("go")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: go <direction>`,
            self: false,
            avatar: "-",
        });
    } else if (text.value === "inventory") {

    } else if (text.value.startsWith("drop ")) {

    } else if (text.value.startsWith("drop")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: drop <item>`,
            self: false,
            avatar: "-",
        });
    } else if (text.value === "restart") {
        restartGame(chatCtl);
    } else if (text.value.startsWith("use ")) {

    } else if (text.value.startsWith("use")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: use <item>`,
            self: false,
            avatar: "-",
        });
    } else if (text.value.startsWith("help")) {
        helpPrompt(chatCtl);
    } else {
        await chatCtl.addMessage({
            type: "text",
            content: `I'm sorry, I don't understand what you're saying. Try typing 'help me'`,
            self: false,
            avatar: "-",
        });
    }

    echo(chatCtl);
}

async function lookAround(chatCtl: ChatController): Promise<void> {
    await chatCtl.addMessage({
        type: "text",
        content: currentRoom.description(),
        self: false,
        avatar: "-",
    });
}

async function pickUp(chatCtl: ChatController, item_name: string): Promise<void> {
    await chatCtl.addMessage({
        type: "text",
        content: `trying to pick up ${item_name}, to be implemented`,
        self: false,
        avatar: "-",
    });
}

async function goTo(chatCtl: ChatController, direction: string): Promise<void> {
    const direction_sane = direction.trim().toLowerCase();
    if (["north", "east", "south", "west"].includes(direction_sane)) {
        if ((direction_sane === "north" && currentRoom.north != null)
        || (direction_sane === "east" && currentRoom.east != null)
        || (direction_sane === "south" && currentRoom.south != null)
        || (direction_sane === "west" && currentRoom.west != null)) {
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
                    console.log("wtf. the current room has no connected rooms!!");
                    break;
                }
                case 1: {
                    message += valid_directions[0] + ".";
                    break;
                }
                case 2: {
                    message += valid_directions[0] + " or " + valid_directions[1] + ".";
                    break;
                }
                case 3: {
                    message += valid_directions[0] + ", " + valid_directions[1] + ", or " + valid_directions[2];
                    break;
                }
                case 4: {
                    message += valid_directions[0] + ", " + valid_directions[1] + ", " + valid_directions[2] + ", or " + valid_directions[3];
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
    await chatCtl.addMessage({
        type: "text",
        content: `Welcome to Andrew's birthday game!`,
        self: false,
        avatar: "-",
    });
    helpPrompt(chatCtl);
    echo(chatCtl);
}

async function helpPrompt(chatCtl: ChatController): Promise<void> {
    await chatCtl.addMessage({
        type: "text",
        content: `"look": Describes surroundings.
"pick up <item>": Picks up item, if allowed.
"go <direction>": Moves that direction, if allowed.
"inventory": Tells you what you're holding.
"drop <item>": Drops item on floor.
"restart": Restarts game from beginning.
"use <item>": Uses an item you have.
"help me": Displays this message.`,
        self: false,
        avatar: "-",
    });
}

export default App;
