
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
import { CircularProgress } from '@material-ui/core';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteShare(props) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [massg,setMassg] = React.useState({})
  const [loading,setLoading] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleSubmit = () => {
    // sendAsync(ac_no).then((res)=>{
    //   setOpen(false)
    // //   history.replace('Home/ModifyTrans/')
    // });
    setLoading(true)
        fetch(Api+'delete_share_ac',{
          method : 'POST',
          body : JSON.stringify({"reffer_id" : props.callback.reffer_id})
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
      
      <Button color="secondary" style={{marginLeft: 5}} variant="contained" onClick={handleClickOpen}>
        Delete
      </Button>
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
            Deleting an account can lost all your information and transaction history about this account, You can not recover
            informations once you delete this! 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Agree
            {loading ? <CircularProgress size={25} /> : ''}
          </Button>
        </DialogActions>
      </Dialog>
      <SnakBar massg={massg} setMassg={setMassg} />
    </div>
  );
}
