import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';

export const channelOptions = [
  { label: "Email", icon: <DraftsOutlinedIcon /> },
  { label: "SMS", icon: <ChatBubbleOutlineOutlinedIcon /> },
  { label: "WhatsApp", icon: <ModeCommentOutlinedIcon /> },
  { label: "In-App", icon: <CircleNotificationsOutlinedIcon /> },
];