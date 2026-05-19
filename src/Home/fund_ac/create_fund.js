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


// const pay_mode = ["Daily","Weekly",'15 Days',"Monthly"]
// const period = ['Year',"Month","Day"]
export default function CreateFund(props){
    const history = useHistory()
    const classes = useStyle();
    const [data, setData] = React.useState({})
    const [err, setErr] = React.useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [emi_cr,setEmiCr] = React.useState({})

    const handleSubmit = ()=> {
        setDisabled(true)
        if(valid()){
         
        //    sendAsync(data).then((res)=> {
        //     console.log(res)
            
        //     if(res === "inserted"){
        //         setMssg(true)
        //         // history.replace('/Home/FdHome/')
        //         // setInterval(function(){history.go()},0)

        //         history.push({ pathname: "/Home/FundHome/" });

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
            "press" : "fund_create",
            "ac_no" : props.location.query,
             "reffer_id" : reffer_id

        })
      


    }

    const valid = ()=>{
        let isValid = true
        let error = {}

       
        

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

    // const handleMths = ()=> {
    //     let isCalculated = false
 
    //     // let int = Math.pow(1 + (Number(data.intrst) / 100), Number(data.tenure))
    //     // let matAmt = (Number(data.fd_amount) * Number(int)).toFixed(2)
    //     // let intr = Number(matAmt) - Number(data.fd_amount)
    //     let int = Number(data.fd_amount) * Number(data.intrst) / 100;
    //     let totInt = Number(int) * Number(data.tenure)
    //     let matAmt = Number(data.fd_amount) + Number(totInt)


    //    console.log(data)

    //     if(!isNaN(matAmt)){
    //         isCalculated = true

    //         Object.assign(data, {intrst_amnt : totInt.toFixed(2), maturity_val : matAmt.toFixed(2)});

    //     }
    //     return isCalculated;

    // }

    // const [agent, setAgent] = React.useState([])
    // React.useEffect(()=>{
    //     sendAsync('agent').then((res)=> {
    //         setAgent(res)
    //     })
    // },[])




    return (
        <Container className={classes.container} >
        <Typography>Enter New Fund</Typography>
        <Divider style={{marginBottom: 10,marginTop: 10}} />
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={6}>
                    <TextField
                        helperText="Ac no"
                        variant="outlined"
                        fullWidth
                        name="acno"
                        value={props.location.query}
                        disabled
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Initial deposite Amount"
                        variant="outlined"
                        fullWidth
                        name="fund_amount"
                        error={err.fund_amount}
                        value={data.fund_amount}
                        onChange={handleChange}
                        type="number"

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="date"
                        variant="outlined"
                        fullWidth
                        name="date"
                        error={err.date}
                        value={data.date}
                        onChange={handleChange}
                        type="date"

                    />
                </Grid>
                
               

                <Grid item xs={12} sm={6}>
                <Button variant="contained" onClick={handleSubmit} disabled={disabled} color="primary">
                    Create Fund
                </Button>

                </Grid>



            </Grid>

            {
                mssg  == true ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                         Registration successfull!
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
