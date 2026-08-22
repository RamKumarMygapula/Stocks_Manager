import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

interface Props {

    open: boolean;

    title: string;

    message: string;

    confirmText?: string;

    confirmColor?:
        | "primary"
        | "error"
        | "success";

    onCancel: () => void;

    onConfirm: () => void;

}

export default function ConfirmDialog({

    open,

    title,

    message,

    confirmText = "Confirm",

    confirmColor = "primary",

    onCancel,

    onConfirm

}: Props) {

    return (

        <Dialog

            open={open}

            onClose={onCancel}

        >

            <DialogTitle>

                {title}

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    {message}

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button

                    onClick={onCancel}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    color={confirmColor}

                    onClick={onConfirm}

                >

                    {confirmText}

                </Button>

            </DialogActions>

        </Dialog>

    );

}