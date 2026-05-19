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
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { Checkbox, CircularProgress } from '@material-ui/core';
import TransDates from '../../consts/transDates';

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

export default function SavingsTrans(props) {
  const history = useHistory();
  const [mssg, setMssg] = useState(false)
  const [open, setOpen] = React.useState(false);
  const style = useStyle();
  const [sendData, setSendData] = useState({});
  const [err, setErr] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [DataCollect, setDataCollect] = useState([])
  const [massg, setMassg] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [checked, setChecked] = useState(false)

  const collectInfo = {
    reffer_id: props.callback.reffer_id,
    press: 'savBalenc',

  }
  const handleClickOpen = () => {
    setOpen(true);
    setSendData({
      date: '',
      type: '',
      amount: '',
      collected_by: ''

    })
    setMssg(false)

    fetch(Api + 'savBalenc&reffer_id=' + props.callback.reffer_id)
      .then(res => res.json())
      .then(res => setDataCollect(res))
      .catch(err => {
        setMssg({
          massg: 'Faild to connect to the server',
          open: true,
          severity: 'error'
        })
      })
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setDisabled(false)
    setSendData({
      ...sendData,
      [name]: value,
      reffer_id: props.callback.reffer_id,
      agent_id: props.callback.agent_id
    })
  };


  const validate = () => {
    let isValid = true;
    let error = {}
    let balence = 0;
    {
      DataCollect.map((item) => {

        balence = Number(item.dep) + Number(item.ints) - Number(item.withs)
      })
    }
    if (!sendData.date) {
      isValid = false;
      error['date'] = true;
    }
    if (!sendData.type) {
      isValid = false;
      error['type'] = true
    }
    if (!sendData.collected_by) {
      isValid = false;
      error['collected_by'] = true
    }
    if (!sendData.amount) {
      isValid = false;
      error['amount'] = true;
    }
    if (sendData.type === 'with') {
      if (sendData.amount > balence) {
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
      fetch(Api + 'savingsTrans', {
        method: 'POST',
        body: JSON.stringify({...sendData,c_nmbr:props.callback.c_nmbr,checked:checked})
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
  }



  return (
    <div>
      <IconButton edge="end" aria-label="transaction" onClick={handleClickOpen}>
        <SubtitlesIcon />
      </IconButton>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Savings Account Transaction
        </DialogTitle>


        <DialogContent dividers>
          <div className={style.balence}>

            {
              DataCollect.map((item) => {

                return (
                  <Typography color="red" style={{ marginBottom: '20px', fontWeight: 'bold' }}>Account Balance : Rs. {Number(item.dep) + Number(item.ints) - Number(item.withs)}</Typography>
                )
              })
            }

          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                label="Registration Number"
                InputLabelProps={{ shrink: true }}
                disabled
                value={props.callback.acno}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                label="Savings A/C No"
                InputLabelProps={{ shrink: true }}
                disabled
                value={props.callback.sav_no}
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
                  label="Select transaction type"

                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'dep'}>Deposit</MenuItem>
                  <MenuItem value={'with'}>Withdrawal</MenuItem>

                  <MenuItem value={'intr'}>Interest Deposit</MenuItem>
                  <MenuItem value={'fine'}>Fine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={style.input} >
                <InputLabel id="demo-simple-select-outlined-label">Collected By</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="collected_by"
                  value={sendData.collected_by}
                  onChange={handleChange}
                  error={err.collected_by}
                  label="Select Collected By"

                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Office'}>Office</MenuItem>
                  <MenuItem value={'Agent'}>Agent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"

                className={style.input}
                label="Amount"
                name="amount"
                error={err.amount}
                value={sendData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                label="Remarks"
                InputLabelProps={{ shrink: true }}
                className={style.input}
                name="remarks"
                error={err.remarks}
                value={sendData.remarks}
                onChange={handleChange}

              />
            </Grid>
          </Grid>
          <SnakBar massg={massg} setMassg={setMassg} />
        </DialogContent>

        <Typography style={{margin:'10px'}}>
        <Checkbox onChange={()=>setChecked(!checked)} checked={checked}/>

          Send Text Notification
        </Typography>
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