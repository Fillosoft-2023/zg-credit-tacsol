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
import FormControl from'@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles'
import {useHistory} from 'react-router-dom'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'

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

export default function OtherTrans(props) {
  const history = useHistory();
  const [mssg, setMssg] = useState(false)
  const [open, setOpen] = React.useState(false);
  const style = useStyle();
  const [sendData, setSendData] = useState({});
  const [err, setErr] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [DataCollect,setDataCollect] = useState([])
  const collectInfo = {
        reffer_id : props.callback.reffer_id,
        press : 'savBalenc',
        
  }
  const handleClickOpen = () => {
    setOpen(true);
    setSendData({
        date : '',
        type : '',
        amount : ''

    })
    setMssg(false)
    // sendAsync(collectInfo).then((res)=>{
    //   setDataCollect(res)
      
    // })
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
        [name] : value,
        reffer_id : props.callback.reffer_id,
        "press" : "savingsTrans",
        agent_id : props.callback.agent_id
    })
  };


  const validate = ()=> {
      let isValid = true;
      let error = {}
      let balence = 0;
      {
        DataCollect.map((item)=>{

          balence = Number(item.dep) + Number(item.int) - Number(item.with)
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
      if(sendData.type === 'with'){
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
        // sendAsync(sendData).then((res)=> {
        //   if(res === "inserted"){
        //     // history.push('/Home/Share_reg/')
        //     setMssg(true)
            
            
            
        //   }
          
        // })
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
                      <Typography color="red" >Account Balance {Number(item.dep) + Number(item.int) - Number(item.with)}</Typography>
                    )
                  })
                }
              
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    helperText="ac no"
                    disabled
                    value={props.callback.acno}
                    className={style.input}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    helperText="date"
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
                <TextField
                    variant="outlined"
                   
                    className={style.input}
                    label="amount"
                    name="amount"
                    error={err.amount}
                    value={sendData.amount}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    helperText="remarks"
                    className={style.input}
                    name="remarks"
                    error={err.remarks}
                    value={sendData.remarks}
                    onChange={handleChange}
                    
                />
            </Grid>
          </Grid>
          {
            mssg  === true ? (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                     Transaction successfull!
                    </Alert>
                </Snackbar>  
            ) : mssg === 'error' ? (
                <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                     Something went wrong!
                    </Alert>
                </Snackbar>  
            ) : (
                <div>
                </div>
            )
        } 
        </DialogContent>
         
        
        <DialogActions>
          <Button autoFocus onClick={handleSubmit} disabled={disabled} color="primary" variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      
    </div>
  );
}

const useStyle = makeStyles((theme)=> ({
    input : {
        width: '100%',
    }
}))