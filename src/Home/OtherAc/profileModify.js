import React,{useState}  from 'react'
import {
    Container,
    Typography,
    makeStyles,
    Grid,
    TextField,
    Button,
    Snackbar,
   
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import imageCompression from 'browser-image-compression'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function ProfileModify(props){
    const Style = styles();
    const [data, setData] = useState(props.location.state.data)
    const [err, setErr] = useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const onSubmit = ()=>{
            
            console.log(data)
            //  sendAsync(data).then((res)=>{
            //     if(Array.isArray(res)){
            //         setMssg(true)
            //         console.log(res)
            //     }else {
            //         alert(res)
            //         setMssg('error');
            //     }
            //  }
            // )
        
    }
    const handleClose = (event, reason) => {
        
        if (reason === 'clickaway') {
          return;
        }
        setMssg(false);
        
      };
    const handleChange = (event)=>{
        setDisabled(false)
        let name = event.target.name;
        let value = event.target.value;
        
        setData({
            ...data,
            [name] : value,
            "press" : "mem_info_edit",
        })

       
    }
    
    

    
    return (
        <Container className={Style.container} maxWidth={'lg'}>
            <Typography>Edit profile Information</Typography>
            <Grid container style={{marginTop: 10}} spacing={2}>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="name"
                    error={err.name}
                    required
                    fullWidth
                    label="Name"
                    autoFocus
                    type="text"
                    value={data.name}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="f_name"
                    error={err.f_name}
                    required
                    fullWidth
                    label="F/H Name"
                    autoFocus
                    type="text"
                    value={data.f_name}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="vill"
                    error={err.vill}
                    required
                    fullWidth
                    label="Vill"
                    autoFocus
                    type="text"
                    value={data.vill}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="ps"
                    error={err.ps}
                    required
                    fullWidth
                    label="PS"
                    autoFocus
                    type="text"
                    value={data.ps}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="po"
                    error={err.po}
                    required
                    fullWidth
                    label="PO"
                    autoFocus
                    type="text"
                    value={data.po}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="pin"
                    error={err.pin}
                    required
                    fullWidth
                    label="PIN"
                    autoFocus
                    type="number"
                    value={data.pin}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="dist"
                    error={err.dist}
                    required
                    fullWidth
                    label="Dist"
                    autoFocus
                    type="text"
                    value={data.dist}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="c_nmbr"
                    error={err.c_nmbr}
                    required
                    fullWidth
                    label="Contact No"
                    autoFocus
                    value={data.c_nmbr}
                    type="text"
                    onChange={handleChange}
                />
                </Grid>
               
               
                
                
            </Grid>
            <Grid container spacing={2}>
                
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="nmni"
                    error={err.nmni}
                    required
                    fullWidth
                    label="Nominee"
                    autoFocus
                    type="text"
                    value={data.nmni}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="rfl_ac_no"
                    error={err.rfl_ac_no}
                    required
                    fullWidth
                    label="Referral ac no"
                    autoFocus
                    type="text"
                    helperText="optional"
                    value={data.rfl_ac_no}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="op_dte"
                    error={err.op_dte}
                    required
                    fullWidth
                    
                    autoFocus
                    type="date"
                    helperText="Opening Date"
                    value={data.op_dte}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                
                </Grid>
                <Grid item xs={12} sm={4}>
                <Button variant="contained" color="primary"
                    className={Style.button}
                    size="large" 
                    onClick={onSubmit}
                    disabled={disabled}
                >
                    Save Changes
                </Button>
                </Grid>
                
            </Grid>
            {
                mssg  == true ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                         Information updated!
                        </Alert>
                    </Snackbar>  
                ) : mssg == 'error' ? (
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
        </Container>
    )
}

const styles = makeStyles((theme)=>({
    container : {
        padding: 20
        
    },
    button : {
        alignSelf: 'right',
        marginTop: 20,
        
    }
    
}))