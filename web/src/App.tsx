import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import CasinoIcon from '@mui/icons-material/Casino';
import CloseIcon from '@mui/icons-material/Close';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SyncIcon from '@mui/icons-material/Sync';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { getLotteries, postLottery } from './api';
import type { Lottery } from './api/types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const validationSchema = yup.object({
  lotteryName: yup
    .string()
    .required('Required')
    .min(4, 'At least 4 characters'),
  lotteryPrize: yup
    .string()
    .required('Required')
    .min(4, 'At least 4 characters'),
});

function App() {
  const [open, setOpen] = React.useState(false);
  const [openNewLotteryNotification, setOpenNewLotteryNotification] =
    React.useState(false);
  const [lotteries, setLotteries] = React.useState<Lottery[]>([]);
  const [loading, setLoading] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loadLotteries = React.useCallback((): Promise<void> => {
    return getLotteries().then(({ data }) => {
      setLotteries(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadLotteries();
  }, [loadLotteries]);

  const formik = useFormik({
    initialValues: { lotteryName: '', lotteryPrize: '' },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await postLottery({
        name: values.lotteryName,
        prize: values.lotteryPrize,
        type: 'simple',
      });
      resetForm();
      handleClose();
      setSubmitting(false);
      setOpenNewLotteryNotification(true);
      setLoading(true);
      await loadLotteries();
    },
  });

  return (
    <>
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
        >
          Loteries
          <CasinoIcon fontSize="large" />
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        {loading && <CircularProgress />}
        {!loading && lotteries.length === 0 && (
          <Stack alignItems="center" spacing={1}>
            <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />
            <Typography color="text.secondary">
              There are no lotteries currently
            </Typography>
          </Stack>
        )}
        {!loading && lotteries.length > 0 && (
          <Grid
            container
            spacing={2}
            sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}
          >
            {lotteries.map((lottery) => (
              <Grid key={lottery.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card elevation={1} sx={{ borderRadius: 2 }}>
                  <CardContent
                    sx={{ position: 'relative', pr: 5, pt: 2, pb: 2 }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      <SyncIcon fontSize="small" color="action" />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {lottery.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lottery.prize}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="code"
                      sx={{
                        fontFamily: 'monospace',
                        display: 'block',
                        mt: 0.5,
                      }}
                    >
                      {lottery.id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

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
              error={Boolean(
                formik.touched.lotteryName && formik.errors.lotteryName,
              )}
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
              error={Boolean(
                formik.touched.lotteryPrize && formik.errors.lotteryPrize,
              )}
              helperText={
                formik.touched.lotteryPrize && formik.errors.lotteryPrize
              }
              variant="standard"
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 1 }}>
              <LoadingButton
                variant="contained"
                color="primary"
                disabled={!formik.isValid || !formik.dirty}
                loading={formik.isSubmitting}
                onClick={() => formik.handleSubmit()}
              >
                Add
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Fab
        variant="extended"
        color="primary"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Lottery
      </Fab>

      <Snackbar
        open={openNewLotteryNotification}
        autoHideDuration={6000}
        onClose={() => setOpenNewLotteryNotification(false)}
        message="New lottery created"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenNewLotteryNotification(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default App;
