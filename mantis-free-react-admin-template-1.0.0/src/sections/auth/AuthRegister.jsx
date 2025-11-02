import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { registerUser, getRoles } from 'api/auth';

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          email: '',
          fullName: '',
          address: '',
          cnic: '',
          phoneNumber: '',
          gender: '',
          companyId: '',
          storeId: '',
          password: '',
          confirmPassword: '',
          role: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          fullName: Yup.string().max(255).required('Full Name is required'),
          address: Yup.string().max(500),
          cnic: Yup.string().matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in format 12345-1234567-1').required('CNIC is required'),
          phoneNumber: Yup.string().matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format').required('Phone Number is required'),
          gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender').required('Gender is required'),
          companyId: Yup.number().nullable(),
          storeId: Yup.number().nullable(),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be less than 20 characters'),
          confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
          role: Yup.string().required('Role is required')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            setLoading(true);
            setSubmitting(true);
            
            const userData = {
              Username: values.username,
              Email: values.email,
              FullName: values.fullName,
              Address: values.address,
              CNIC: values.cnic,
              PhoneNumber: values.phoneNumber,
              Gender: values.gender,
              CompanyId: values.companyId ? parseInt(values.companyId) : null,
              StoreId: values.storeId ? parseInt(values.storeId) : null,
              Password: values.password,
              ConfirmPassword: values.confirmPassword,
              Role: values.role
            };

            await registerUser(userData);
            alert('Registration successful! Please login with your credentials.');
            navigate('/login');
          } catch (error) {
            console.error('Registration error:', error);
            setErrors({ submit: error });
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="username-signup">Username*</InputLabel>
                  <OutlinedInput
                    id="username-signup"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="johndoe"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                </Stack>
                {touched.username && errors.username && (
                  <FormHelperText error id="helper-text-username-signup">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="fullname-signup">Full Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.fullName && errors.fullName)}
                    id="fullname-signup"
                    type="text"
                    value={values.fullName}
                    name="fullName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="John Doe"
                    inputProps={{}}
                  />
                </Stack>
                {touched.fullName && errors.fullName && (
                  <FormHelperText error id="helper-text-fullname-signup">
                    {errors.fullName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@company.com"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="address-signup">Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                    id="address-signup"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="123 Main Street, City"
                    inputProps={{}}
                  />
                </Stack>
                {touched.address && errors.address && (
                  <FormHelperText error id="helper-text-address-signup">
                    {errors.address}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="cnic-signup">CNIC*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.cnic && errors.cnic)}
                    id="cnic-signup"
                    type="text"
                    value={values.cnic}
                    name="cnic"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="12345-1234567-1"
                    inputProps={{}}
                  />
                </Stack>
                {touched.cnic && errors.cnic && (
                  <FormHelperText error id="helper-text-cnic-signup">
                    {errors.cnic}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="phone-signup">Phone Number*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    id="phone-signup"
                    type="text"
                    value={values.phoneNumber}
                    name="phoneNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    inputProps={{}}
                  />
                </Stack>
                {touched.phoneNumber && errors.phoneNumber && (
                  <FormHelperText error id="helper-text-phone-signup">
                    {errors.phoneNumber}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="gender-signup">Gender*</InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.gender && errors.gender)}
                    id="gender-signup"
                    value={values.gender}
                    name="gender"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Stack>
                {touched.gender && errors.gender && (
                  <FormHelperText error id="helper-text-gender-signup">
                    {errors.gender}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="role-signup">Role*</InputLabel>
                  <Select
                    fullWidth
                    error={Boolean(touched.role && errors.role)}
                    id="role-signup"
                    value={values.role}
                    name="role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                    disabled={rolesLoading}
                  >
                    <MenuItem value="" disabled>Select Role</MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id || role} value={role.name || role}>
                        {role.name || role}
                      </MenuItem>
                    ))}
                  </Select>
                  {rolesLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Stack>
                {touched.role && errors.role && (
                  <FormHelperText error id="helper-text-role-signup">
                    {errors.role}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="companyid-signup">Company ID</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.companyId && errors.companyId)}
                    id="companyid-signup"
                    type="number"
                    value={values.companyId}
                    name="companyId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="1"
                    inputProps={{}}
                  />
                </Stack>
                {touched.companyId && errors.companyId && (
                  <FormHelperText error id="helper-text-companyid-signup">
                    {errors.companyId}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="storeid-signup">Store ID</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.storeId && errors.storeId)}
                    id="storeid-signup"
                    type="number"
                    value={values.storeId}
                    name="storeId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="1"
                    inputProps={{}}
                  />
                </Stack>
                {touched.storeId && errors.storeId && (
                  <FormHelperText error id="helper-text-storeid-signup">
                    {errors.storeId}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-signup">Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                    placeholder="******"
                    inputProps={{}}
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="confirm-password-signup">Confirm Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password-signup"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    placeholder="******"
                    inputProps={{}}
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-confirm-password-signup">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button 
                    fullWidth 
                    size="large" 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Creating Account...
                      </Box>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
