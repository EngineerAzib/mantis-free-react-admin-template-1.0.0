import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  InputAdornment
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Message from 'components/Message';
import { ResetPasswordApi } from '../../api/auth'; // ✅ renamed API
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  debugger;
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutation for reset password
  const mutation = useMutation({
    mutationFn: ({ password }) => ResetPasswordApi(email,password, token),
    onSuccess: () => {
      setMessage({
        open: true,
        message: 'Password reset successfully! Redirecting to login...',
        severity: 'success'
      });
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      setMessage({
        open: true,
        message: error.message || 'Failed to reset password. Please try again.',
        severity: 'error'
      });
    }
  });

  const handleCloseMessage = () => {
    setMessage({ open: false, message: '', severity: 'success' });
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // If email or token is missing → invalid link
  if (!email || !token) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 2
        }}
      >
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Invalid reset password link
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Return to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: 2
      }}
    >
      <Message
        open={message.open}
        onClose={handleCloseMessage}
        message={message.message}
        severity={message.severity}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          Reset Password
        </Typography>

        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .required('Password is required')
              .test(
                'no-leading-trailing-whitespace',
                'Password cannot start or end with spaces',
                (value) => (value ? value.trim() === value : true)
              )
              .max(10, 'Password must be less than 10 characters'),
            confirmPassword: Yup.string()
              .required('Confirm password is required')
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await mutation.mutateAsync({ password: values.password });
              setStatus({ success: true });
              setSubmitting(false);
            } catch (err) {
              setErrors({ submit: err.message || 'Failed to reset password' });
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Password */}
                <Grid item xs={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-reset">New Password</InputLabel>
                    <OutlinedInput
                      id="password-reset"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="password-reset-error">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="confirm-password-reset"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      fullWidth
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Stack>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="confirm-password-reset-error">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Submit Errors */}
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error id="submit-error">
                      {errors.submit}
                    </FormHelperText>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting || mutation.isLoading}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Reset Password
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ResetPassword;
