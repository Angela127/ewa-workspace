import React, { useEffect } from 'react';

function ParallaxSection() {
  useEffect(() => {
    const handleScroll = () => {
      const workspace = document.querySelector('.workspace-2');
      const treeLeft = document.getElementById('tree-left');
      const treeRight = document.getElementById('tree-right');
      const leaveLeft = document.getElementById('leave-left');
      const leaveRight = document.getElementById('leave-right');

      // Get the scroll values
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight - windowHeight;

      // Calculate scroll percentage
      const scrollPercent = scrollTop / documentHeight;

      if (workspace && treeLeft && treeRight && leaveLeft && leaveRight) {
        // Adjust movement values for gradual motion
        const leftMovement = scrollTop * -0.5; // Adjust to control the pace
        const rightMovement = scrollTop * 0.5;

        workspace.style.transform = `translateY(${scrollTop * 0.1}px)`;
        treeLeft.style.left = `${leftMovement}px`;
        treeRight.style.left = `${rightMovement}px`;

        leaveLeft.style.left = `${leftMovement * 0.5}px`;
        leaveRight.style.left = `${rightMovement * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="parallax">
      <p className="workspace-2">
        <span className="material-symbols-outlined icon-2">
          keyboard_double_arrow_down
        </span>
      </p>
      <img src="/images/new1.jpg" id="tree-left" alt="Tree Left" />
      <img src="/images/new1.jpg" id="tree-right" alt="Tree Right" />
      <img
        src="/images/creative-assortment-paper-planets.png"
        id="leave-left"
        alt="Leave Left"
      />
      <img
        src="/images/creative-paper-planets-assortment.png"
        id="leave-right"
        alt="Leave Right"
      />
      <img src="/images/black and white.png" id="grass" alt="Grass" />
      <img src="/images/black and white.png" id="grass2" alt="Grass2" />
      <img src="/images/black and white.png" id="grass3" alt="Grass3" />
    </section>
  );
}

export default ParallaxSection;

