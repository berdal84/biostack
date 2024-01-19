import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@/app/components/Button";
import Dialog from "@mui/material/Dialog";
import {PropsWithChildren} from "react";

export interface ConfirmationDialogRawProps {
    open: boolean;
    onClose: (value?: boolean) => void;
}

export function ConfirmationDialog(props: PropsWithChildren<ConfirmationDialogRawProps>) {
    const { onClose, open, title, children} = props;

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog
            maxWidth="xs"
            open={open}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}