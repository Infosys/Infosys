
// AlertPopup is a wrapper for the Popup component, used to display alert messages
import type { PopupProps } from "../../models/Popup.model";
import Popup from "./Popup";


// Functional component for alert popups
export const AlertPopup = ({ title, message, type, open, onClose }: PopupProps) => (
  <Popup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
);