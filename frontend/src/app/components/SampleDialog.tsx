import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@/app/components/Button';
import { Sample, SampleCreate } from '@/app/types';

type SampleDialogProps = {
    title: string
    open: boolean;
    setOpen: (open: boolean) => void;
    /** A promise returning a new Sample or null if create failed */
    submit: (sample: SampleCreate) => Promise<Sample | null>;
}

export default function SampleDialog({ title, open, setOpen, submit }: SampleDialogProps) {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();

                    // Convert formdata to json
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());

                    // TODO:
                    //  We need a validation system with a visual feedback here

                    submit(formJson as SampleCreate)
                        .then(() => handleClose())
                        .catch(() => { /** TODO: show an error */ })

                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>Please provide information about your sample and press create.</p>
                    <p className="text-xs italic">Note: you'll be able to attach a file to your sample once the sample is created.</p>
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    type="text"
                    label="Sample Name"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    id="type"
                    name="type"
                    type="text"
                    label="Experiment Type"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    id="date"
                    name="date"
                    type="datetime-local"
                    label="Date Collected"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Create</Button>
            </DialogActions>
        </Dialog>

    );
}