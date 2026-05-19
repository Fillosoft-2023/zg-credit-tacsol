import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Typography,
  Divider,
  IconButton,
  Toolbar,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions

} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
import { Close } from '@material-ui/icons';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function ShareModify(props) {
  const history = useHistory()
  const classes = useStyle();
  const [data, setData] = React.useState(props.location.state.data)
  const [disabled, setDisabled] = useState(true)
  const [massg, setMassg] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleModalSubmit = () => {
    if (password.trim() !== '') {
      fetch(Api + 'master_pass', {
        method: 'POST',
        body: JSON.stringify({
          pass: password
        })
      })
        .then(res => res.json())
        .then(res => {
          setLoading(false);
          if (res.code === 200) {
            setOpenModal(false);
          } else {
            setMassg({
              open: true,
              severity: 'error',
              massg: res.status
            });
          }
        })
        .catch(err => {
          setLoading(false);
          setMassg({
            open: true,
            severity: 'error',
            massg: 'Failed to connect to the server'
          });
        });
    } else {
      setMassg({
        open: true,
        severity: 'error',
        massg: 'You need to enter a password'
      });
    }
  };



  const handleSubmit = () => {
    setLoading(true)
    fetch(Api + 'share_info_edit', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        if (res.code === 200) {
          setMassg({
            open: true,
            severity: 'success',
            massg: res.massg
          })
        } else {
          setMassg({
            open: true,
            severity: 'error',
            massg: res.massg
          })
        }
      })
      .catch(err => {
        setLoading(false)
        setMassg({
          open: true,
          severity: 'error',
          massg: 'Faild to connect to the server'
        })
      })



  }


  const handleChange = (event) => {
    setDisabled(false)
    let name = event.target.name
    let value = event.target.value
    setData({
      ...data,
      [name]: value,
      "press": "share_info_edit",
      "id": data.id

    })


  }









  return (
    <Container style={{ padding: 0 }} >
      <Toolbar component={Paper}>
        <IconButton onClick={() => history.push('/Home/Share_reg/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography style={{ fontWeight: 'bold' }}>Edit profile Information</Typography>
      </Toolbar>
      <Paper style={{ padding: 15 }}>
        <Grid container spacing={2}  >
          <Grid item xs={12} sm={4}>
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Reg No"
              variant="outlined"
              fullWidth
              name="acno"
              value={data.acno}
              disabled
            />
          </Grid>


          <Grid item xs={12} sm={4}>
            <TextField
              InputLabelProps={{ shrink: true }}
              Label="Opening Date"
              variant="outlined"
              fullWidth
              name="opn_dt"
              type="date"
              value={data.opn_dt}
              onChange={handleChange}

            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Processing Charge"
              variant="outlined"
              fullWidth
              name="adm_fee"
              type="number"
              value={data.adm_fee}
              onChange={handleChange}
            />
          </Grid>
          {/*<Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Insurencce Fees"
                        variant="outlined"
                        fullWidth
                        name="insurence"
                        type="number"
                        error={err.insurence}
                        value={data.insurence}
                        onChange={handleChange}
                       
                    />
                    </Grid>*/}

          <Grid item xs={12} sm={4}>

            <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
              Save Changes
              {
                loading ? <CircularProgress massg={massg} setMassg={setMassg} /> : ''
              }
            </Button>

          </Grid>
        </Grid>
      </Paper>
      <SnakBar massg={massg} setMassg={setMassg} />

      <Dialog open={openModal} style={{ padding: 50, border: '2px solid #303F9F' }}>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Enter Master Password</DialogTitle>
          <Button onClick={() => history.push('/Home/Share_reg/')}>
            <Close />
          </Button>
        </div>
        <DialogContent>
          <TextField
            autoFocus
            variant='outlined'
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalSubmit} variant='contained' fullWidth size='small' color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}


const useStyle = makeStyles((theme) => ({
  container: {
    // backgroundColor: '#fff',
    overflowX: 'auto',
    padding: 15,
    //  boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
    height: '97%',
    '&::-webkit-scrollbar': {
      width: '0.4em',

      backgroundColor: 'rgba(0,0,0,0,0)'
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',

      borderRadius: 4,

    },
  }, formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))