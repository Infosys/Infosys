// Card summarizing a single floor's details in the property form, with edit/delete actions.

import React from 'react';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import deleteIcon from '../../../../assets/Agent/delete.svg';
import editSquare from '../../../../assets/Agent/edit_square.svg';
import type { FloorDetails } from '../../../../../context/PropertyFormContext';
import { useFloorDetailsLocalization } from '../../../../../services/AgentLocalisation/localisation-floor-details';
import '../../../../../styles/FloorSection.css';

interface FloorCardProps {
  floor: FloorDetails;
  index: number;
  onEdit: (floor: FloorDetails) => void;
  onDelete: (index: number) => void;
}

const FloorCard: React.FC<FloorCardProps> = ({ floor, index, onEdit, onDelete }) => {
  // Get localized labels for floor details
  const {
    floorText,
    classificationText,
    usageText,
    plinthAreaLabel,
    lengthLabel,
    breadthLabel,
    deleteText,
  } = useFloorDetailsLocalization();

  // Render floor card UI
  return (
    <div
      className="floor-card"
      style={{
        marginRight: '5%',
        marginLeft: '5%',
        padding: '3%',
        border: '1px solid #ddd',
        borderRadius: 17,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fafafa',
        position: 'relative',
      }}
    >
      {/* Icon representing a floor */}
      <MeetingRoomOutlinedIcon style={{ fontSize: '40px' }} />
      <div style={{ flex: 1 }}>
        {/* Floor details */}
        <div style={{ fontWeight: 600, fontSize: '16px' }}>
          {floorText}: {floor.floorNumber}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#555',
            wordBreak: 'break-word',
            paddingRight: 22,
          }}
        >
          {classificationText}: {floor.buildingClassification}
        </div>
        <div style={{ fontSize: 14, color: '#555' }}>
          {usageText}: {floor.natureOfUsage}
        </div>
        <div style={{ fontSize: 14, color: '#555' }}>
          {plinthAreaLabel}: {floor.plinthArea}
        </div>
        <div style={{ fontSize: 14, color: '#555' }}>
          {lengthLabel}: {floor.length}
        </div>
        <div style={{ fontSize: 14, color: '#555' }}>
          {breadthLabel}: {floor.breadth}
        </div>
      </div>
      {/* Edit and delete buttons for the floor */}
      <div className="edit-floor-button-container">
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => onDelete(index)}
          aria-label={deleteText}
          type="button"
        >
          <img src={deleteIcon} alt="Delete" width={26} height={26} draggable={false} />
        </button>
        <button
          style={{ border: 'none', backgroundColor: 'none', cursor: 'pointer' }}
          onClick={() => onEdit(floor)}
          type="button"
          aria-label="Edit floor"
        >
          <img src={editSquare} alt="Edit" width={26} height={26} />
        </button>
      </div>
    </div>
  );
};

// Export FloorCard for use in floor details forms
export default FloorCard;
