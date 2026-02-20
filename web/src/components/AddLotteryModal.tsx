import { Box, Modal, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { postLottery } from '../api';

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

export interface AddLotteryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLotteryModal({
  open,
  onClose,
  onSuccess,
}: AddLotteryModalProps) {
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
      onClose();
      setSubmitting(false);
      onSuccess();
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            helperText={formik.touched.lotteryName && formik.errors.lotteryName}
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
  );
}
