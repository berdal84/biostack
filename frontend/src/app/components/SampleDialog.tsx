import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@/app/components/Button';
import { Sample, SampleCreate, SampleUpdate } from '@/app/types';
import { useAPI } from '../utilities/useApi';
import { useFormik } from 'formik';

type SampleDialogProps = {
    /** The sample to edit, or null to create a new sample */
    sample: Sample | null;
    /** Modal state */
    open: boolean;
    /** Setter to change modal state */
    setOpen: (open: boolean) => void;
}

/**
 * Sample dialog to create or edit a sample.
 */
export default function SampleDialog({ sample, open, setOpen }: SampleDialogProps) {

    const { createSample, updateSample } = useAPI()

    const title = sample ? `Edit Sample "${sample.name}" (id ${sample.id})` : "Create Sample";
    const submitButtonLabel = sample ? "Save" : "Create";
    const isEditing = sample !== null;

    /** Uses formik to handle form state and actions */
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: sample?.name ?? "",
            date: sample?.date ?? new Date().toISOString(),
            type: sample?.type ?? "",
            file_name: sample?.file_name,
            new_file: null,
        },
        onSubmit: async (values) => {
            let result: Sample | null | undefined;


            try {
                if (isEditing) {
                    // Update sample data
                    result = await updateSample(sample.id, values as SampleUpdate);
                    // TODO: update sample file
                    if ( values.new_file ) {
                        alert("Uploading a new file is not implemented yet")
                    }

                } else {
                    result = await createSample(values as SampleCreate);
                }
            } catch (error: any) {
                console.error("An error occured", error )
                alert(`Unexpect error, see console`)
            }


            if (result) {
                setOpen(false)
            } else {
                alert(`Unable to ${isEditing ? "update" : "create"!}`)
            }
        },
    });

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: formik.handleSubmit
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>Please provide information about your sample and press create.</p>
                    <p className="text-xs italic">Note: you will be able to attach a file to your sample once the sample is created.</p>
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
                    value={formik.values.name}
                    onChange={formik.handleChange}
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
                    value={formik.values.type}
                    onChange={formik.handleChange}
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
                    value={formik.values.date}
                    onChange={formik.handleChange}
                />
                {isEditing && <>
                    <TextField
                        required
                        margin="dense"
                        id="file_name"
                        name="file_name"
                        type="text"
                        label="File"
                        variant="standard"
                        value={formik.values.file_name}
                        onChange={formik.handleChange}
                    />
                    {/* TODO: improve form to understand that this field is to override existing file or do a first upload */}
                    <TextField
                        margin="dense"
                        id="file"
                        name="file"
                        type="file"
                        label="Upload New File"                    
                        variant="standard"
                        value={formik.values.new_file}
                        onChange={formik.handleChange}
                    />
                </>}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">{submitButtonLabel}</Button>
            </DialogActions>
        </Dialog>

    );
}