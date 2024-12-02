import React, { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
    const {
        chats,
        currentChatIndex,
        onSent,
        input,
        setInput,
        loading,
        resultData,
        currentPrompt,
        showResult
    } = useContext(Context);

    const activeChat = chats[currentChatIndex] || { prompts: [], responses: [] }; // Default to an empty chat
    const resultRef = useRef(null) //ref for scrollable container
   
    //auto scroll effect
    useEffect(()=>{
        if(resultRef.current){
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [activeChat.prompts, activeChat.responses, currentPrompt, resultData]);

    return (
        <div className="main">
            {/* Navigation */}
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="User Icon" />
            </div>

            <div className="main-container">
                {/* Greeting */}
                {!showResult && !currentPrompt ? (
    <div className="greet">
        <p><span>Hello, There</span></p>
        <p>How can I help you?</p>
    </div>
) : (
    <div className="result" ref={resultRef}>
        {/* Chat History */}
        {activeChat.prompts.map((prompt, index) => (
            <div key={index}>
                <div className="result-title">
                    <img src={assets.user_icon} alt="User Icon" />
                    <p>{prompt}</p>
                </div>
                <div className="result-data" >
                    <img src={assets.gemini_icon} alt="Gemini Icon" />
                    <p
                        dangerouslySetInnerHTML={{
                            __html: activeChat.responses[index],
                        }}
                    ></p>
                </div>
            </div>
        ))}

        {/* Current Interaction */}
        {currentPrompt && (
            <div>
                <div className="result-title">
                    <img src={assets.user_icon} alt="User Icon" />
                    <p>{currentPrompt}</p>
                </div>
                <div className="result-data">
                    <img src={assets.gemini_icon} alt="Gemini Icon" />
                    {loading ? (
                        <div className="loader">
                            <hr />
                            <hr />
                            <hr />
                        </div>
                    ) : (
                        <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                    )}
                </div>
            </div>
        )}
    </div>
)}


                {/* Input Section */}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Enter a prompt here"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && input.trim() !== "") {
                                    onSent();
                                }
                            }}
                        />
                        <div>
                            {input && (
                                <img
                                    onClick={() => input.trim() !== "" && onSent()}
                                    src={assets.send_icon}
                                    alt="Send Icon"
                                />
                            )}
                        </div>
                    </div>
                    <p>
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
