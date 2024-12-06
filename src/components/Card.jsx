import React from "react";


function Card({ image, title, description }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="info">
        <h1>{title}</h1>
        <p className="p5">{description}</p>
      </div>
    </div>
  );
}

export default Card;

