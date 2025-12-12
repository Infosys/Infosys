
/**
 * This component renders a styled Material-UI Checkbox for use in the application inbox.
 * It uses custom icons and styles for checked and unchecked states.
 */
import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/CheckBoxOutlined'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { checkBoxIconSx, checkBoxCheckedIconSx } from '../../styles/ApplicationInboxButtons/ApplicationInboxCheckboxStyle'


// Functional component to render a custom-styled checkbox
const ApplicationInboxCheckBox = () => {
  return (
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon sx={checkBoxIconSx} />}
      checkedIcon={<CheckIcon sx={checkBoxCheckedIconSx} />}
    />
  )
}


// Export the ApplicationInboxCheckBox component as default
export default ApplicationInboxCheckBox