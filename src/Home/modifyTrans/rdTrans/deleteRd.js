
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
// import sendAsync from '../../../backend/renderer';
import {useHistory} from 'react-router-dom'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteRd(props) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ac_no = {
      "reffer_id" : props.callback.reffer_id,
      "date" : props.callback.date,
      totalDue : props.callback.ttl_due, 
      "press" : "delete_Rds"
  }
 
  const handleSubmit = () => {
    // sendAsync(ac_no).then((res)=>{
    //   setOpen(false)
    //   history.replace('Home/ModifyTrans/')
     
    // });
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
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
