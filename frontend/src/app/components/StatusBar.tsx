import { useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Alert, AlertProps } from "@mui/material";


export default function StatusBar() {
    const { status, statusMessage } = useAppContext();
    const { severity, text } = useMemo<{severity: AlertProps['severity'], text: string}>( () => {
        switch (status) {
            case "pending":
                return { severity: "success", text: "Ready" };
            case "loading":
                return { severity: "info", text: "Loading..." };
            case "error":
                return { severity: "error", text: `Error: ${statusMessage}` };
        }
    }, [status, statusMessage])
        
    return (
        <Alert severity={severity} className="text-grey-500">{text}</Alert>
    )
}