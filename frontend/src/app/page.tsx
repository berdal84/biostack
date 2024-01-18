"use client"
import { Box } from "@mui/material"
import Button from "@/app/components/Button"
import Table from "@/app/components/Table"
import { useAppContext, useAppDispatchContext } from "@/app/contexts/AppContext";
import { useEffect } from "react";

export default function Home() {
  const { page: currentPage, pageIndex, pageLimit } = useAppContext()
  const dispatch = useAppDispatchContext()

  useEffect(() => {
    // Trigger a fetch once
    dispatch({ type: "fetch", payload: {} })
  }, [])

  const handleSetPage = (newPage: number) => {
    dispatch({ type: "fetch", payload: { page: newPage } })
  }

  const handleSetRowsPerPage = (newLimit: number) => {
    dispatch({ type: "fetch", payload: { limit: newLimit } })
  }

  return (
    <Box className="flex flex-col gap-5">
      <Box>
        <p>Welcome to BioStack, a FastAPI/NextJS exercise</p>
        <p>Find below the most recent Samples.</p>
      </Box>
      <Table
        rows={currentPage.items}
        page={pageIndex}
        setPage={handleSetPage}
        rowsPerPage={pageLimit}
        setRowsPerPage={handleSetRowsPerPage}
        count={currentPage.total_item_count}
      />
      <Button>Click me</Button>
    </Box>
  )
}
