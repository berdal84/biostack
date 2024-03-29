"use client"
import {Alert, Box} from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext, useAppDispatchContext } from "@/app/contexts/AppContext";
import {useCallback, useEffect, useState} from "react";
import { useAPI } from "@/app/utilities/useApi";
import SampleDetails from "./components/SampleDetails";
import { Sample } from "@/app/types";
import { useQueryState } from "nuqs";
import SampleDialog from "./components/SampleDialog";
import {ConfirmationDialog} from "@/app/components/ConfirmationDialog";
import StatusBar from "./components/StatusBar";

export default function Home() {

  const [urlSampleId, setUrlSampleId] = useQueryState('sample-id')
  const { page, status, statusMessage, sample } = useAppContext()
  const dispatch = useAppDispatchContext();
  const api = useAPI()
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [dialogCreateOpen, setDialogCreateOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  /** On mount */
  useEffect(() => {
    api.getPage(0)
    // Load sample from sample-id URLParam
    if (urlSampleId) {
      api.getSample(parseInt(urlSampleId, 10))
    }
  }, [])

  /** Ensure sample-id URLParam is set to the current sample.id or null */
  useEffect(() => {
    setUrlSampleId(sample ? `${sample.id}`  : null)
  }, [sample])

  const handleSetPage = (newPage: number) => {
    api.getPage(newPage);
  }

  const handleSetRowsPerPage = (newLimit: number) => {
    api.getPage(page.index, newLimit)
  }

  const handleRefresh = async () => {
    await api.refreshPage();

    if (sample !== null) {
      api.getSample(sample.id);
    }
  }

  const handleCreateSample = () => {
    setDialogCreateOpen(true);
  }

  function setCurrentSample(sample: Sample | null): void {
    dispatch({ type: 'setSample', payload: { sample }})
  }

  function handleSampleClick(sample: Sample): void {
    // Set current sample
    setCurrentSample(sample);
  }

  function handleEdit(sample: Sample): void {
    setDialogEditOpen(true)
  }

  function handleClose(): void {
    setCurrentSample(null)
  }

  function handleSampleChange(): void {
    api.refreshPage()
  }

  /**
   * Handle onClose event from Delete Dialog
   */
  const handleDialogDeleteClose = useCallback( async (agree?: boolean) => {
    if ( agree && sample ) {
      // If user agreed, delete sample and refresh.
      await api.deleteSample(sample.id);
      await setUrlSampleId(null); // would give a 404 if we keep the current sample.id
      await api.refreshPage();
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
            selectedId={sample?.id}
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

      <StatusBar/>

      {/** Create Sample Dialog */}
      <SampleDialog
        open={dialogCreateOpen}
        setOpen={setDialogCreateOpen}
        onChange={handleSampleChange}
      />
      {/** Edit Sample Dialog */}
      {sample && <SampleDialog
        sample={sample}
        open={dialogEditOpen}
        setOpen={setDialogEditOpen}
        onChange={handleSampleChange}
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
