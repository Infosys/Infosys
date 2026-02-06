// OwnerCard.tsx
// This component displays a summary card for a property owner in the property form.
// Shows owner avatar, name, type (primary/secondary), and provides delete/view actions.
// Props:
//   name: Owner's name
//   isPrimary: Whether the owner is the primary owner
//   onDelete: Callback to delete the owner
//   onViewOwners: Callback to view all owners
//   primaryOwnerText: Label for primary owner
//   ownerText: Label for secondary owner
//   nameText: Label for name field
//   viewOwnersText: Label for view owners button
// Used in: Owner details section of property forms

import React from 'react';
import '../../../../../styles/OwnerCard.css';
import accountCircle from '../../../../assets/Agent/account_circle.svg';
import deleteIcon from '../../../../assets/Agent/delete.svg';

interface OwnerCardProps {
  name: string;
  isPrimary?: boolean;
  onDelete?: () => void;
  onViewOwners?: () => void;
  primaryOwnerText?: string;
  ownerText?: string;
  nameText?: string;
  viewOwnersText?: string;
}

const OwnerCard: React.FC<OwnerCardProps> = ({
  name,
  isPrimary = false,
  onDelete,
  onViewOwners,
  primaryOwnerText = 'Primary Owner',
  ownerText = 'Owner',
  nameText = 'Name',
  viewOwnersText = 'View Owners',
}) => (
  // Render owner summary card UI
  <div className="owner-summary-card">
    <div style={{ paddingBottom: '0' }} className="owner-summary-content">
      <div className="owner-summary-avatar">
        {/* Owner avatar icon */}
        <img
          src={accountCircle}
          alt="Owner"
          width={50}
          height={50}
          draggable={false}
          style={{ display: 'block' }}
        />
      </div>
      <div className="owner-summary-info">
        {/* Owner type (primary/secondary) */}
        <div className="owner-summary-type">
          {isPrimary ? primaryOwnerText : ownerText}
        </div>
        {/* Owner name */}
        <div className="owner-summary-name">
          {nameText}: {name}
        </div>
        {onViewOwners && (
          <button
            className="owner-summary-view-owners"
            onClick={onViewOwners}
            type="button"
          >
            {viewOwnersText}
          </button>
        )}
      </div>
      {/* Delete owner button if callback provided */}
      {onDelete && (
        <button
          style={{ padding: '0', backgroundColor: '#f5f5f5', marginRight: '2%' }}
          className="owner-summary-delete"
          onClick={onDelete}
          aria-label="Delete owner"
          type="button"
        >
          <img src={deleteIcon} alt="Delete" width={38} height={38} draggable={false} />
        </button>
      )}
    </div>
    {/* View owners button if callback provided */}
  </div>
);

// Export OwnerCard for use in owner details forms
export default OwnerCard;
