import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, IconButton, Button, Typography } from '@mui/material';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import CompanyFormStep from './CompanyFormStep';

const CompanyFormModal = ({
  open,
  activeStep,
  steps,
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleClose,
  handleNext,
  handleBack,
  handleSubmit,
  isStepValid,
}) => {
  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: 640,
          maxHeight: '85vh',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: { xs: '16px', sm: '18px' }, fontWeight: 600, color: '#1f2937' }}>
          Add New Company
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            p: 0.75,
            ':hover': { backgroundColor: '#f3f4f6' },
            transition: 'background-color 0.2s',
          }}
        >
          <X style={{ width: 20, height: 20, color: '#6b7280' }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ p: { xs: 2, sm: 2.5 }, backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}>
          {steps.map((step, index) => (
            <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: index <= activeStep ? '#2563eb' : '#d1d5db',
                  color: index <= activeStep ? '#fff' : '#4b5563',
                }}
              >
                {index + 1}
              </Box>
              <Typography
                sx={{
                  ml: 0.75,
                  fontSize: { xs: '12px', sm: '13px' },
                  fontWeight: 500,
                  color: index <= activeStep ? '#2563eb' : '#6b7280',
                  whiteSpace: 'nowrap',
                }}
              >
                {step}
              </Typography>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: { xs: 16, sm: 24 },
                    height: '2px',
                    mx: 0.75,
                    backgroundColor: index < activeStep ? '#2563eb' : '#d1d5db',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, overflowY: 'auto' }}>
        <CompanyFormStep
          step={activeStep}
          formData={formData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      </DialogContent>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: { xs: 2, sm: 2.5 }, borderTop: '1px solid #e5e7eb', gap: 1.5, flexWrap: 'wrap' }}>
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            startIcon={<ChevronLeft style={{ width: 16, height: 16 }} />}
            sx={{
              px: 2,
              py: 1,
              fontSize: '14px',
              fontWeight: 500,
              color: '#4b5563',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              borderRadius: '6px',
              textTransform: 'none',
              ':hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
            endIcon={<ChevronRight style={{ width: 16, height: 16 }} />}
            sx={{
              px: 2,
              py: 1,
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '6px',
              textTransform: 'none',
              opacity: !isStepValid(activeStep) ? 0.6 : 1,
              pointerEvents: !isStepValid(activeStep) ? 'none' : 'auto',
              ':hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid(activeStep)}
            sx={{
              px: 2,
              py: 1,
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: '#10b981',
              color: '#fff',
              borderRadius: '6px',
              textTransform: 'none',
              flex: { xs: '1', sm: '0 1 auto' },
              maxWidth: '200px',
              ':hover': { backgroundColor: '#059669' },
              opacity: !isStepValid(activeStep) ? 0.6 : 1,
              pointerEvents: !isStepValid(activeStep) ? 'none' : 'auto',
            }}
          >
            Save Company
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default CompanyFormModal;