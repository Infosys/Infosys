// Styles for ChromeTabs

export const SELECTED_BG = "#DFDFDF";
export const UNSELECTED_BG = "#fff";
export const SELECTED_COLOR = "#222";
export const UNSELECTED_COLOR = "#222";
export const BORDER_COLOR = "#222";

export const chromeTabsContainerSx = (selected: number, customWidth?: string | number) => ({
    display: 'flex',
    width: customWidth ?? 'fit-content', // fix: use customWidth, fallback to 'fit-content'
    lineHeight: 0,
    border: `2px solid ${BORDER_COLOR}`,
    borderRadius: selected === 1 ? "18px" : "18px 18px 0 0",
    mb: selected === 0 ? 0 : 1.5,
    background: UNSELECTED_BG,
    transition: 'border-radius 0.2s',
});

export const getTabButtonStyles = (
    isSelected: boolean,
    height: number,
    borderRadius: string,
    theme: any
) => ({
    flex: 1,
    height,
    padding: theme.spacing(0, 2),
    fontWeight: 600,
    borderRadius,
    fontSize: 18,
    textTransform: 'none',
    backgroundColor: isSelected ? SELECTED_BG : UNSELECTED_BG,
    color: isSelected ? SELECTED_COLOR : UNSELECTED_COLOR,
    border: 'none',
    borderBottom: isSelected ? `2px solid ${SELECTED_BG}` : `2px solid transparent`,
    boxShadow: 'none',
    margin: 0,
    letterSpacing: '0.3px',
    '&:hover': {
        backgroundColor: isSelected ? SELECTED_BG : "#F6F6F6"
    },
    '&:focus-visible': {
        outline: `2px solid ${SELECTED_BG}`,
        outlineOffset: 2
    },
    '&:not(:first-of-type)': {
        marginLeft: 0
    }
});