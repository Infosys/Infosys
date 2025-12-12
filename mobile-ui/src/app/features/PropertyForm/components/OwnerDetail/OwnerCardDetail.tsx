
// Card displaying a property owner's details in the property form, with edit/delete actions.

import React from 'react';
import '../../../../../styles/OwnerCardDetail.css';
import accountCircle from '../../../../assets/Agent/account_circle.svg';
import deleteIcon from '../../../../assets/Agent/delete.svg';
import editSquare from '../../../../assets/Agent/edit_square.svg';

interface OwnerCardProps {
  name: string;
  isPrimary?: boolean;
  onDelete?: () => void;
  onViewOwners?: () => void;
  isDetailed: boolean;
  aadhar?: string;
  mobile?: string;
  email?: string;
  guardian?: string;
  guardianRelationship?: string;
  nameText: string;
  mobileNumberLabel: string;
  aadhaarLabel: string;
  emailLabel: string;
  guardianLabel: string;
  primaryOwnerText: string;
  onEdit?: () => void;
}

const OwnerCardDetail: React.FC<OwnerCardProps> = ({
  name,
  isPrimary = false,
  onDelete,
  isDetailed = false,
  aadhar,
  mobile,
  email,
  guardian,
  guardianRelationship,
  // nameText,
  // mobileNumberLabel,
  // aadhaarLabel,
  // emailLabel,
  guardianLabel,
  primaryOwnerText,
  onEdit,
}) => {
  // Render owner detailed card UI
  return (
    <div style={{backgroundColor:"#fafafa", border:"1px solid #b4b0b0ff", borderRadius:"25px", marginBottom:"4%"}} className="owner-card-detail">
      <div className="owner-card-content">
        {/* Owner avatar icon */}
        <div className="owner-icon">
          <img
            src={accountCircle}
            alt="Owner"
            width={52}
            height={32}
            draggable={false}
            style={{ display: 'block' }}
          />
        </div>
        {/* Owner info and details */}
        <div className="owner-info">
          {/* Owner type (primary/secondary) */}
          <div className="owner-type">
            {isPrimary ? primaryOwnerText : 'Secondary Owner'}
          </div>
          {/* Owner details list */}
          <div className="owner-details-list">
            <div className="owner-detail">Name: {name}</div>
            {isDetailed && (
              <>
                {aadhar && <div className="owner-detail">Aadhar: {aadhar}</div>}
                {mobile && <div className="owner-detail">Mobile: +91 {mobile}</div>}
                {email && <div className="owner-detail">Email: {email}</div>}
                {(guardian || guardianRelationship) && (
                  <div className="owner-detail">
                    {guardianLabel}: {guardian}{guardianRelationship ? ` (${guardianRelationship})` : ''}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Top-right Delete Button if callback provided */}
        {onDelete && (
          <button className="owner-delete-button" onClick={onDelete} type="button" aria-label="Delete owner">
            <img src={deleteIcon} alt="Delete" width={22} height={22} />
          </button>
        )}
        {/* Bottom-right Edit Button */}
        <button className="owner-edit-button" onClick={onEdit} type="button" aria-label="Edit owner">
          <img src={editSquare} alt="Edit" width={22} height={22} />
        </button>
      </div>
    </div>
  );
};

// Export OwnerCardDetail for use in owner details forms
export default OwnerCardDetail;