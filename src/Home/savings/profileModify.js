import React,{useState}  from 'react'
import {
    Container,
    Typography,
    makeStyles,
    Grid,
    TextField,
    Button,
    Snackbar,
    Toolbar,
    IconButton,
    CircularProgress,
    Paper,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import imageCompression from 'browser-image-compression'
import {useHistory} from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function ProfileModify(props){
    const Style = styles();
    const history = useHistory()
    const [data, setData] = useState(props.location.state.data)
    const [err, setErr] = useState({})
    const [massg,setMassg] = React.useState({})
    const [loading,setLoading] = React.useState(false)
    const [disabled, setDisabled] = useState(true)
    const onSubmit = ()=>{
            //  sendAsync(data).then((res)=>{
            //     if(Array.isArray(res)){
            //         setMssg(true)
            //         console.log(res)
            //     }else {
            //         alert(res)
            //         setMssg('error');
            //     }
            //  }
            //  )

            setLoading(true)
            fetch(Api+'mem_info_edit',{
                method : 'POST',
                body: JSON.stringify(data)
            })
            .then(res=>res.json())
            .then(res=>{
                setLoading(false)
                if(res.code === 200){
                    setMassg({
                        open : true,
                        massg : res.massg,
                        severity : 'success'
                    })
                }else{
                    setMassg({
                        open : true,
                        massg : res.massg,
                        severity : 'error'
                    })
                }
            })
            .catch(err=>{
                setLoading(false)
                setMassg({
                    open : true,
                    massg : "Faild to connect to the server",
                    severity : 'error'
                })
            })
        
    }
    
    const handleChange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;
        setDisabled(false)
        setData({
            ...data,
            [name] : value,
            "press" : "mem_info_edit",
        })

       
    }
    
    

    
    return (
        <Container className={Style.container} maxWidth={'lg'} component={Paper}>
            <Toolbar>
                <IconButton onClick={()=>history.push('/Home/SavHome/')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography >Edit Profile Information</Typography>
            </Toolbar>
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
                    name="Address"
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
                {/* <Grid item xs={12} sm={4}>
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
                </Grid> */}
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
                {/* <Grid item xs={12} sm={4}>
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
                </Grid> */}
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
               
                
                
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="relation_with_nom"
                    error={err.relation_with_nom}
                    required
                    fullWidth
                    label="Relation with nominee"
                    autoFocus
                    type="text"
                    value={data.relation_with_nom}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="nominee_add"
                    error={err.nominee_add}
                    required
                    fullWidth
                    label="Nominee address"
                    autoFocus
                    type="text"
                    value={data.nominee_add}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="bank_ac"
                    error={err.bank_ac}
                    required
                    fullWidth
                    label="Bank ac no"
                    autoFocus
                    type="text"
                    value={data.bank_ac}
                    onChange={handleChange}
                />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="bank_det"
                    error={err.bank_det}
                    required
                    fullWidth
                    label="Bank Details"
                    multiline
                    autoFocus
                    type="text"
                    value={data.bank_det}
                    onChange={handleChange}
                />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="edu_qualific"
                    error={err.edu_qualific}
                    required
                    fullWidth
                    label="Educational qualification"
                    multiline
                    autoFocus
                    type="text"
                    value={data.edu_qualific}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="occupation"
                    error={err.occupation}
                    required
                    fullWidth
                    label="Occupation"
                    multiline
                    autoFocus
                    type="text"
                    value={data.occupation}
                    onChange={handleChange}
                />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    name="other_info"
                    error={err.other_info}
                    required
                    fullWidth
                    label="Other Info"
                    autoFocus
                    type="text"
                    helperText="optional"
                    value={data.other_info}
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
            </Grid>
            <Grid container spacing={2}>
                
                <Grid item xs={12} sm={4}>
                <Button variant="contained" color="primary"
                    className={Style.button}
                    size="large" 
                    onClick={onSubmit}
                    disabled={disabled}
                >
                    Save Changes
                    {
                        loading ? <CircularProgress color='#fff' size={25} /> : ''
                    }
                </Button>
                </Grid>
                
            </Grid>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}

const styles = makeStyles((theme)=>({
    container : {
        padding: 10,

        
    },
    button : {
        alignSelf: 'right',
        marginTop: 20,
        
    }
    
}))