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


export default function OtherModify(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState(props.location.state.data)
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [emi_cr,setEmiCr] = React.useState({})

    const handleSubmit = ()=> {
        //    sendAsync(data).then((res)=> {
            
        //     if(Array.isArray(res)){
        //         setMssg(true)
                  
                
        //     }else {
        //         console.log(res)
        //         setMssg('error');
        //     }
            
        //    })

           

         
        
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
        setData({
            ...data,
            [name] : value,
            "press" : "sav_info_edit",
             "reffer_id" : data.reffer_id

        })
        
        
    }



   

    

    

    return ( 
        <Container className={classes.container} >
        <Typography>Modify RD Details</Typography>
        <Divider style={{marginBottom: 10,marginTop: 10}} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={4}>
                    <TextField
                        helperText="Ac no"
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={data.acno}
                        disabled
                    />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                    <TextField
                        helperText="Opening Date"
                        variant="outlined"
                        fullWidth
                        name="date"
                        type="date"
                        
                        value={data.date}
                        onChange={handleChange}
                        
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Agent ID"
                        variant="outlined"
                        fullWidth
                        name="agent_id"
                        value={data.agent_id}
                        onChange={handleChange}
                        type="number"
                       
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Processing Charge"
                        variant="outlined"
                        fullWidth
                        name="proc_chrg"
                        type="number"
                        value={data.proc_chrg}
                        onChange={handleChange}
                    />
                </Grid>
                {/*<Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Insurencce Fees"
                        variant="outlined"
                        fullWidth
                        name="insurence"
                        type="number"
                        error={err.insurence}
                        value={data.insurence}
                        onChange={handleChange}
                       
                    />
                    </Grid>*/}
                
                <Grid item xs={12} sm={4}>
                
                <Button variant="contained" disabled={disabled} onClick={handleSubmit} color="primary">
                    Save Changes
                </Button>
                
                </Grid>
            
            
            
            </Grid>
        
            {
                mssg  == true ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                         Update successfull!
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
        // backgroundColor: '#fff',
        overflowX: 'auto',
         padding: 15,
        //  boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, .2)',
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