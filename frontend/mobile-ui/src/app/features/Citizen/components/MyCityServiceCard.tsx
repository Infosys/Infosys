// ...existing code...
import React from 'react';
import Button from '@mui/material/Button';
import '../../../../styles/Citizen/MyCityServiceCard.css';

export type ServiceItem = {
  serviceTitle: string;
  department?: string;
  processingTime?: string;
  serviceLocation?: string;
  requiredDocuments?: boolean;
  contact?: string;
  applyLink?: string;
};

type Props = {
  service: ServiceItem;
};

const ServiceCard: React.FC<Props> = ({ service }) => {
  return (
    <article className="mcs-card" aria-label={service.serviceTitle}>
      <header className="mcs-card-header">
        <h3 className="mcs-title">{service.serviceTitle}</h3>
        {service.department && <div className="mcs-department">{service.department}</div>}
      </header>

      <div className="mcs-card-body">
        <div className="mcs-meta-row">
          <div className="mcs-meta">
            <div className="mcs-meta-label">Processing Time</div>
            <div className="mcs-meta-value">{service.processingTime}</div>
          </div>

          <div className="mcs-meta">
            <div className="mcs-meta-label">Office Location</div>
            <div className="mcs-meta-value">{service.serviceLocation}</div>
          </div>
        </div>

        <div className="mcs-bottom-row">
          <div className="mcs-left">
            {service.requiredDocuments && <span className="mcs-badge">Required Documents</span>}
            <div className="mcs-contact">
              <div className="mcs-contact-label">Contact</div>
              <div className="mcs-contact-value">{service.contact}</div>
            </div>
          </div>

          <div className="mcs-actions">
            <Button
              href={service.applyLink}
              className="mcs-apply-btn"
              variant="contained"
              size="small"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
// ...existing code...