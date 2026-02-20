import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
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
import SearchIcon from '@mui/icons-material/Search';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SyncIcon from '@mui/icons-material/Sync';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { getLotteries, postLottery, postRegister } from './api';
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

const registerValidationSchema = yup.object({
  registerName: yup
    .string()
    .required('Required')
    .min(3, 'At least 3 characters'),
});

function App() {
  const [newLotteryModalOpen, setNewLotteryModalOpen] = React.useState(false);
  const [openNewLotteryNotification, setOpenNewLotteryNotification] =
    React.useState(false);
  const [lotteries, setLotteries] = React.useState<Lottery[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedLotteryIds, setSelectedLotteryIds] = React.useState<
    Set<string>
  >(new Set());
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [openRegisterNotification, setOpenRegisterNotification] =
    React.useState(false);
  const [registerNotificationMessage, setRegisterNotificationMessage] =
    React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLotteries = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return lotteries;
    return lotteries.filter((l) => l.name.toLowerCase().includes(q));
  }, [lotteries, searchQuery]);

  const loadLotteries = React.useCallback((): Promise<void> => {
    return getLotteries().then(({ data }) => {
      setLotteries(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadLotteries();
  }, [loadLotteries]);

  const lotteryFormik = useFormik({
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
      setNewLotteryModalOpen(false);
      setSubmitting(false);
      setOpenNewLotteryNotification(true);

      setLoading(true);
      await loadLotteries();
    },
  });

  const registerFormik = useFormik({
    initialValues: { registerName: '' },
    validationSchema: registerValidationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const name = values.registerName.trim();
      const ids = Array.from(selectedLotteryIds);
      await Promise.all(
        ids.map((lotteryId) => postRegister({ lotteryId, name })),
      );
      resetForm();
      setRegisterModalOpen(false);
      setSubmitting(false);
      const n = ids.length;
      setRegisterNotificationMessage(
        n === 1 ? 'Registered for 1 lottery' : `Registered for ${n} lotteries`,
      );
      setOpenRegisterNotification(true);
      setSelectedLotteryIds(new Set());
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

      {!loading && lotteries.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, pb: 2 }}>
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: '100%', maxWidth: 400 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

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
          <>
            {filteredLotteries.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}
              >
                {filteredLotteries.map((lottery) => {
              const isSelected = selectedLotteryIds.has(lottery.id);
              return (
                <Grid key={lottery.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    variant="outlined"
                    elevation={0}
                    onClick={() => {
                      setSelectedLotteryIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(lottery.id)) next.delete(lottery.id);
                        else next.add(lottery.id);
                        return next;
                      });
                    }}
                    sx={{
                      borderRadius: 2,
                      borderWidth: 2,
                      borderColor: isSelected ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                    }}
                  >
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
              );
            })}
              </Grid>
            ) : (
              <Stack alignItems="center" spacing={1}>
                <Typography color="text.secondary">
                  No search results for &apos;{searchQuery.trim()}&apos;
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Box>

      <Modal
        open={newLotteryModalOpen}
        onClose={() => setNewLotteryModalOpen(false)}
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
              value={lotteryFormik.values.lotteryName}
              onChange={lotteryFormik.handleChange}
              onBlur={lotteryFormik.handleBlur}
              error={Boolean(
                lotteryFormik.touched.lotteryName &&
                lotteryFormik.errors.lotteryName,
              )}
              helperText={
                lotteryFormik.touched.lotteryName &&
                lotteryFormik.errors.lotteryName
              }
              variant="standard"
              fullWidth
            />
            <TextField
              label="Lottery prize"
              name="lotteryPrize"
              value={lotteryFormik.values.lotteryPrize}
              onChange={lotteryFormik.handleChange}
              onBlur={lotteryFormik.handleBlur}
              error={Boolean(
                lotteryFormik.touched.lotteryPrize &&
                lotteryFormik.errors.lotteryPrize,
              )}
              helperText={
                lotteryFormik.touched.lotteryPrize &&
                lotteryFormik.errors.lotteryPrize
              }
              variant="standard"
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 1 }}>
              <LoadingButton
                variant="contained"
                color="primary"
                disabled={!lotteryFormik.isValid || !lotteryFormik.dirty}
                loading={lotteryFormik.isSubmitting}
                onClick={() => lotteryFormik.handleSubmit()}
              >
                Add
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="register-modal-title" variant="h6" component="h2">
              Register for a lottery
            </Typography>
            <TextField
              name="registerName"
              placeholder="Enter your name"
              value={registerFormik.values.registerName}
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              error={Boolean(
                registerFormik.touched.registerName &&
                registerFormik.errors.registerName,
              )}
              helperText={
                registerFormik.touched.registerName &&
                registerFormik.errors.registerName
              }
              variant="standard"
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 1 }}>
              <LoadingButton
                variant="contained"
                color="primary"
                disabled={!registerFormik.isValid}
                loading={registerFormik.isSubmitting}
                onClick={() => registerFormik.handleSubmit()}
              >
                REGISTER
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Fab
          variant="extended"
          color="default"
          disabled={selectedLotteryIds.size === 0}
          onClick={() => setRegisterModalOpen(true)}
        >
          Register
        </Fab>
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setNewLotteryModalOpen(true)}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Lottery
        </Fab>
      </Box>

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
      <Snackbar
        open={openRegisterNotification}
        autoHideDuration={6000}
        onClose={() => setOpenRegisterNotification(false)}
        message={registerNotificationMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenRegisterNotification(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default App;
