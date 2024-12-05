import React, { useState } from "react";
import Header from "../components/Header";
import ParallaxSection from "../components/ParallaxSection";
import AboutSection from "../components/AboutSection";
import Card from "../components/Card";
import LoginRegisterForm from "../components/LoginRegisterForm"; // Import Login/Register Form
import "../index.scss";

function MainPage() {
  const [isFormVisible, setFormVisible] = useState(false); // State to control modal visibility

  // Function to show the login/register modal
  const handleLoginClick = () => {
    setFormVisible(true); // Show the modal
  };

  // Function to close the modal
  const closeForm = () => {
    setFormVisible(false); // Hide the modal
  };

  return (
    <>
      <Header />
      <ParallaxSection />
      <AboutSection />
      


      <div className="wrapper-2">
        {/* Navigate to Chat Page */}
        <Card
          image="/images/chat.jpg"
          title="Chats"
          description="Stay connected with your team."
        />
        <Card
          image="/images/meeting image.jpg"
          title="Meet"
          description="Collaborate in real-time."
        />
        <Card
          image="/images/virtual.jpg"
          title="Virtual Workspace"
          description="Design and explore your virtual office."
        />
      </div>

      {/* Show the modal when isFormVisible is true */}
      {isFormVisible && (
        <div className="form-popup-overlay">
          <LoginRegisterForm closeForm={closeForm} />
        </div>
      )}
    </>
  );
}

export default MainPage;
