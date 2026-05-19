
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { CircularProgress, LinearProgress } from '@material-ui/core';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChangeAgentCommission(props) {
  const [open, setOpen] = React.useState(false);
  const [ac_no, setAcNo] = React.useState({})
  const [massg, setMassg] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const history = useHistory();
  const [err, setErr] = React.useState({})

  const [com_percent, setPercent] = React.useState(JSON.parse(props.callback.com_percent))

  const handleClickOpen = (value) => {
    setOpen(true);
    setAcNo({
      "id": props.callback.id,
      "press": "disable_employee",
      "com_percent": com_percent
    })
  };
  const validate = () => {
    let valid = true
    let err = {}

    if (!com_percent.loan.percent) {
      valid = false
      err['loan'] = true
    }
    if (!com_percent.rd.percent) {
      valid = false
      err['rd'] = true
    }
    if (!com_percent.savings.percent) {
      valid = false
      err['savings'] = true
    }
    setErr(err)
    return valid
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangePercent = (e) => {
    let name = e.target.name;
   
    setPercent({
        ...com_percent,
        [name]: {
          ...com_percent[name],
          percent:e.target.value

        }
      }

      )

    
  }



  const handleSubmit = () => {
    if (validate()) {

    if (!com_percent) {
      setMassg({
        open: true,
        severity: 'error',
        massg: 'Please enter a Commission Percentage'
      })
    } else {
      setLoading(true)
      fetch(Api + 'changeComPercent', {
        method: 'POST',
        body: JSON.stringify({
          "id": props.callback.id,
          "com_percent": com_percent
        })
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
    }

  }
  }

  return (
    <div>


      <Button color="success" size='small' style={{ marginLeft: 5, backgroundColor: 'green', color: '#fff' }} variant="contained" onClick={() => handleClickOpen()}>
        Update

      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Are You Sure To Update Employee Commission Rate"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           
            <TextField
              variant='outlined'
              value={com_percent.loan.percent}
              name='loan'
              onChange={handleChangePercent}
              label="Loan  Percentage"
              fullWidth
              style={{ marginTop: 10 }}
              error={err.loan}



            />
            <TextField
              variant='outlined'
              name='rd'
              value={com_percent.rd.percent}
              onChange={handleChangePercent}
              label="RD  Percentage"
              fullWidth
              style={{ marginTop: 10 }}
              error={err.rd}



            />
            <TextField
              variant='outlined'
              value={com_percent.savings.percent}
              name='savings'
              onChange={handleChangePercent}
              label="Savings  Percentage"
              fullWidth
              style={{ marginTop: 10 }}
              error={err.savings}



            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Agree
            {
              loading ? <CircularProgress /> : ''
            }
          </Button>
        </DialogActions>
      </Dialog>
      <SnakBar massg={massg} setMassg={setMassg} />
    </div>
  );
}
