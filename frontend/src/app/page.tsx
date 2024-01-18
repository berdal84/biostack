"use client"
import { Box } from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext } from "@/app/contexts/AppContext";
import { useEffect } from "react";
import { useAPI } from "@/app/utilities/useApi";

export default function Home() {
  const { page, status, statusMessage } = useAppContext()
  const { fetchPage } = useAPI()

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

  return (
    <Box className="flex flex-col gap-5">
      <Box>
        <p>Welcome to BioStack, a FastAPI/NextJS exercise</p>
        <p>Find below the most recent Samples.</p>
      </Box>
      <Button disabled={status === "loading"} onClick={handleRefresh}>Refresh</Button>
      <Table
        rows={page.items}
        page={page.index}
        setPage={handleSetPage}
        rowsPerPage={page.limit}
        setRowsPerPage={handleSetRowsPerPage}
        count={page.total_item_count}
      />
      <p hidden={status !== "loading"} className="text-grey-500">Loading...</p>
      <p hidden={status !== "error"} className="text-red-500" title={statusMessage} >Error: see console</p>
    </Box>
  )
}
