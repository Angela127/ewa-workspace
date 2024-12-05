import React, { useState } from 'react';
import './workspace.css';

function Workspace() {
  // State to track the selected seat number
  const [selectedSeat, setSelectedSeat] = useState(null);
  const avatarUrl = '/ewa.gif'; // Default avatar URL

  // Function to handle seat click and toggle the avatar
  const handleSeatClick = (seatNumber) => {
    // If the clicked seat is already selected, remove the avatar
    if (selectedSeat === seatNumber) {
      setSelectedSeat(null); // Deselect the seat (remove avatar)
    } else {
      setSelectedSeat(seatNumber); // Select the seat (add avatar)
    }
  };

  return (
    <div className="workspace">
      <div className="overlay"></div>
      

      {/* Seats */}
      <div className="seats">
        {[ 2, 3, 4, 5, 6].map((seatNumber) => (
          <div
            key={seatNumber}
            className={`seat seat${seatNumber}`}
            onClick={() => handleSeatClick(seatNumber)} // Handle seat click
          >
            {/* Only render avatar if the seat is selected */}
            {selectedSeat === seatNumber && (
              <div className="avatarVW">
                <img
                  src={avatarUrl} // Use the default avatar URL
                  alt={`Avatar for seat ${seatNumber}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workspace;
