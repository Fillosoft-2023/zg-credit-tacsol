import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const SnakBar = ({setMassg,massg})=>{

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setMassg({
            ...massg,
            open : false
        });
    };
    return(
       
            <Snackbar open={massg.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert  severity={massg.severity} sx={{ width: '100%' }} onClose={handleClose}>
                    {
                        massg.massg
                    }
                </Alert>
            </Snackbar>
      
    )
}

export default SnakBar