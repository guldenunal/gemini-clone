import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { chats, currentChatIndex, setCurrentChatIndex, newChat, setChats } = useContext(Context);

    const switchChat = (index) => {
        setCurrentChatIndex(index); // Set the clicked chat as active
    };

    // Delete a chat
    const deleteChat = (index) => {
        const updatedChats = chats.filter((_, chatIndex) => chatIndex !== index);

        // If the deleted chat was the current active chat, reset the current chat index
        if (currentChatIndex === index) {
            setCurrentChatIndex(updatedChats.length > 0 ? 0 : null); // Set to the first chat or null if no chats remain
        }

        // Update the chats in the context
        setChats(updatedChats);
    };

    return (
        <div className="sidebar">
            <div className="top">
                <img
                    onClick={() => setExtended((prev) => !prev)}
                    className="menu"
                    src={assets.menu_icon}
                    alt=""
                />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">~Recent Chats</p>
                        {chats.map((chat, index) => (
                            <div
                                key={index}
                                onClick={() => switchChat(index)}
                                className={`recent-entry ${index === currentChatIndex ? "active" : ""}`}
                            >
                                <img src={assets.message_icon} alt="" />
                                <p>
                                    {chat.prompts.length > 0
                                        ? chat.prompts[chat.prompts.length - 1].slice(0, 18) + "..."
                                        : "New Chat"}
                                </p>
                                {/* Three dots as delete icon */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the click from triggering the switchChat function
                                        deleteChat(index); // Call the delete function
                                    }}
                                    className="delete-dots"
                                >
                                    &#8230; {/* Unicode character for three dots */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="bottom">
               
           {/* <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Delete all</p> : null}
                </div> */}
               
            </div>
        </div>
    );
};

export default Sidebar;
