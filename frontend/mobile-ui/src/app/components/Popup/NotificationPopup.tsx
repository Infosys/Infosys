// NotificationPopup component: renders different popup types based on 'type' prop
import type { PopupProps } from "../../models/Popup.model";
import { AlertPopup } from "./AlertPopup";
import { InformationPopup } from "./InformationPopup";
import { SuccessPopup } from "./SuccessPopup";
import { WarningPopup } from "./WarningPopup";

// Renders the appropriate popup component based on the 'type' prop
// Supported types: 'alert', 'information', 'warning', 'success' (default)
export const NotificationPopup = ({ title, message, type, open, onClose }: PopupProps) => {
  const commonProps = { type, title, message, open, onClose };

  switch (type) {
    case 'alert':
      return <AlertPopup {...commonProps} />;
    case 'information':
      return <InformationPopup {...commonProps} />;
    case 'warning':
      return <WarningPopup {...commonProps} />;
    default:
      return <SuccessPopup {...commonProps} />;
  }
};