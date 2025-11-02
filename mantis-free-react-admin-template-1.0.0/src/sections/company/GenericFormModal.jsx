import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Stepper, Step, StepLabel, Box, Fade } from '@mui/material';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const GenericFormModal = ({ 
  open, 
  activeStep, 
  steps, 
  formData, 
  handleInputChange, 
  handleClose, 
  handleNext, 
  handleBack, 
  handleSubmit, 
  isStepValid, 
  children, 
  title, 
  isMultiStep = false,
  isLoading = false
}) => {
  console.log('GenericFormModal: Rendering, open:', open, 'activeStep:', activeStep, 'children:', !!children);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={{ enter: 300, exit: 200 }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'grey.100',
          bgcolor: 'grey.25',
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: 'grey.900',
              fontSize: '1.125rem',
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
          {isMultiStep && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'grey.600',
                mt: 0.5,
                fontSize: '0.875rem',
              }}
            >
              Step {activeStep + 1} of {steps.length}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: 'grey.500',
            transition: 'all 0.2s ease',
            '&:hover': { 
              color: 'grey.700',
              bgcolor: 'grey.100',
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {isMultiStep && (
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={false}
              sx={{ 
                '& .MuiStepConnector-root': {
                  top: 10,
                  left: 'calc(-50% + 16px)',
                  right: 'calc(50% + 16px)',
                  '& .MuiStepConnector-line': {
                    borderTopWidth: 1,
                    borderColor: 'grey.300',
                  },
                },
                '& .MuiStepConnector-active .MuiStepConnector-line': {
                  borderColor: 'primary.main',
                },
                '& .MuiStepConnector-completed .MuiStepConnector-line': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: '2px solid',
                          transition: 'all 0.2s ease',
                          ...(completed ? {
                            bgcolor: 'primary.main',
                            borderColor: 'primary.main',
                            color: 'white',
                          } : active ? {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            bgcolor: 'primary.50',
                          } : {
                            borderColor: 'grey.300',
                            color: 'grey.500',
                            bgcolor: 'white',
                          }),
                        }}
                      >
                        {completed ? <Check size={12} /> : index + 1}
                      </Box>
                    )}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 500, 
                        mt: 1,
                        display: 'block',
                        color: activeStep >= index ? 'grey.900' : 'grey.500',
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
        
        <Box sx={{ px: 3, pb: 1 }}>
          {children ? (
            <Box sx={{ py: 2 }}>
              {children}
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6,
              textAlign: 'center',
            }}>
              <Typography 
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                No content available
              </Typography>
              <Typography 
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, opacity: 0.7 }}
              >
                Please provide form fields for this step
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3,
          py: 2.5,
          gap: 1.5,
          borderTop: '1px solid',
          borderColor: 'grey.100',
          bgcolor: 'grey.25',
        }}
      >
        {isMultiStep && activeStep > 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            startIcon={<ChevronLeft size={16} />}
            sx={{
              px: 2.5,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              borderColor: 'grey.300',
              color: 'grey.700',
              '&:hover': { 
                borderColor: 'grey.400', 
                bgcolor: 'grey.50',
              },
            }}
          >
            Back
          </Button>
        )}
        
        <Box sx={{ flex: 1 }} />
        
        <Button
          onClick={isMultiStep && activeStep < steps.length - 1 ? handleNext : handleSubmit}
          variant="contained"
          disabled={!isStepValid(isMultiStep ? activeStep : 0) || isLoading}
          endIcon={
            isMultiStep && activeStep < steps.length - 1 ? (
              <ChevronRight size={16} />
            ) : null
          }
          sx={{
            px: 3,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.24)',
            },
            '&:disabled': { 
              bgcolor: 'grey.200',
              color: 'grey.500',
            },
          }}
        >
          {isLoading ? 'Submitting...' : (isMultiStep && activeStep < steps.length - 1 ? 'Continue' : 'Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericFormModal;