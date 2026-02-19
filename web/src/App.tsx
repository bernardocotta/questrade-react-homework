import {
  Box,
  Button,
  Fab,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function App() {
  const [open, setOpen] = React.useState(false);
  const [lotteryName, setLotteryName] = React.useState("");
  const [lotteryPrize, setLotteryPrize] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add a new lottery
            </Typography>
            <TextField
              label="Lottery name"
              value={lotteryName}
              onChange={(e) => setLotteryName(e.target.value)}
              variant="standard"
              fullWidth
            />
            <TextField
              label="Lottery prize"
              value={lotteryPrize}
              onChange={(e) => setLotteryPrize(e.target.value)}
              variant="standard"
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "flex-start", pt: 1 }}>
              <Button variant="contained" color="primary" disabled={true}>
                Add
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Fab
        variant="extended"
        color="primary"
        onClick={handleOpen}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Lottery
      </Fab>
    </>
  );
}

export default App;
