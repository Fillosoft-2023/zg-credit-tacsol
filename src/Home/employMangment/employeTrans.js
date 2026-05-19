import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Api from '../../api/api'
import SnakBar from '../../consts/message';
import { CircularProgress } from '@material-ui/core';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = (theme) => ({
  root: {
    margin: 0,

  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,

  },
}))(MuiDialogActions);



export default function EmployeeTrans(props) {
  const history = useHistory();
  const [mssg, setMssg] = useState(false)
  const [open, setOpen] = React.useState(false);
  const style = useStyle();
  const [sendData, setSendData] = useState({});
  const [err, setErr] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = React.useState(false)
  const [massg, setMassg] = React.useState({})

  const handleClickOpen = () => {
    setOpen(true);
    setSendData({
      date: '',
      type: '',
      amount: '',
      remarks: '',
    })
    setMssg(false)
    viewBalance()
    console.log(props.callback.id)


  };
  const handleClose = () => {
    setOpen(false);
  };
  const [data, setData] = React.useState([])


  const viewBalance = () => {
    fetch(Api + 'employeCommisionWith', {
      method: 'POST',
      body: JSON.stringify({ id: props.callback.id })
    })
      .then(res => res.json())
      .then(res => {
        setData(res[0]);
        // console.log(res);
      })
      .catch(err => console.log(err));
  }



  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setDisabled(false)
    setSendData({
      ...sendData,
      [name]: value,
      reffer_id: props.callback.id,
    })
  };


  const validate = () => {
    let isValid = true;
    let error = {}
    if (!sendData.date) {
      isValid = false;
      error['date'] = true;
    }
    if (!sendData.type) {
      isValid = false;
      error['type'] = true
    }
    if (!sendData.amount) {
      isValid = false;
      error['amount'] = true;
    }
    if (sendData.type === 'agent comission') {
      if (sendData.amount > data.total_deposit) {
        isValid = false;
        error['amount'] = true;
      }
    }



    setErr(error)

    return isValid;
  }



  const handleSubmit = () => {
    setDisabled(true)
    if (validate()) {
      setLoading(true)
      fetch(Api + 'employeTrans', {
        method: 'POST',
        body: JSON.stringify(sendData)
      })
        .then(res => res.json())
        .then(res => {
          setLoading(false)
          if (res.code === 200) {
            setTimeout(() => { setOpen(false) }, 1000)
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
    } else {
      setMassg({
        open: true,
        severity: 'error',
        massg: 'Please fill all required filled'
      })
    }
  }



  return (
    <div>
      <IconButton edge="end" aria-label="transaction" onClick={handleClickOpen}>
        <SubtitlesIcon />
      </IconButton>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        Employee Transaction
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ marginBottom: 10 }}>
            <Typography style={{ marginBottom: 10 }}>
              Commission Balance: Rs.{Number(data.total_deposit).toFixed(2)}
            </Typography>

          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                label="Account number"
                InputLabelProps={{ shrink: true }}
                disabled
                value={props.callback.acno}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                label="Date"
                InputLabelProps={{ shrink: true }}
                type="date"
                className={style.input}
                name="date"
                error={err.date}
                value={sendData.date}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={style.input} >
                <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="type"
                  value={sendData.type}
                  onChange={handleChange}
                  error={err.type}
                  label="Select Transaction Type"

                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'salary'}>Salary</MenuItem>
                  <MenuItem value={'agent comission'}>Agent comission</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"

                className={style.input}
                label="Amount"
                InputLabelProps={{ shrink: true }}
                name="amount"
                error={err.amount}
                value={sendData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                className={style.input}
                label="Remarks"
                InputLabelProps={{ shrink: true }}
                name="remarks"
                value={sendData.remarks}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <SnakBar massg={massg} setMassg={setMassg} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit} disabled={disabled} color="primary" variant="outlined">
            Save
            {
              loading ? <CircularProgress size={25} /> : ''
            }
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
}

const useStyle = makeStyles((theme) => ({
  input: {
    width: '100%',
  }
}))