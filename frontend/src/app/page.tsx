import { Box } from "@mui/material"
import Button from "./components/Button"
import Table from "./components/Table"
import { MOCK_SAMPLES } from "./mocks/samples"

export default function Home() {

  return (
    <Box className="flex flex-col gap-5">
      <Box>
        <p>Welcome to BioStack, a FastAPI/NextJS exercise</p>
        <p>Find below the most recent Samples.</p>
      </Box>
      <Table rows={MOCK_SAMPLES}></Table>
      <Button>Click me</Button>
    </Box>
  )
}
