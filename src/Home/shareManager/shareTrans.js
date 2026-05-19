import React, { useState } from 'react';
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
import FormControl from'@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles'

import {useHistory} from 'react-router-dom'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { CircularProgress } from '@material-ui/core';
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

export default function Transac(props) {
  const history = useHistory();
  const [mssg, setMssg] = useState(false)
  const [open, setOpen] = React.useState(false);
  const style = useStyle();
  const [sendData, setSendData] = useState({});
  const [err, setErr] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [DataCollect,setDataCollect] = useState([])
  const [loading,setLoading] = React.useState(false)
  const [massg,setMassg] = React.useState({})
  const collectInfo = {
        reffer_id : props.callback.reffer_id,
        press : 'shareBalenc'
  }
  const handleClickOpen = () => {
    setOpen(true);
    // sendAsync(collectInfo).then((res)=>{
    //   setDataCollect(res)
      
    // })
    fetch(Api+'shareBalenc&reffer_id='+props.callback.reffer_id)
    .then(res=>res.json())
    .then(res=>setDataCollect(res))
    .catch(err=>{
       console.log(err)
    })
  };
  const handleClose = () => {
    setOpen(false);
  };
 

  const handleChange = (event) => {
    setDisabled(false)
    let name = event.target.name;
    let value = event.target.value;

    setSendData({
        ...sendData,
        [name] : value,
        "id" : props.callback.id,
        reffer_id : props.callback.reffer_id,
    })
  };

  const validate = ()=> {
      let isValid = true;
      let error = {}
      let balence = 0;
      {
        DataCollect.map((item)=>{

          balence = Number(item.dr)- Number(item.cr)
        })
      }
      if(!sendData.date){
          isValid = false;
          error['date'] = true;
      }
      if(!sendData.type){
          isValid = false;
          error['type'] = true
      }
      if(!sendData.amount){
          isValid = false;
          error['amount'] =true;
      }
      if(sendData.type === 'cr'){
        if(sendData.amount > balence){
          isValid = false;
          error['amount'] =true;
      }
      }

      setErr(error)

      return isValid;
  }

 const  handleSubmit = ()=> {
  setDisabled(true)
     if(validate()){
        setLoading(true)
        fetch(Api+'share_amount',{
          method : 'POST',
          body : JSON.stringify(sendData)
        })
        .then(res=>res.json())
        .then(res=>{
          setLoading(false)
          if(res.code === 200){
            setMassg({
              open : true,
              severity : 'success',
              massg : res.massg
            })
          }else{
            setMassg({
              open : true,
              severity : 'error',
              massg : res.massg
            })
          }
          setTimeout(()=>{
            setOpen(false)
            setMassg({})
          },1000)
        })
        .catch(err=>{
          setLoading(false)
          setMassg({
            open : true,
            severity : 'error',
            massg : 'Faild to connect to the server'
          })
        })
     }
 }

 

  return (
    <div>
      <IconButton edge="end"  aria-label="transaction" onClick={handleClickOpen}>
                    <SubtitlesIcon />
       </IconButton>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Transaction
        </DialogTitle>
        <DialogContent dividers>
        <div className={style.balence}>
              
                {
                  DataCollect.map((item)=>{

                    return (
                      <div style={{display : 'flex',justifyContent : 'space-between'}}>
                          <Typography color="red" >Account Balance {(Number(item.dr) - Number(item.cr)) + (Number(item.dev) - Number(item.dev_with))}</Typography>
                          <Typography>Share class {props.callback.class}</Typography>
                      </div>
                    )
                  })
                }
              
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    label="Reg No"
                    disabled
                    value={props.callback.acno}
                    className={style.input}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TransDates
                    variant="outlined"
                    label="date"
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
                <MenuItem value={'dr'}>Deposit</MenuItem>
                <MenuItem value={'cr'}>Withdrawal</MenuItem>
                <MenuItem value={'dev'}>Devidend</MenuItem>
                <MenuItem value={'dev_with'}>Devidend Withdrawal</MenuItem>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={disabled} autoFocus onClick={handleSubmit} color="primary" variant="outlined">
            Save
            {
              loading ? <CircularProgress size={25} /> :''
            }
          </Button>
        </DialogActions>
      </Dialog>
      <SnakBar massg={massg} setMassg={setMassg} />
      
    </div>
  );
}

const useStyle = makeStyles((theme)=> ({
    input : {
        width: '100%',
    }
}))