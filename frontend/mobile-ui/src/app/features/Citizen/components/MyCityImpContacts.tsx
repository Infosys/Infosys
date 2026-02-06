import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import '../../../../styles/Citizen/MyCityImpContacts.css';

export type Contact = {
  label: string;
  phone: string;
};

type Props = {
  title?: string;
  contacts?: Contact[];
  className?: string;
};

const ImportantContacts: React.FC<Props> = ({
  title = 'Important Contacts',
  contacts = [],
  className = '',
}) => {
  return (
    <Paper className={`mc-contacts-card ${className}`} elevation={0} role="group" aria-label={title}>
      <Typography component="div" className="mc-contacts-title">
        {title}
      </Typography>

      <div className="mc-contacts-list">
        {contacts.map((c) => (
          <div className="mc-contact-row" key={`${c.label}-${c.phone}`}>
            <span className="mc-contact-label">{c.label}</span>
            <span className="mc-contact-phone">{c.phone}</span>
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default ImportantContacts;