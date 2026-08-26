import {
    Box,
    Typography
} from "@mui/material";

export default function IpoPage() {

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight={700}
            >
                IPO
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