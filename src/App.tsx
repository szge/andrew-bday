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

const muiTheme = createTheme({
    palette: {
        primary: {
            main: "#007aff",
        },
    },
});

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
    } else if (text.value.startsWith("go to ")) {

    } else if (text.value.startsWith("go to")) {
        await chatCtl.addMessage({
            type: "text",
            content: `Correct usage: go to <room>`,
            self: false,
            avatar: "-",
        });
    } else if (text.value.startsWith("go ")) {

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
        content: `Not implemented yet!`,
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

async function restartGame(chatCtl: ChatController): Promise<void> {
    // TODO: reset game variables
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
"go to <room>": Go back to a room you have visited.
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
