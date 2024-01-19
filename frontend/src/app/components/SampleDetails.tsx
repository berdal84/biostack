import { Box } from "@mui/material";
import { Sample } from "@/app/types"
import Button from "@/app/components/Button";

type SampleEditorProps = {
    /** The sample to show details from */
    sample: Sample | null;
    /** Triggered when user click on close button */
    onClose: () => void;
    /** Triggered when user click on edit button */
    onEdit: (sample: Sample) => void;
    /** Triggered when user click on delete button */
    onDelete: (sample: Sample) => void;
}

/**
 * UI to visualize Sample details
 */
export default function SampleDetails({ sample, onEdit, onClose, onDelete }: SampleEditorProps) {

    if (sample === null) {
        return <Box>
            Select a sample to see details
        </Box>
    }

    const { id, name, type, date, file_name } = sample;

    function handleEdit(): void {
        sample && onEdit(sample)
    }

    function handleDelete(): void {
        sample && onDelete(sample)
    }

    function handleClose(): void {
        onClose()
    }

    return (
        <Box className="border p-5">
            <Box className="flex gap-2 justify-items-end mb-5">
                <Button onClick={() => handleDelete()}>Delete</Button>
                <Button onClick={() => handleEdit()}>Edit</Button>
                <Button onClick={() => handleClose()}>Close</Button>
            </Box>
            <Box>
                <table className="table-auto">
                    <tbody >
                        <tr>
                            <td className="w-20">ID</td>
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{type}</td>
                        </tr>
                        <tr>
                            <td>Date Collected</td>
                            <td>{date}</td>
                        </tr>
                        <tr>
                            <td>File</td>
                            <td>{file_name ?
                                <a
                                    // TODO: would be better to include the url in API's response
                                    href={`http://localhost:8000/sample/${id}/download`}
                                    className="underline"
                                    target="_blank"
                                    title="Download or Open file in a tab"
                                >
                                    {file_name}
                                </a>
                                :
                                '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </Box>
        </Box>
    )
}