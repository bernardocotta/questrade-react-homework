import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function App() {
  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Lottery
      </Fab>
    </>
  );
}

export default App;
