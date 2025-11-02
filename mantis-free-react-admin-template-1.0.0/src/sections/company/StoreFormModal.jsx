import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Stepper, Step, StepLabel, Box } from '@mui/material';
import { X } from 'lucide-react';
import StoreFormStep from './StoreFormStep';

const StoreFormModal = ({ open, activeStep, steps, formData, handleInputChange, handleClose, handleNext, handleBack, handleSubmit, companiesData, isStepValid }) => {
  console.log('StoreFormModal: Rendering, open:', open, 'activeStep:', activeStep);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          p: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Store
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <StoreFormStep
          activeStep={activeStep}
          formData={formData}
          handleInputChange={handleInputChange}
          companiesData={companiesData}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
          sx={{
            px: 3,
            py: 1,
            fontSize: '0.875rem',
            textTransform: 'none',
            borderColor: 'grey.300',
            color: 'grey.700',
            ':hover': { borderColor: 'grey.500', bgcolor: 'grey.50' },
          }}
        >
          Back
        </Button>
        <Button
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          variant="contained"
          disabled={!isStepValid(activeStep)}
          sx={{
            px: 3,
            py: 1,
            fontSize: '0.875rem',
            textTransform: 'none',
            bgcolor: 'primary.main',
            ':hover': { bgcolor: 'primary.dark' },
          }}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreFormModal;