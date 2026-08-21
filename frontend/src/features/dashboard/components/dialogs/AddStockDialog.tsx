import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";

import {
    useState,
    useEffect
} from "react";

import ConfirmDialog from "../../components/common/ConfirmDialog";

import { useAddStock } from "../../hooks/useAddStock";
import { useUpdateStock } from "../../hooks/useUpdateStock";

import type { DashboardStock } from "../../types/dashboard";

interface Props {

    open: boolean;

    onClose: () => void;

    stock?: DashboardStock | null;

}

export default function AddStockDialog({

    open,

    onClose,

    stock

}: Props) {

    // =========================================================================
    // Form State
    // =========================================================================

    const [symbol, setSymbol] = useState("");

    const [buyDate, setBuyDate] = useState("");

    const [buyPrice, setBuyPrice] = useState("");

    const [quantity, setQuantity] = useState("");

    const [notes, setNotes] = useState("");

    // ============================================================================
    // Confirmation Dialog
    // ============================================================================

    const [confirmOpen, setConfirmOpen] =
        useState(false);

    // ============================================================================
    // Mutations
    // ============================================================================

    const addMutation = useAddStock();

    const updateMutation = useUpdateStock();

    // ============================================================================
    // Populate form when editing
    // ============================================================================

    useEffect(() => {

        if (stock) {

            setSymbol(stock.symbol);

            setBuyDate(stock.buy_date);

            setBuyPrice(stock.buy_price.toString());

            setQuantity(stock.quantity.toString());

            setNotes("");

        }

        else {

            setSymbol("");

            setBuyDate("");

            setBuyPrice("");

            setQuantity("");

            setNotes("");

        }

    }, [stock, open]);
    // =========================================================================
    // Submit
    // =========================================================================
    const handleSubmit = () => {

    const payload = {

        symbol,

        buy_date: buyDate,

        buy_price: Number(buyPrice),

        quantity: Number(quantity),

        notes

    };

    if (stock) {
        console.log("Updating stock:", {
            id: stock.id,
            data: payload
        });
        

        updateMutation.mutate(

        {

            id: stock.id,

            data: payload

        },

        {
            onSuccess: () => {

                setConfirmOpen(false);

                onClose();

            }

        }

    );

    }

    else {

        addMutation.mutate(

            payload,

            {

                onSuccess: () => {

                    setConfirmOpen(false);

                    onClose();

                }

            }

        );

    }

};

    // =========================================================================
    // UI
    // =========================================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                {stock ? "Edit Stock" : "Add Stock"}

            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <TextField
                        label="Stock Symbol"
                        value={symbol}
                        onChange={(e) =>
                            setSymbol(e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Buy Date"
                        type="date"
                        value={buyDate}
                        onChange={(e) =>
                            setBuyDate(e.target.value)
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Buy Price"
                        type="number"
                        value={buyPrice}
                        onChange={(e) =>
                            setBuyPrice(e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Notes"
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                        fullWidth
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={
                        addMutation.isPending ||
                        updateMutation.isPending
                    }
                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    onClick={() =>
                        setConfirmOpen(true)
                    }

                    disabled={
                        addMutation.isPending ||
                        updateMutation.isPending
                    }

                >

                    {stock
                        ? "Update Stock"
                        : "Add Stock"}

                </Button>

            </DialogActions>

            <ConfirmDialog

                open={confirmOpen}

                title={
                    stock
                        ? "Update Stock"
                        : "Add Stock"
                }

                message={
                    stock
                        ? `Are you sure you want to update ${symbol}?`
                        : `Are you sure you want to add ${symbol}?`
                }

                confirmText={
                    stock
                        ? "Update"
                        : "Add"
                }

                confirmColor="primary"

                onCancel={() =>
                    setConfirmOpen(false)
                }

                onConfirm={handleSubmit}

            />

        </Dialog>

    );

}