// Ambient module declarations for MUI icon submodules that may not have
// individual type declaration files in some registries or bundlers.
// This file tells TypeScript to accept imports like
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
// without raising "Could not find a declaration file for module" errors.

declare module '@mui/icons-material/*' {
  import { SvgIconComponent } from '@mui/material/SvgIcon';
  const content: SvgIconComponent;
  export default content;
}
