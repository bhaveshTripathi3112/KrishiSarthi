import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Speech Recognition
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    // Update the input field automatically as the user speaks
    setInput(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput(""); // clear input after sending
    SpeechRecognition.stopListening(); // optional: stop listening after sending

    try {
      const res = await axios.post("http://localhost:8000/api/chat", { message: input });
      const botReply = { sender: "bot", text: res.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Server error, try again." }]);
    }
  };

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-4 font-bold text-lg shadow">
        🌱 Krishi Chatbot
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end space-x-2">
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  B
                </div>
              )}

              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl break-words ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  U
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t p-3 flex items-center space-x-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
        >
          Send
        </button>
        <button
          onClick={startListening}
          className="bg-gray-300 text-black px-3 py-2 rounded-full hover:bg-gray-400 transition"
        >
          🎤
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="bg-gray-300 text-black px-3 py-2 rounded-full hover:bg-gray-400 transition"
        >
          ⏹️
        </button>
      </div>
    </div>
  );
}
