
// DetailsCard displays a styled card with a heading and a list of key-value pairs.
// Used in Agent screens to show property or user details in a readable format.
// Accepts a heading and an array of items to render.

import React from 'react';
import '../../../../styles/Agent/DetailsCard.css';


// KeyValue type for each row in the details list
type KeyValue = {
  key: string;
  value: React.ReactNode;
};


// Props for DetailsCard:
//   - heading: card title
//   - items: array of key-value pairs to display
interface DetailsCardProps {
  heading: string;
  items: KeyValue[];
}


// Render a card with heading and key-value rows
const DetailsCard: React.FC<DetailsCardProps> = ({ heading, items }) => (
  <div className="details-card">
    <div className="details-card-heading">{heading}</div>
    <div className="details-card-list">
      {items.map(({ key, value }, i) => (
        <div className="details-card-row" key={key + i}>
          <span className="details-card-key">{key} :</span>
          <span className="details-card-value">{value}</span>
        </div>
      ))}
    </div>
  </div>
);


// Export DetailsCard for use in Agent screens
export default DetailsCard;