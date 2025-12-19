import { Box, Typography } from "@mui/material"
import { selectorTabSx, singleTabSx, selectedSingelTabSx } from "../../Styles/SelectorTabStyle/SelectorTabStyle"

const SelectorTabItems: string[] = [
    "Manage Maps",
    "View Map Options"
]

interface SelectorTabProps {
    selectedIndex?: number;
    onTabChange?: (index: number) => void;
}

const SelectorTab: React.FC<SelectorTabProps> = ({ selectedIndex = 0, onTabChange }) => {
  return (
    <Box sx={selectorTabSx}>
        {SelectorTabItems.map((item, index) => (
            <Box
                sx={index === selectedIndex ? selectedSingelTabSx : singleTabSx}
                key={index}
                onClick={() => onTabChange && onTabChange(index)}
            >
                <Typography fontWeight={300} fontSize={16}>{item}</Typography>
            </Box>
        ))}
    </Box>
  )
}

export default SelectorTab