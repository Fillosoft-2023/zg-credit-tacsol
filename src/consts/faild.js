
import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const FaildToConnect = ()=>{
    const [open, setOpen] = React.useState(false)
    const handleClose = ()=>{
        setOpen(false)
    }
    return(
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose} >
                Faild to connect to the server
            </Alert>
        </Snackbar>
    )
}

export default  FaildToConnect