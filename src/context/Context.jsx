import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [chats, setChats] = useState([]); // Store all chats with their respective prompts and responses
    const [currentChatIndex, setCurrentChatIndex] = useState(null); // Track the current active chat
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false)
    // Writing animation delay
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    // Start a new chat
    const newChat = () => {
        setCurrentChatIndex(chats.length); // Set index for the new chat
        setChats((prevChats) => [
            ...prevChats,
            { prompts: [], responses: [] }, // Add a new chat object
        ]);
        setResultData(""); // Clear any displayed results
        setInput(""); // Clear the input field
        setShowResult(false)
        setLoading(false)
    };

    // Handle sending a prompt
    const onSent = async (prompt) => {
        setResultData(""); // Clear previous results
        setLoading(true); // Start the loader
        setShowResult(true);

        const usedPrompt = prompt || input; // Use provided prompt or input
        setCurrentPrompt(usedPrompt); // Set the ongoing question immediately
        setInput(""); // Clear the input field

        if (currentChatIndex === null) {
            // If no chat exists, create one
            newChat();

        }

        // Fetch the conversation history for the current chat
        const conversationHistory = chats[currentChatIndex]?.prompts
            .map((item, idx) => `${item}\n${chats[currentChatIndex].responses[idx]}`)
            .join("\n") || "";
        const fullPrompt = `${conversationHistory}\n${usedPrompt}`;

        const response = await run(fullPrompt);

        // Format the response
        const responseArray = response.split("**");
        let formattedResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                formattedResponse += responseArray[i];
            } else {
                formattedResponse += `<b>${responseArray[i]}</b>`;
            }
        }
        formattedResponse = formattedResponse.split("*").join("</br>");
        const words = formattedResponse.split(" ");

        // Start the typing animation after showing the loader
        setTimeout(() => {
            setLoading(false); // Hide the loader when typing starts
            words.forEach((word, index) => {
                delayPara(index, word + " ");
            });

            // Save the question and response to the active chat
            setTimeout(() => {
                setChats((prevChats) => {
                    const updatedChats = [...prevChats];
                    const currentChat = updatedChats[currentChatIndex];
                    if (currentChat) {
                        currentChat.prompts.push(usedPrompt);
                        currentChat.responses.push(formattedResponse);
                    }
                    return updatedChats;
                });
                setCurrentPrompt(""); // Clear the ongoing prompt
            }, words.length * 75); // Ensure it matches the typing duration
        }, 1000); // Delay typing to let the loader show for 1s
    };

    // Context values to provide throughout the app
    const contextValue = {
        chats,
        setChats,
        currentChatIndex,
        setCurrentChatIndex,
        onSent,
        loading,
        resultData,
        currentPrompt,
        input,
        setInput,
        newChat,
        showResult,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
