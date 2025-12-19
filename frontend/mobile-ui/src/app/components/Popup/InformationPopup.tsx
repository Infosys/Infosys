
// InformationPopup is a wrapper for the Popup component, used to display informational messages
import type { PopupProps } from "../../models/Popup.model";
import Popup from "./Popup";


// Functional component for information popups
export const InformationPopup = ({ title, message, type, open, onClose }: PopupProps) => (
  <Popup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
);