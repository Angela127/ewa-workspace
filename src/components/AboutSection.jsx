import React from "react";


function AboutSection() {
  return (
    <section className="topic">
      <h4>
        About
        <br />
        Ewa
      </h4>
      <p>Your Ultimate Digital Collaboration Hub!</p>
      <img src="/images/ewa.png" id="Ewa-logo" alt="Ewa Logo" />
      <div className="box-wrapper">
        <div className="box">
          <input id="ch" type="checkbox" />
          <div className="content">
            <p className="p2">
            At Ewa Workspace, we're redefining the way people connect, collaborate, and create. Born out of the innovation of computer science students, our platform was crafted to meet the growing demands of modern digital workspaces. 
            Whether you're chatting, sharing files, or designing your virtual office, we make it easy to stay productive and connected.
            </p>
            <label htmlFor="ch" className="label-1">
              Hide
            </label>
          </div>
          <label htmlFor="ch" className="label-1">
            Know more
          </label>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
