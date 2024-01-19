"use client"
import { Box } from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext, useAppDispatchContext } from "@/app/contexts/AppContext";
import { useEffect, useState } from "react";
import { useAPI } from "@/app/utilities/useApi";
import SampleDetails from "./components/SampleDetails";
import { Sample, SampleCreate } from "@/app/types";
import { useQueryState } from "nuqs";
import SampleDialog from "./components/SampleDialog";

export default function Home() {

  // Read url parameter "sample-id" to determine which sample to fetch
  const [sampleId, setSampleId] = useQueryState('sample-id')
  const { page, status, statusMessage, sample } = useAppContext()
  const dispatch = useAppDispatchContext();
  const { getPage, getSample, createSample } = useAPI()
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [dialogCreateOpen, setDialogCreateOpen] = useState(false);

  /** Update current sample when sampleId (url param) changes */
  useEffect(() => {
    if (sampleId) {
      getSample(parseInt(sampleId, 10))
    } else {
      dispatch({ type: "setSample", payload: { sample: null } })
    }
  }, [dispatch, getSample, sampleId])

  /** On mount */
  useEffect(() => {
    getPage()
  }, [])

  const handleSetPage = (newPage: number) => {
    getPage(newPage);
  }

  const handleSetRowsPerPage = (newLimit: number) => {
    getPage(page.index, newLimit)
  }

  const handleRefresh = async () => {
    await getPage();

    if (sample !== null) {
      getSample(sample.id);
    }
  }

  const handleCreateSample = () => {
    setDialogEditOpen(true);
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

  function handleCreate(sample: SampleCreate): Promise<Sample | null> {
    return createSample(sample)
  }

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
          />
        </Box>
      </Box>
      <p hidden={status !== "loading"} className="text-grey-500">Loading...</p>
      <p hidden={status !== "error"} className="text-red-500" title={statusMessage} >Error: see console</p>

      {/** Create Sample Dialog */}    
      <SampleDialog
        sample={null}
        open={dialogCreateOpen}
        setOpen={setDialogCreateOpen}
      />
      {/** Edit Sample Dialog */}  
      <SampleDialog
        sample={sample}
        open={dialogEditOpen}
        setOpen={setDialogEditOpen}
      />
    </Box>
  )
}
