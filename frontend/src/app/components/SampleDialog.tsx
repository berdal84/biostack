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
import InputFileUpload from './InputFileUpload';
import { Alert, Box } from '@mui/material';
import { ChangeEvent } from 'react';

type SampleDialogProps = {
    /** The sample to edit, or undefined to create a new sample */
    sample?: Sample;
    /** Modal state */
    open: boolean;
    /** Setter to change modal state */
    setOpen: (open: boolean) => void;
    /** triggered when sample is created or updated */
    onChange: (sample: Sample) => void;
}

type FormType =
    Omit<Sample, 'id'>
    & {
        /** A new file to upload */
        new_file: File | undefined;
    }

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
export default function SampleDialog({ sample, open, setOpen, onChange }: SampleDialogProps) {
    const { createSample, updateSample, uploadFile } = useAPI()
    /** Check if sample is being edited, ensure at compile time sample is not undefined when return true */
    const isEditing = (sample: Sample|undefined): sample is Sample => {
        return sample?.id !== undefined;
    }
    const title = isEditing(sample) ? `Edit Sample "${sample.name}" (id ${sample.id})` : "Create Sample";
    const submitButtonLabel = isEditing(sample) ? "Save" : "Create";

    /** Uses formik to handle form state and actions */
    const formik = useFormik<FormType>({
        enableReinitialize: true,
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
                    
                    // Update file
                    if ( values.new_file ) {
                        result = await uploadFile(sample.id, values.new_file);
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
                onChange(result)
            } else {
                // We should never get there, since there is a "handleError" in useAPI, but just for development, it is useful.
                alert(`Unable to ${sample ? "update" : "create"} sample, check console.`)
            }
        },
    });

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    function handleFileUploadChange(event: ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        formik.setFieldValue('new_file', file); // undefined will clear the field
    }

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
            <DialogContent className="flex flex-col gap-3">
                <DialogContentText>
                    <span>Please provide information about your sample and press {submitButtonLabel}</span>
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
                {isEditing(sample)
                    && <Box className="flex items-center">
                        <TextField
                        label="File Name"
                        type="text"
                        name="file_name"
                        margin="dense"
                        InputLabelProps={{ disabled: true, shrink: true }}
                        variant="standard"
                        value={formik.values.new_file?.name ?? formik.values.file_name}
                    />
                    <InputFileUpload
                        label="Upload"
                        name="new_file"
                        onChange={handleFileUploadChange}
                        title={formik.values.file_name ? `New Upload (${formik.values.file_name} will be lost)` : "Upload"}
                        />
                    </Box>}
                
                {formik.values.new_file && formik.values.file_name &&
                    <Alert severity="info">
                        {formik.values.file_name} will be deleted, and {formik.values.new_file.name} will replace it.
                    </Alert>}   
                {!isEditing(sample) && <Alert severity="info">
                    WIP: you will be able to attach a file to your sample once it created.
                </Alert>}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">{submitButtonLabel}</Button>
            </DialogActions>
        </Dialog>

    );
}