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
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import MuiAlert from '@material-ui/lab/Alert';
import SnakBar from '../../consts/message'
import Api from '../../api/api';
import { Checkbox, CircularProgress, MenuItem } from '@material-ui/core';
import { CheckBox } from '@material-ui/icons';

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

export default function LoanTrans(props) {
  const history = useHistory();
  const [mssg, setMssg] = useState(false)
  const [open, setOpen] = React.useState(false);
  const style = useStyle();
  const [sendData, setSendData] = useState({
    principle: props.callback.emi_princ,
    interest: props.callback.emi_intr
  });
  const [err, setErr] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [DataCollect, setDataCollect] = useState([])
  const [loading, setLoading] = React.useState(false)
  const [massg, setMassg] = React.useState({})
  const [checked, setChecked] = useState(false)
  const [isPreClosed, setIsPreClosed] = useState(false);



  const collectInfo = {
    reffer_id: props.callback.reffer_id,
    press: 'loanBalenc',


  }

  const handleClickOpen = () => {

    if (props.callback.ln_stts === 'completed') {
      setOpen(false)
      alert('Loan Completed')
    }
    else {
      setOpen(true);
    }

    setSendData({
      date: '',
      principle: props.callback.emi_princ,
      interest: props.callback.emi_intr,
      fine: '',
      remarks: '',
      pay_type: 'Cash'
    })
    setMssg(false)

    fetch(Api + 'collectInfo&reffer_id=' + props.callback.reffer_id)
      .then(
        res => res.json())
      .then(
        res => setDataCollect(res)
      )
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
      agent_id: props.callback.agnt_id,
      acno: props.callback.acno,
      emi_amnt: props.callback.emi_amnt,
      "press": "loanTrans",


    })
  };
  const onChange = (amount, item) => {


    if (item === 'emi_amount') {
      let loan_amount = Number(props.callback.ln_amnt);
      let interest_rate = Number(props.callback.intrst);
      if (interest_rate > 10) {
        alert("Found abnormal interest rate, auto calculation could't work for this account ")

      } else {

        let interest_amount = Number(props.callback.intrst_amnt);
        let total_recoverable = loan_amount + interest_amount;
        let emi_amnt = total_recoverable / props.callback.no_emi;
        let paid_amt_int = ((interest_amount / props.callback.no_emi) / emi_amnt) * amount;
        let paid_amt_princ = amount - paid_amt_int;
        setSendData({
          ...sendData,
          principle: paid_amt_princ.toFixed(2).toString(),
          interest: paid_amt_int.toFixed(2).toString()
        })
      }
    } else {
      setSendData({
        ...sendData,
        [item]: amount
      })
    }

  }


  const validate = () => {
    let isValid = true;
    let error = {}


    if (!sendData.date) {
      isValid = false;
      error['date'] = true;
    }
    if (!sendData.principle && !sendData.fine) {

      isValid = false;
      error['principle'] = true;
      error['fine'] = true;


    }
    if (!sendData.interest && !sendData.fine) {
      isValid = false;
      error['interest'] = true;
      error['fine'] = true;


    }
    console.log(Number(DataCollect[0].ln_amnt).toFixed(2))
    if (Number((Number(DataCollect[0].tot_prncpl) + Number(sendData.principle)).toFixed(2)) > Number(Number(DataCollect[0].ln_amnt).toFixed(2)) + 0.9) {
      isValid = false;
      setMassg({
        open: true,
        severity: 'error',
        massg: 'Principle amount is greater than actual principle'
      })
    }

    if (Number(((DataCollect[0].tot_int) + Number(sendData.interest)).toFixed(2)) > Number(Number(DataCollect[0].intrst_amnt).toFixed(2)) + 0.9) {
      isValid = false;
      setMassg({
        open: true,
        severity: 'error',
        massg: 'Interest amount is greater than actual Interest'
      })
    }




    setErr(error)

    return isValid;
  }



  const handleSubmit = () => {
    setDisabled(true)
    if (validate()) {

      setLoading(true)
      fetch(Api + 'loanTrans', {
        method: 'POST',
        body: JSON.stringify({ ...sendData, c_nmbr: props.callback.c_nmbr, checked: checked, isPreClosed: isPreClosed })
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
            setTimeout(() => {
              setOpen(false)
            }, 2000)
          } else {
            setMassg({
              open: true,
              severity: 'error',
              massg: res.massg
            })
          }
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
          setMassg({
            open: true,
            severity: 'error',
            massg: 'Faild to connect to the server'
          })
        })
    }
  }

  let sum = 0

  return (
    <div>
      <IconButton edge="end" aria-label="transaction" onClick={handleClickOpen}>
        <SubtitlesIcon />
      </IconButton>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} >
          Transaction
        </DialogTitle>



        <DialogContent dividers>
          <div className={style.balence}>
            {
              DataCollect.map((item) => {
                return (
                  <Typography style={{ color: 'green', marginBottom: 10 }} >Balance: Rs.{Number(item.totl_amnt) - Number(item.total)}</Typography>
                )
              })
            }

          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Reg No."
                disabled
                value={props.callback.acno}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Loan id"
                disabled
                value={props.callback.id}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="EMI amount"
                name="emi_amnt"
                disabled
                onChange={(e) => onChange(e.target.value, 'emi_amount')}
                value={props.callback.emi_amnt}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Change EMI amount"
                name="ttl"
                onChange={(e) => onChange(e.target.value, 'emi_amount')}
                value={sendData.ttl}
                className={style.input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Recieved Date"
                type="date"
                className={style.input}
                name="date"
                error={err.date}
                value={sendData.date}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Recieved Principle"
                className={style.input}
                name="principle"
                error={err.principle}
                value={sendData.principle}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                label="Recieved Interest"
                className={style.input}
                name="interest"
                error={err.interest}
                value={sendData.interest}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                className={style.input}
                label="Recieved Fine"
                name="fine"
                error={err.fine}
                value={sendData.fine}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                className={style.input}
                label="Remarks"
                name="remarks"
                value={sendData.remarks}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                className={style.input}
                label="Payment Mode"
                name="pay_type"
                select
                value={sendData.pay_type}
                onChange={handleChange}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <SnakBar massg={massg} setMassg={setMassg} />
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: 10 }}>

          <Typography style={{ margin: '10px' }}>
            <Checkbox onChange={() => setIsPreClosed(!isPreClosed)} checked={isPreClosed} />
            Pre-Close Account
          </Typography>
          <Typography style={{ margin: '10px' }}>
            <Checkbox onChange={() => setChecked(!checked)} checked={checked} />

            Send Text Notification
          </Typography>
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit} disabled={disabled} size='small' color="primary" variant="outlined">
            Save
            {loading ? <CircularProgress size={30} /> : ''}
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