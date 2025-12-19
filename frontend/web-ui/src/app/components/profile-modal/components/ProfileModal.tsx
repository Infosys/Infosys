import React from 'react'
import { Box, Popover, Typography, Button } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { useAuth } from '../../../features/login-signup/provider/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../../../store/userSlice';
import type { RootState } from '../../../../store';

// Props for ProfileModal: anchor element for popover and close handler
export interface ProfileModalProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ anchorEl, onClose }) => {
    const open = Boolean(anchorEl);
    const { logout } = useAuth();
    const dispatch = useDispatch();
    
    // Get user from Redux persisted state instead of AuthProvider
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    // Extract user information with fallbacks
    const fullName = currentUser 
        ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}` 
        : "Full Name";
    
    const roleMapping: Record<string, string> = {
        SERVICE_MANAGER: "Service Manager",
        COMMISSIONER: "Commissioner",
        ADMIN: "IT Admin",
    };

    const role = currentUser ? roleMapping[currentUser.role] || "N/A" : "N/A";

    const handleLogOut = async () => {
        await logout();
        dispatch(clearUser());
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            PaperProps={{
                sx: {
                    width: '25vw',
                    height: '35vh',
                    bgcolor: '#F5F5F5',
                    borderRadius: '8px',
                    boxShadow: 10,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    ml: 2.5
                }
            }}
        >
            {/* Profile section with icon, name, and role */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                width: '100%',
                gap: 2,
            }}>
                <AccountCircleOutlinedIcon
                    sx={{ fontSize: 60, color: '#a7a7a7ff', bgcolor: '#F5F5F5', borderRadius: '50%', p: 0.5 }}
                />
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#C84C0E', fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                        {fullName}
                    </Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                        Role : <span style={{ color: '#C84C0E' }}>{role}</span>
                    </Typography>
                </Box>
            </Box>

            {/* Spacer to push the logout button to the bottom */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Logout button at the bottom right */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#C84C0E',
                        color: '#fff',
                        borderRadius: '20px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#A83700'
                        }
                    }}
                    onClick={handleLogOut}
                >
                    Logout
                </Button>
            </Box>
        </Popover>
    );
};

export default ProfileModal;