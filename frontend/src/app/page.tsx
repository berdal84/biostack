"use client"
import { Box } from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext } from "@/app/contexts/AppContext";
import { useEffect } from "react";
import { useAPI } from "@/app/utilities/useApi";
import SampleEditor from "./components/SampleEditor";
import { Sample } from "@/app/types";
import { useQueryState } from "nuqs";

export default function Home() {

  // Read url parameter "sample-id" to determine which sample to fetch
  const [sampleId, setSampleId] = useQueryState('sample-id')

  const { page, status, statusMessage, sample } = useAppContext()
  const { fetchPage, fetchSample } = useAPI()

  /** Fetch sample when sampleId (url param) changes */
  useEffect(() => {
    fetchSample(sampleId ? parseInt(sampleId) : null)
  }, [sampleId])

  useEffect(() => {
    // Trigger a fetch once
    fetchPage()
  }, [])

  const handleSetPage = (newPage: number) => {
    fetchPage(newPage);
  }

  const handleSetRowsPerPage = (newLimit: number) => {
    fetchPage(page.index, newLimit)
  }

  const handleRefresh = () => {
    fetchPage()
  }

  const handleCreateSample = () => {
    alert("Function not implemented.");
  }

  function handleSampleChange(newValues: Sample): void {
    alert("Function not implemented.");
  }

  function handleSampleClick(sample: Sample): void {
    setSampleId(String(sample.id))
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
          <SampleEditor sample={sample} onChange={handleSampleChange} />
        </Box>
      </Box>
      <p hidden={status !== "loading"} className="text-grey-500">Loading...</p>
      <p hidden={status !== "error"} className="text-red-500" title={statusMessage} >Error: see console</p>
    </Box>
  )
}
