import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

let socket;

const App = () => {
  const inpRef = useRef();

  const [size, setSize] = useState();

  const [myId, setMyId] = useState();
  const [sendId, setSendId] = useState();
  const [auth, SetAuth] = useState(false);
  const [chat, setChat] = useState([]);

  const connect = () => {
    if (!myId) return;
    socket = io("/", { auth: { myId: myId } });
    socket.on("receive", (msg) => {
      setChat((prev) => [...prev, { class: "sender", data: msg.message }]);
    });
    SetAuth(true);
  };

  useEffect(() => {
    setSize(window.innerHeight + " , " + window.outerHeight);
    document.documentElement.style.setProperty(
      "--ht",
      window.innerHeight + "px"
    );
  }, []);

  const handleSend = () => {
    document.querySelector(".inppp").focus()

    if (!sendId) return;
    if (!inpRef.current.value) return;

    setChat((prev) => [...prev, { class: "me", data: inpRef.current.value }]);
    socket.emit("send-message", {
      senderId: myId,
      receiverId: sendId,
      message: inpRef.current.value,
    });
  };

  useEffect(() => {
    const chat = document.querySelector(".chat");
    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
    if(inpRef.current)
    inpRef.current.value = ""

  }, [chat]);

  return (
    <div className="body">
      <div className="width" style={{ position: "absolute" }}>
        {size}
      </div>
      {auth || (
        <div className="inp">
          <div className="getid">
            <input
              placeholder="My ID"
              onChange={(e) => setMyId(e.target.value)}
              type="text"
            />
            <button onClick={connect}>Connect</button>
          </div>
        </div>
      )}
      {auth && (
        <div className="flexxx">
          <div className="inp nott">
            <input

              placeholder="Send To"
              onChange={(e) => setSendId(e.target.value)}
              type="text"
            />
          </div>
          <div className="chat">
            {chat.map((obj, ind) => {
              return (
                <div key={ind} className={`${obj.class}`}>
                  {obj.data}
                </div>
              );
            })}
          </div>
          <div className="inp nott lastt">
            <input className="inppp" placeholder="Type a message" ref={inpRef} type="text" />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
