
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';

import {useHistory} from 'react-router-dom'
import Api from '../../api/api';
import { CircularProgress } from '@material-ui/core';
import SnakBar from '../../consts/message';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteEmi({props,setRefresh}) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [loading,setLoading] = React.useState(false)
  const [massg,setMassg] = React.useState({})
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ac_no = {
      "reffer_id" : props.reffer_id,
      "date" : props.dte,
      "press" : "delete_Emi",
      "princ" : Number(props.prncpl)+Number(props.princ_bal),
      "int" : Number(props.interest)+Number(props.intr_bal),
      "trans_id" : props.emi_id
  }
  
  const handleSubmit = () => {
    setLoading(true)
              fetch(Api+'delete_Emi',{
                method : 'POST',
                body : JSON.stringify(ac_no)
              })
              .then(res=>res.json())
              .then(res=>{
                setLoading(false)
                setRefresh(Math.random())
                setTimeout(()=>{setOpen(false)},1000)
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
      
      <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}>
            <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Are you sure to Delete this account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Deleting this transaction can lost your information permanently!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Agree
            {
              loading ? <CircularProgress size={25} /> : ''
            }
          </Button>
        </DialogActions>
      </Dialog>
      <SnakBar massg={massg} setMassg={setMassg} />
    </div>
  );
}
