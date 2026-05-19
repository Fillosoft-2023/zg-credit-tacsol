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
    Toolbar,
    IconButton

} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const pay_mode = ["Daily","Weekly",'15 Days',"Monthly"]

export default function TaModify(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState(props.location.state.data)
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [emi_cr,setEmiCr] = React.useState({})
    const [agent, setAgent] = React.useState([])
    React.useEffect(()=>{
        // sendAsync('agent').then((res)=> {
            
        //     setAgent(res)
        // })
    },[])
    const handleSubmit = ()=> {
        //    sendAsync(data).then((res)=> {
            
        //     if(Array.isArray(res)){
        //         console.log(res)
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
            "press" : "ta_info_edit",
             "id" : data.id

        })
        
        
    }



   

    

    

    return ( 
        <Container className={classes.container} >
            <Toolbar>
                <IconButton onClick={()=>history.push('/Home/FundHome/')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography >Edit TL information</Typography>
            </Toolbar>
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
                        name="opn_dt"
                        type="date"
                        value={data.opn_dt}
                        onChange={handleChange}
                        
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        helperText="Period"
                        variant="outlined"
                        fullWidth
                        name="tnre"
                        error={err.tnre}
                        value={data.tnre}
                        onChange={handleChange}
                        type="number"

                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        helperText="Interest %"
                        variant="outlined"
                        fullWidth
                        name="int_rt"
                        error={err.int_rt}
                        value={data.int_rt}
                        onChange={handleChange}
                        type="int_rt"

                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        helperText="Maturity Date"
                        variant="outlined"
                        fullWidth
                        name="mt_dt"
                        type="date"
                        error={err.mt_dt}
                        value={data.mt_dt}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl variant="outlined"  fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Select Agent</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.agentid}
                        value={data.agentid}
                        onChange={handleChange}
                        label="Agent ID"
                        name="agentid"
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        agent.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item.ac_no}>{item.ag_name}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Processing Charge"
                        variant="outlined"
                        fullWidth
                        name="prc_chr"
                        type="number"
                        value={data.prc_chr}
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
                <FormControl variant="outlined"  fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Mode</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        error={err.pay_mode}
                        value={data.pay_mode}
                        onChange={handleChange}
                        label="Mode"
                        name="pay_mode"
                    >
                    <MenuItem value={false}>
                        <em>None</em>
                    </MenuItem>
                    {
                        pay_mode.map((item,index)=>{
                            return (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </FormControl>
                </Grid>
                
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