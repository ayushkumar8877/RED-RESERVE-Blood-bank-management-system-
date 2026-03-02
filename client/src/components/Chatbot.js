import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../services/API";

const Chatbot = () => {
  const { user } = useSelector((state) => state.auth);

  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [bounce, setBounce] = useState(true);
  const [showPulse, setShowPulse] = useState(true);
  const [firstOpen, setFirstOpen] = useState(true);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (open && firstOpen) {
      setChat([
        {
          bot: "Hi 👋 I am your Blood Bank Assistant.\nAsk me about blood availability.",
        },
      ]);
      setFirstOpen(false);
    }
  }, [open, firstOpen]);

  const getQuickOptions = () => {
    switch (user?.role) {
      case "donar":
        return [
          "Am I eligible to donate blood?",
          "Donation benefits",
          "When can I donate again?",
        ];
      case "hospital":
        return [
          "Available blood groups",
          "Make blood request",
          "Urgent blood needed",
        ];
      case "organisation":
        return [
          "Which blood group is low?",
          "Show inventory summary",
          "Recent donations",
        ];
      default:
        return ["Check blood availability"];
    }
  };

  const sendMessage = async (customMsg) => {
    const finalMsg = customMsg || msg;
    if (!finalMsg.trim()) return;

    try {
      setLoading(true);
      setChat((prev) => [...prev, { user: finalMsg }]);
      setMsg("");

      const { data } = await API.post("/ai/chat", { message: finalMsg });

      setChat((prev) => [...prev, { bot: data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { bot: "❌ Server error, try again later" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showPopup && !open && (
        <div className="chat-popup">Hii 👋 may I help you?</div>
      )}

      <div
        onClick={() => {
          setOpen(!open);
          setShowPopup(false);
          setBounce(false);
          setShowPulse(false);
        }}
        className={`chat-btn ${bounce ? "bounce" : ""}`}
      >
        {showPulse && <span className="pulse-ring"></span>}
        💬
      </div>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            🩸 Blood Bank AI
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {chat.length <= 1 && (
              <div className="quick-btns">
                {getQuickOptions().map((item, i) => (
                  <button key={i} onClick={() => sendMessage(item)}>
                    {item}
                  </button>
                ))}
              </div>
            )}

            {chat.map((c, i) => (
              <div
                key={i}
                className={`msg-row ${c.user ? "right" : "left"}`}
              >
                <div
                  className={`msg-bubble ${c.user ? "user" : "bot"}`}
                >
                  {c.user || c.bot}
                </div>
              </div>
            ))}

            {loading && <p>Typing...</p>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      )}

      <style>{`
        .chat-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #dc3545;
          color: white;
          padding: 15px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 999;
          font-size: 20px;
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(220,53,69,0.4);
          animation: pulse 1.5s infinite;
          top: 0;
          left: 0;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.6); opacity: 0; }
        }

        .bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          50% { transform: translateY(-12px); }
        }

        .chat-box {
          position: fixed;
          bottom: 90px;
          right: 30px;
          width: 330px;
          height: 420px;
          background: white;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          background: #dc3545;
          color: white;
          padding: 10px;
          display: flex;
          justify-content: space-between;
        }

        .chat-body {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background: #e5ddd5;
        }

        .msg-row { display: flex; margin-bottom: 8px; }
        .left { justify-content: flex-start; }
        .right { justify-content: flex-end; }

        .msg-bubble {
          max-width: 75%;
          padding: 8px 12px;
          border-radius: 15px;
          font-size: 13px;
        }

        .bot { background: #f1f1f1; }
        .user { background: #dc3545; color: white; }

        .chat-input {
          display: flex;
          padding: 8px;
          background: white;
        }

        .chat-input input {
          flex: 1;
          border-radius: 20px;
          border: 1px solid #ccc;
          padding: 8px 12px;
        }

        .chat-input button {
          background: #dc3545;
          border: none;
          color: white;
          border-radius: 50%;
          width: 38px;
          height: 38px;
        }

        .quick-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .quick-btns button {
          border: none;
          background: #fff;
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 12px;
          cursor: pointer;
        }

        .quick-btns button:hover {
          background: #dc3545;
          color: white;
        }

        .chat-popup {
          position: fixed;
          bottom: 95px;
          right: 30px;
          background: white;
          padding: 8px 14px;
          border-radius: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default Chatbot;