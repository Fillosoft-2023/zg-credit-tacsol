import React,{useEffect, useState} from 'react'
import {
    Container,
    Grid,
    TextField,
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Typography,
    Divider,


} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';

import {useHistory} from 'react-router-dom'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


export default function CreateOther(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [emi_cr,setEmiCr] = React.useState({})

    const handleSubmit = ()=> {
        setDisabled(true)
        console.log(valid())
        if(valid()){
          
        //    sendAsync(data).then((res)=> {
        //     console.log(res)
        //     if(res === "inserted"){
        //         setMssg(true)
        //         // history.push({ pathname: "/Home/RdHome/" });
        //         history.push({ pathname: "/Home/OtherHome/" });
                
        //     }else {
        //         console.log(res)
        //         setMssg('error');
        //     }
            
        //    })

           

         
        }
    }

  
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setMssg(false);
        
      };
    const handleChange = (event)=> {
        setDisabled(false)
        let name= event.target.name
        let value = event.target.value
        
        //creating reference id for loan and emi
        var date = new Date();
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ]; 
        
        var reffer_id = components.join("");

        setData({
            ...data,
            [name] : value,
            "press" : "otherac_create",
            "ac_no" : props.location.query.acno,
            "ac_name" :  props.location.query.name,
             "reffer_id" : reffer_id

        })
        console.log(data)
        

        
    }

    const valid = ()=>{
        let isValid = true
        let error = {}
        
        
       
        if(!data.opendate){
            isValid = false
            error['opendate'] = true
        }
        
        // if(!data.pcharge){
        //     isValid = false
        //     error['pcharge'] = true
        // }
        // if(!data.insurence){
        //     isValid = false
        //     error['insurence'] = true
        // }
        


        setErr(error)

        return isValid
    }

    

    

    return ( 
        <Container className={classes.container} >
        <Typography>Enter RD Details</Typography>
        <Divider style={{marginBottom: 10,marginTop: 10}} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Ac no"
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query.acno}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Ac Name"
                        variant="outlined"
                        fullWidth
                        name="acname"
                        value={props.location.query.name}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Open Date"
                        variant="outlined"
                        fullWidth
                        name="opendate"
                        error={err.opendate}
                        value={data.opendate}
                        onChange={handleChange}
                        type="date"
                       
                    />
                </Grid>
                
                
                <Grid item xs={12} sm={6}>
                <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                    Create
                </Button>
                
                </Grid>
            
            
            
            </Grid>
        
            {
                mssg  == true ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                         Account created!
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


const useStyle = makeStyles((theme)=> ({
    container : {
        backgroundColor: '#fff',
        overflowX: 'auto',
         padding: 15,
         boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
         height: '97%',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
    },formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}))