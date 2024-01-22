
// Extracted (and adapted) from:
// https://mui.com/material-ui/react-button/#file-upload

import { UploadFile } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ChangeEventHandler } from "react";

export type InputFileUploadProps = {
    /** When used in a form, field needs to have a name */
    name: string;
    /** Text to display on the button */
    label?: string;
    /** Title to display on hover */
    title?: string;
    /** Triggered when user changes input value */
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function InputFileUpload({ title, label, ...inputProps }: InputFileUploadProps) {
    return (
        <Button
            component="label"
            title={title}
            variant="contained"
            className="bg-cyan-600 hover:bg-cyan-500 rounded-2px"
            startIcon={<UploadFile />}
        >
            {label}       
            <input
                {...inputProps}
                style={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                }}
                type="file"
            />
        </Button>
    );
}