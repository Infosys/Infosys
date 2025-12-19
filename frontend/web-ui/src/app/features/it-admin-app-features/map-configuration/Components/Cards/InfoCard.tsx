import { Card, Typography, Box } from "@mui/material"
import { CardSx, InfoCardContainerSx, labelSx, valueSx } from "../../Styles/CardsStyle/InfoCardStyle"

interface InfoCardProps {
  label: string
  value: number | string
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <Card sx={CardSx}>
      <Box sx={InfoCardContainerSx}>
        <Typography sx={labelSx}>
          {label}
        </Typography>
        <Typography sx={valueSx}>
          {value}
        </Typography>
      </Box>
    </Card>
  )
}

export default InfoCard