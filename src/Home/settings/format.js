
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {CircularProgress} from '@material-ui/core'
import Api from '../../api/api'
import {useHistory} from 'react-router-dom'
import SnakBar from '../../consts/message'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Format(props) {
  const [open, setOpen] = React.useState(false);
  const [massg,setMassg] = React.useState({})
  const [loading,setLoading] = React.useState(false)
  const history = useHistory();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ac_no = {
      
      "press" : "format"
  }
 
  const handleSubmit = () => {
    // sendAsync(ac_no).then((res)=>{
    //   setOpen(false)
    // //   history.replace('Home/ModifyTrans/')
    // });
    setLoading(true)
    fetch(Api+'format')
    .then(res=>res.json())
    .then(res=>{setMassg({open : true,severity : 'success',massg : res.massg});setLoading(false);setTimeout(()=>{setOpen(false)},1000)})
    .catch(err=>{
      setLoading(false)
      setMassg({open : true,severity : 'error',massg : 'Faild to connect to the server'})
    })
  }

  return (
    <div>
      
      <Button color="secondary" style={{marginLeft: 10}} variant="contained" onClick={handleClickOpen}>
       Erase All Data
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> Are You Sure To Erased All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" style={{textAlign: 'center',color: 'red', fontSize: 14}}>
            Data will not be restored after erased
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Yes
            {loading ? <CircularProgress size={25} /> : ''}
          </Button>
        </DialogActions>
        <SnakBar massg={massg} setMassg={setMassg} />
      </Dialog>
    </div>
  );
}
