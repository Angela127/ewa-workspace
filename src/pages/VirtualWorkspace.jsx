import React, { useState } from 'react';
import '../workspace.css'; // CSS for styling
import virtualBackground from '../workspace.png'; // Image file

function VirtualWorkspace() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const avatarUrl = '/ewa.gif';

  const workspaceStyle = {
    backgroundImage: `url(${virtualBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    position: 'relative',
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat((prevSeat) => (prevSeat === seatNumber ? null : seatNumber));
  };

  return (
    <div className="workspace" style={workspaceStyle}>
      <div className="overlay"></div>

      <div className="seats">
        {[2, 3, 4, 5, 6].map((seatNumber) => (
          <div
            key={seatNumber}
            className={`seat seat${seatNumber}`}
            onClick={() => handleSeatClick(seatNumber)}
          >
            {selectedSeat === seatNumber && (
              <div className="avatarVW">
                <img
                  src={avatarUrl}
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

export default VirtualWorkspace;
