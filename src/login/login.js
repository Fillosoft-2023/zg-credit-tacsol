import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom'
import Api from '../api/api';
import { Box, Grid, LinearProgress, Toolbar, Paper, FormControl, OutlinedInput, InputAdornment, IconButton, InputLabel } from '@material-ui/core';
import manual from '../assets/manual.png'
import app_icon from '../assets/d_app.png'
import Icon from '../assets/icon.png'
import Icon2 from '../assets/icon2.png'
import Tacsol from '../assets/tacsol.png'


import { Alert } from '@material-ui/lab';
import LoaderComponent from '../consts/loader';
import { Visibility, VisibilityOff } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  Container: {
    backgroundColor: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e4e4e4',
    padding: 0,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
    width: 350,
    borderRadius: 5

  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false)
  const [branchCode, setBranchCode] = useState()
  const [employeeView, setEmployeeView] = useState(false)
  const [emCode, setEmpCode] = useState('')
  const [emPass, setEmPass] = useState()
  const check = (event) => {
    event.preventDefault();
    const formData = new FormData
    formData.append('pass_post', pass)
    formData.append('branc_code', branchCode)
    setLoading(true)
    fetch(Api + 'login', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        if (res.code === 200) {
          setEmployeeView(true)
          localStorage.setItem('authState', true)
          localStorage.setItem('branch_code', branchCode)
          // history.push('./Home')
        } else {
          setErr(true)
        }
      })
      .catch(err => {
        setLoading(false)
        alert('Unable to connect to the server')
      })


  }
  const check_em = (event) => {
    event.preventDefault();
    const formData = new FormData
    formData.append('em_pass', emPass)
    formData.append('em_id', emCode)
    setLoading(true)
    fetch(Api + 'login_next', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(res => {

        if (res.code === 200) {
          //setEmployeeView(true)
          localStorage.setItem('authState', true)
          localStorage.setItem('em_code', emCode)
          localStorage.setItem('user_role', res.role)
          history.push('./Home')

        } else {
          setErr(true)
        }
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        alert('Unable to connect to the server')
      })


  }
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Container maxWidth="false" style={{ padding: 0, backgroundColor: '#F0EFF0', minHeight: '100vh' }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 150 }}>
          <div >
            <div style={{ padding: 5, paddingTop: 30, paddingBottom: 45, display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 120, borderRadius: 10, boxShadow: '0 6px 12px 0 rgba(0, 0, 0, 0.3)' }} >
              <img src={Icon2} width={100} height={100} style={{ marginRight: 5 }} />
              <h2 style={{ textAlign: 'center', margin: 0, color: '#3F51B5', marginBottom: 10, fontFamily: '-moz-initial' }}>
                EAST INDIA <br /> MULTI-PURPOSE <br /> CO-OPERATIVE SOCIETY LTD
              </h2>
              {/* <Typography component="h1" variant="h6">
                {employeeView ? "Enter Employee Password" : 'Enter Login Password'}
              </Typography> */}
              {
                employeeView ? (
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="em_id"
                      label="Employee ID"
                      type="number"
                      id="brem_idanch"
                      error={err}
                      value={emCode}
                      onChange={({ target: { value } }) => setEmpCode(value)}
                      autoComplete="employee-id"
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Enter Employee Password</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Enter Employee Password"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        error={err}
                        value={emPass}
                        onChange={({ target: { value } }) => setEmPass(value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton

                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff style={{ color: '#3F51B5' }} /> : <Visibility style={{ color: '#3F51B5' }} />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={check_em}
                    >
                      login
                    </Button>

                  </form>
                ) : (
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="branch"
                      label="Branch Code"
                      type="number"
                      id="branch"
                      error={err}
                      value={branchCode}
                      onChange={({ target: { value } }) => setBranchCode(value)}
                      autoComplete="current-password"
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Enter Branch Password</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Enter Branch Password" variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        error={err}
                        value={pass}
                        onChange={({ target: { value } }) => setPass(value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff style={{ color: '#3F51B5' }} /> : <Visibility style={{ color: '#3F51B5' }} />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={check}
                      >
                        submit
                      </Button>
                  </form>
                )
              }
            </div>
            {
              loading ? <LoaderComponent /> : ''
            }
          </div>
        </Grid>
      </Grid>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 0 }}>
        <div style={{ display: 'flex' }}>
          <a href='https://tacsol.in/'>
          <img src={Tacsol} width={150} height={30} style={{ marginRight: 5 }}/>
          </a>
        </div>
        <Typography style={{ fontSize: 15, fontFamily: 'sans-serif',textAlign:'center' }}>
          Copyright© 2025 Tacsol <br/>Privacy Policy
        </Typography>
      </div>

    </Container>
  );
}