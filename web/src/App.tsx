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
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

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

const validationSchema = yup.object({
  lotteryName: yup.string().required("Required").min(4, "At least 4 characters"),
  lotteryPrize: yup.string().required("Required").min(4, "At least 4 characters"),
});

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formik = useFormik({
    initialValues: { lotteryName: "", lotteryPrize: "" },
    validationSchema,
    validateOnMount: true,
    onSubmit: (_values, { resetForm }) => {
      resetForm();
      handleClose();
    },
  });

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
              name="lotteryName"
              value={formik.values.lotteryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                Boolean(formik.touched.lotteryName && formik.errors.lotteryName)
              }
              helperText={
                formik.touched.lotteryName && formik.errors.lotteryName
              }
              variant="standard"
              fullWidth
            />
            <TextField
              label="Lottery prize"
              name="lotteryPrize"
              value={formik.values.lotteryPrize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                Boolean(
                  formik.touched.lotteryPrize && formik.errors.lotteryPrize
                )
              }
              helperText={
                formik.touched.lotteryPrize && formik.errors.lotteryPrize
              }
              variant="standard"
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "flex-start", pt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!formik.isValid || !formik.dirty}
                onClick={() => formik.handleSubmit()}
              >
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
