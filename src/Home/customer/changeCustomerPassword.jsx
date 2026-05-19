
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

export default function ChangeCustomerPassword(props) {
    const [open, setOpen] = React.useState(false);
    const [ac_no, setAcNo] = React.useState({})
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const history = useHistory();
    const [pass, setPass] = React.useState()
    const handleClickOpen = (value) => {
        setOpen(true);
        setAcNo({
            "id": props.callback,
            "press": "disable_employee",
            "pass": pass
        })
    };

    const handleClose = () => {
        setOpen(false);
    };



    const handleSubmit = () => {
        if (!pass) {
            setMassg({
                open: true,
                severity: 'error',
                massg: 'Please enter a password'
            })
        } else {
            setLoading(true)
            fetch(Api + 'changeCustomerPassAdmin', {
                method: 'POST',
                body: JSON.stringify({
                    "id": props.callback,
                    "pass": pass
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

    return (
        <div>


            <Button color="primary" size='small' style={{ marginLeft: 5, color: '#fff' }} variant="contained" onClick={() => handleClickOpen()}>
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
                <DialogTitle id="alert-dialog-slide-title">{"Are you sure to change user's login password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextField
                            variant="outlined"
                            label="Enter New Password"
                            fullWidth
                            value={pass}
                            onChange={({ target: { value } }) => setPass(value)}
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
