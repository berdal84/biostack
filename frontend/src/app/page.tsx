"use client"
import { Box } from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext, useAppDispatchContext } from "@/app/contexts/AppContext";
import {useCallback, useEffect, useState} from "react";
import { useAPI } from "@/app/utilities/useApi";
import SampleDetails from "./components/SampleDetails";
import { Sample, SampleCreate } from "@/app/types";
import { useQueryState } from "nuqs";
import SampleDialog from "./components/SampleDialog";
import {ConfirmationDialog} from "@/app/components/ConfirmationDialog";

export default function Home() {

  // Read url parameter "sample-id" to determine which sample to fetch
  const [sampleId, setSampleId] = useQueryState('sample-id')
  const { page, status, statusMessage, sample } = useAppContext()
  const dispatch = useAppDispatchContext();
  const api = useAPI()
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [dialogCreateOpen, setDialogCreateOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  /** Update current sample when sampleId (url param) changes */
  useEffect(() => {
    if (sampleId) {
      api.getSample(parseInt(sampleId, 10))
    } else {
      dispatch({ type: "setSample", payload: { sample: null } })
    }
  }, [sampleId])

  /** On mount */
  useEffect(() => {
    api.getPage()
  }, [])

  const handleSetPage = (newPage: number) => {
    api.getPage(newPage);
  }

  const handleSetRowsPerPage = (newLimit: number) => {
    api.getPage(page.index, newLimit)
  }

  const handleRefresh = async () => {
    await api.getPage();

    if (sample !== null) {
      api.getSample(sample.id);
    }
  }

  const handleCreateSample = () => {
    setDialogCreateOpen(true);
  }

  function handleSampleChange(newValues: Sample): void {
    alert("Function not implemented.");
  }

  function handleSampleClick(sample: Sample): void {
    setSampleId(String(sample.id))
  }

  function handleEdit(sample: Sample): void {
    setDialogEditOpen(true)
  }

  function handleClose(): void {
    setSampleId(null)
  }

  const handleDialogDeleteClose = useCallback( async (agree?: boolean) => {
    if ( agree && sample ) {
      // If user agreed, delete sample and refresh.
      await api.deleteSample(sample.id);
      await setSampleId(null); // would give a 404 if we keep the current sample.id
      await handleRefresh()
    }
    setDialogDeleteOpen(false);
  }, [api, sample])

  return (
    <Box className="flex flex-col gap-5">

      {/* Header */}
      <Box>
        <p>Welcome to BioStack, a FastAPI/NextJS exercise</p>
      </Box>

      {/* Tool bar */}
      <Box className="gap-1 *:m-1">
        <Button disabled={status === "loading"} onClick={handleRefresh}>Refresh</Button>
        <Button onClick={handleCreateSample}>Create Sample</Button>
      </Box>

      <Box className="flex gap-10">

        {/* Left side */}
        <Box className="flex flex-col gap-2 flex-auto">
          <h1 className="text-lg underline">Sample List:</h1>
          <Table
            rows={page.items}
            page={page.index}
            setPage={handleSetPage}
            rowsPerPage={page.limit}
            setRowsPerPage={handleSetRowsPerPage}
            count={page.total_item_count}
            onClick={handleSampleClick}
          />
        </Box>

        {/* Right side */}
        <Box className="flex flex-col gap-2 flex-1">
          <h1 className="text-lg underline">Selected Sample:</h1>
          <SampleDetails
            sample={sample}
            onEdit={handleEdit}
            onClose={handleClose}
            onDelete={() => setDialogDeleteOpen(true)}
          />
        </Box>
      </Box>
      <p hidden={status !== "loading"} className="text-grey-500">Loading...</p>
      <p hidden={status !== "error"} className="text-red-500" title={statusMessage} >Error: see console</p>

      {/** Create Sample Dialog */}
      <SampleDialog
        open={dialogCreateOpen}
        setOpen={setDialogCreateOpen}
      />
      {/** Edit Sample Dialog */}
      {sample && <SampleDialog
        sample={sample}
        open={dialogEditOpen}
        setOpen={setDialogEditOpen}
      />}
      {/** Delete Sample Dialog */}
      {sample && <ConfirmationDialog
          open={dialogDeleteOpen}
          onClose={handleDialogDeleteClose}
          title="Delete a Sample"
      >
        <Box className={"flex gap-5 flex-col"}>
          <p>You are about to delete <i>{sample.name} (id: {sample.id})</i>. It cannot be undo.</p>
          <p>Are you sure?</p>
        </Box>
      </ConfirmationDialog>
      }
    </Box>
  )
}
