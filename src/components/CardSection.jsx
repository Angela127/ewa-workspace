import React from "react";
import "./CardsSection.scss"; // Add styles here.

function CardsSection() {
  return (
    <div className="wrapper-2">
      <div className="card">
        <img src="/images/chat.jpg" alt="Chats" />
        <div className="info">
          <h1>Chats</h1>
          <p className="p3">Stay connected with your team.</p>
        </div>
      </div>
      <div className="card">
        <img src="/images/meeting image.jpg" alt="Meet" />
        <div className="info">
          <h1>Meet</h1>
          <p className="p3">Collaborate in real-time.</p>
        </div>
      </div>
      <div className="card">
        <img src="/images/virtual.jpg" alt="Virtual Workspace" />
        <div className="info">
          <h1>Virtual Workspace</h1>
          <p className="p3">Create your digital workspace.</p>
        </div>
      </div>
    </div>
  );
}

export default CardsSection;
