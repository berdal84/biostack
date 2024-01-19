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
import {useEffect} from "react";

type SampleDialogProps = {
    /** The sample to edit, or undefined to create a new sample */
    sample?: Sample;
    /** Modal state */
    open: boolean;
    /** Setter to change modal state */
    setOpen: (open: boolean) => void;
}

type FormType =
    Omit<Sample, 'id'>
    & { new_file?: File }

const DEFAULT_VALUES: FormType = {
    name: "",
    date: new Date().toISOString(),
    type: "",
    file_name: "",
    new_file: undefined,
}

/**
 * Sample dialog to create or edit a sample.
 */
export default function SampleDialog({ sample, open, setOpen }: SampleDialogProps) {

    const { createSample, updateSample } = useAPI()
    const title = sample ? `Edit Sample "${sample.name}" (id ${sample.id})` : "Create Sample";
    const submitButtonLabel = sample ? "Save" : "Create";
    const isEditing = (sample: Sample|undefined): sample is Sample => {
        return sample?.id !== undefined;
    }

    /** Uses formik to handle form state and actions */
    const formik = useFormik<FormType>({
        initialValues: {
            ...DEFAULT_VALUES,
            ...sample
        },
        onSubmit: async (values) => {
            let result: Sample | null | undefined;

            // API request
            try {
                if (isEditing(sample)) {
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
                console.error(error);
                alert(`Unexpect error, see console`)
            }

            if (result) {
                setOpen(false)
            } else {
                alert(`Unable to ${sample != null} ? "update" : "create"!}`)
            }
        },
    });

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
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
                    <span>Please provide information about your sample and press {submitButtonLabel}</span>
                    { !isEditing(sample) && <span className="text-xs italic">WIP: you will be able to attach a file to your sample once it created.</span>}
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
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
                    name="date"
                    type="datetime-local"
                    label="Date Collected"
                    fullWidth
                    variant="standard"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                />
                {isEditing(sample) && <>
                    <TextField
                        margin="dense"
                        name="file_name"
                        type="text"
                        label="File"
                        variant="standard"
                        value={formik.values.file_name ?? ""}
                        onChange={formik.handleChange}
                    />
                    {/* TODO: improve form to understand that this field is to override existing file or do a first upload */}
                    <TextField
                        margin="dense"
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