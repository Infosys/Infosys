import type { SxProps, Theme } from "@mui/material";

export const filterButtonContainerSx: SxProps<Theme> = {
    display: 'flex', 
    justifyContent: 'flex-end', 
    mt: 2 
};

export const TypographySx: SxProps<Theme> = {

}

export const DividerSx: SxProps<Theme> = {
    my: 2,  
    borderBottomWidth: 2
}

export const autoCompleteSx: SxProps<Theme> = {
    // Change border color when focused and not
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#c84c03",
                },
              
                // Text color (optional for input)
                color: "#c84c03",
              },
              "& label.Mui-focused": {
                color: "#c84c03",
              },
              // Optional: Change chip color if desired
              "input": {
                color: "#c84c03",
              },
}