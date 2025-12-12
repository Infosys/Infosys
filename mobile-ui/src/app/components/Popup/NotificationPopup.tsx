// NotificationPopup component: renders different popup types based on 'type' prop
import type { PopupProps } from "../../models/Popup.model";
import { AlertPopup } from "./AlertPopup";
import { InformationPopup } from "./InformationPopup";
import { SuccessPopup } from "./SuccessPopup";
import { WarningPopup } from "./WarningPopup";

// Renders the appropriate popup component based on the 'type' prop
// Supported types: 'alert', 'information', 'warning', 'success' (default)
export const NotificationPopup = ({ title, message, type, open, onClose }: PopupProps) => (
  // If type is 'alert', render AlertPopup
  type === 'alert' ? <AlertPopup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
  // If type is 'information', render InformationPopup
  : type === 'information' ? <InformationPopup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
  // If type is 'warning', render WarningPopup
  : type === 'warning' ? <WarningPopup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
  // Default: render SuccessPopup
  : <SuccessPopup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
);