import { Box } from "@mui/material";
import { useAppContext } from "../contexts/AppContext";
import { Sample } from "@/app/types"
import Button from "@/app/components/Button";

type SampleEditorProps = {
    sample: Sample | null;
    onChange: (newValues: Sample) => void;
}

/**
 * UI to visualize and edit a Sample.
 */
export default function SampleEditor({ sample, onChange }: SampleEditorProps) {

    if (sample === null) {
        return <Box>
            Select a sample to see details
        </Box>
    }

    const { id, name, type, date, file_name } = sample;
    return (
        <Box>
            <p>Id:{id}</p>
            <p>Name: {name}</p>
            <p>Type: {type}</p>
            <p>Date: {date}</p>
            <p>File: {file_name}</p>
            <Button disabled>Save</Button>
        </Box>
    )
}