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
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    LinearProgress
} from '@material-ui/core'
import Api from '../../api/api';
import SnakBar from '../../consts/message';

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

export default function ReduceProperty(props) {


  const [open, setOpen] = React.useState(false);
  const style = useStyle();

  const [data, setData] = React.useState([])
  const [value, setValue] = React.useState([])
  const [disabled, setDisabled] = React.useState([])
  const [mssg, setMssg] = React.useState()
  const [loading,setLoading] = React.useState(false)
  const [massg,setMassg] = React.useState({})
  const handleClose = () => {
    setOpen(false);
    setMssg(false)
  };
  const handleClickOpen = () => {
    setOpen(true);
    // sendAsync('property').then((res)=> {
    //     console.log(res)
    //     setData(res)
    // })

    fetch(Api+'property')
    .then(res=>res.json())
    .then(res=>setData(res))
    .catch(err=>{
       console.log(err)
    })
   
  };
  const handleChange = (value,item,index)=>{
    const newArray = [...data]
    setDisabled(false)
    
    Object.assign(newArray[index],{
        ...newArray[index],
        status : 'modified',
        reduce_val : value
    })
  }

  const handleSubmit = ()=>{
      const send = {
        "data" : data,
        today : new Date().toLocaleDateString('en-CA')
      }
      setLoading(true)
        fetch(Api+'propertyDepricate',{
          method : 'POST',
          body : JSON.stringify(send)
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
  return (
    <div>
        <Button variant="contained" onClick={handleClickOpen} style={{margin: 5,background : 'red'}} size='small' color="primary" fullWidth>
           Property Depreciation
           </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Property Value Manager
        </DialogTitle>
        <DialogContent dividers>
          {loading ? <LinearProgress /> : ''}
          <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Purchased Amount </TableCell>
                        <TableCell>Present value</TableCell>
                        <TableCell>Reduced value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.map((item,index)=>{
                           const dep_val = Number(item.red_amount)
                            return (
                                <TableRow key={index}>
                                    <TableCell>{item.detail}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{Number(item.amount) - dep_val}</TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            name="new_val"
                                            style={{width: 100}}
                                            value={data[index].red}
                                            onChange={({ target: { value } })=> handleChange(value,item.id,index)}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
          </TableContainer>
        
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" disabled={disabled} onClick={handleSubmit} variant="outlined">
            Save
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