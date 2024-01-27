import { Box, Divider } from "@mui/material";
import { Sample } from "@/app/types"
import Button from "@/app/components/Button";
import { ArrowBackSharp, Close, Delete, Edit } from "@mui/icons-material";

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
        return <Box className="italic text-sm flex flex-col gap-4 group h-full">
            <p>No sample selected.</p>
            <p className="duration-300 opacity-0 group-hover:opacity-100"><ArrowBackSharp />Click on a sample from the list to see details.</p >
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
        <Box className="border ">
            <Box className="flex gap-1 justify-end bg-black/10 p-0.5">
                <Button onClick={() => handleEdit()} title="Edit"><Edit /></Button>
                <Button onClick={() => handleDelete()} title="Delete"><Delete/></Button>                
                <div className="flex-auto"></div>
                <Button className="ml-50px" onClick={() => handleClose()} title="Close"><Close /></Button>
            </Box>
            <Divider />
            <Box className="p-3">
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
                                    href={`${process.env.API_BASE_URL}/sample/${id}/download`}
                                    className="underline"
                                    title="Download File"
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