import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Format the timestamp
  const formattedTime = message.date
    ? format(message.date.toDate(), "hh:mm a") 
    : "Just Now";

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      {/* Avatar and time */}
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user?.photoURL || "/images/ewa.png"
          }
          alt="User Avatar"
        />
        <span>{formattedTime}</span>
      </div>

      {/* Message content */}
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="Message Attachment" />}
      </div>
    </div>
  );
};

export default Message;
