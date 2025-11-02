import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import GenericFormModal from '../company/GenericFormModal';
import Message from '../../components/Message';
//import { ForgotPassword } from '../../api/auth/ForgotPassword'; // Adjust path as needed
import { ForgotPassword } from '../../api/auth'; // Adjust path as needed
const ForgotPasswordModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({ email: '' });
  const [message, setMessage] = useState({ open: false, message: '', severity: 'success' });

  const mutation = useMutation({
    mutationFn: () => ForgotPassword(formData.email),
    onSuccess: () => {
      setMessage({ open: true, message: 'Password reset email sent successfully!', severity: 'success' });
      handleClose();
      setFormData({ email: '' });
    },
    onError: () => {
      setMessage({ open: true, message: 'Failed to send password reset email. Please try again.', severity: 'error' });
    },
  });

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCloseMessage = () => {
    setMessage({ open: false, message: '', severity: 'success' });
  };

  return (
    <>
      <Message open={message.open} onClose={handleCloseMessage} message={message.message} severity={message.severity} />
      <GenericFormModal
        open={open}
        handleClose={handleClose}
        handleSubmit={() => mutation.mutate()}
        isStepValid={() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)} // Basic email validation
        title="Forgot Password"
        isMultiStep={false}
        isLoading={mutation.isLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email Address"
            value={formData.email}
            onChange={handleInputChange('email')}
            fullWidth
            required
            type="email"
            error={!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
            helperText={
              !formData.email
                ? 'Email is required'
                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                ? 'Please enter a valid email'
                : ''
            }
            sx={{ mt: 1 }}
          />
        </Box>
      </GenericFormModal>
    </>
  );
};

export default ForgotPasswordModal;
