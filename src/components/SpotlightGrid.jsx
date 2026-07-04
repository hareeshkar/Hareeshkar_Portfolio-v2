// File: /src/components/SpotlightGrid.jsx

import React from 'react';
import './SpotlightGrid.css'; // We will still use its CSS for the cards

const Card = ({ item }) => {
  // The onMouseMove and onClick handlers are no longer needed here; the parent will handle interaction.
  return (
    <article
      className="spotlight-card group"
      style={{ '--card-border-color': `var(--color-accent)` }}
    >
      <div className="spotlight-effect" />
      <div className="card-image-container">
        <img src={item.image} alt={item.title} loading="lazy" className="card-image" />
      </div>
      <footer className="card-footer">
        <h3 className="card-title">{item.title}</h3>
      </footer>
    </article>
  );
};

// This is now a simple, presentational grid.
const SpotlightGrid = ({ items = [] }) => {
  return (
    <div className="spotlight-grid-inner">
      {items.map((item, i) => (
        <Card key={i} item={item} />
      ))}
    </div>
  );
};

export default SpotlightGrid;