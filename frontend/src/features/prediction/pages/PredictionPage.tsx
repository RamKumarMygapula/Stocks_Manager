import {
    Box,
    Typography
} from "@mui/material";

export default function PredictionPage() {

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight={700}
            >
                Prediction
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
            >
                Coming Soon
            </Typography>

        </Box>

    );

}