import { Box, Modal, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { postRegister } from '../api';

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
  registerName: yup
    .string()
    .required('Required')
    .min(3, 'At least 3 characters'),
});

export interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  selectedLotteryIds: string[];
  onSuccess: (message: string) => void;
}

export function RegisterModal({
  open,
  onClose,
  selectedLotteryIds,
  onSuccess,
}: RegisterModalProps) {
  const formik = useFormik({
    initialValues: { registerName: '' },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const name = values.registerName.trim();
      const ids = selectedLotteryIds;
      await Promise.all(
        ids.map((lotteryId) => postRegister({ lotteryId, name })),
      );
      resetForm();
      onClose();
      setSubmitting(false);
      const n = ids.length;
      onSuccess(
        n === 1 ? 'Registered for 1 lottery' : `Registered for ${n} lotteries`,
      );
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            value={formik.values.registerName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.registerName && formik.errors.registerName,
            )}
            helperText={
              formik.touched.registerName && formik.errors.registerName
            }
            variant="standard"
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 1 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              disabled={!formik.isValid}
              loading={formik.isSubmitting}
              onClick={() => formik.handleSubmit()}
            >
              REGISTER
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
