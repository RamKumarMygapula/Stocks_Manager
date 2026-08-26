import {
    Box,
    Typography
} from "@mui/material";

export default function LogsPage() {

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight={700}
            >
                Logs
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