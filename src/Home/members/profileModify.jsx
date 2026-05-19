import React, { useState } from 'react'
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
    Divider,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import imageCompression from 'browser-image-compression'
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import { ArrowBack } from '@material-ui/icons';
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ProfileModify(props) {
    const Style = styles();
    const history = useHistory()
    const [data, setData] = useState(props.location.state.data)
    const [err, setErr] = useState({})
    const [mssg, setMssg] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [loading, setloading] = useState(false)
    const [images, setImages] = useState({})
    const [passport, setPassport] = useState(null)
    const [add1, setAdd1] = useState(null)
    const [add2, setAdd2] = useState(null)
    const [application, setApplication] = useState(null)
    const [idproof, setIdProof] = useState(null)



    const handleImgChange = (event) => {
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
            setPassport(event.target.files[0])
        }
    }
    const handleImgChange1 = (event) => {
        
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
          
            setAdd1(event.target.files[0])
        }
    }
    const handleImgChange2 = (event) => {
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
            setAdd2(event.target.files[0])
        }
    }
    const handleImgChange3 = (event) => {
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
            setIdProof(event.target.files[0])
        }
    }
    const handleImgChange4 = (event) => {
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
            setApplication(event.target.files[0])
        }
    }

    const onSubmit = () => {
        const sendData = new FormData(

        )
        Object.keys(data).map(item => sendData.append(item, data[item]))
        if (passport != null) {
            sendData.append('passport', passport)
        } 
        if (add1 != null) {
            sendData.append('add1', add1)
        } 
         if (add2 != null) {
            sendData.append('add2', add2)
        } if (idproof != null) {
            sendData.append('idproof', idproof)
        } if (application != null) {
            sendData.append('application', application)
        }
   
        setloading(true)
        fetch(Api + 'mem_info_edit', {
            method: 'POST',
            body: sendData
        })
            .then(res => res.json())
            .then(res => {
                setloading(false)
                if (res.code === 200) {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'success'
                    })
                } else {
                    setMssg({
                        open: true,
                        massg: res.massg,
                        severity: 'error'
                    })
                }
            })
            .catch(err => {
                setloading(false)
                setMssg({
                    open: true,
                    massg: "Faild to connect to the server",
                    severity: 'error'
                })
            })

    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setDisabled(false)
        setData({
            ...data,
            [name]: value,
            "press": "mem_info_edit",
        })


    }

    return (
        <Container maxWidth="false" component={Paper}>
            <Toolbar style={{ display: 'flex' }}>
                <IconButton onClick={() => history.push('/Home/AllMembers/')}>
                    <ArrowBack />
                </IconButton>
                <Typography >Edit Member Profile Information</Typography>
            </Toolbar>
            <Paper variant='outlined' style={{ margin: 10, padding: 10 }}>
                <Typography variant='h5'>
                    Personal Information
                </Typography>
                <Divider />
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="name"
                            error={err.name}
                            fullWidth
                            label="Name"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="acno"
                            error={err.acno}
                            fullWidth
                            label="Registration Number"
                            disabled
                            type="text"
                            value={data.acno}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="adhar_no"
                            error={err.adhar_no}
                            fullWidth
                            label="Aadhar No"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.adhar_no}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="pan_no"
                            error={err.pan_no}
                            fullWidth
                            label="PAN No"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.pan_no}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="f_name"
                            error={err.f_name}
                            fullWidth
                            label="F/H Name"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.f_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="dob"
                            error={err.dob}
                            fullWidth
                            label="Date Of Birth"
                            InputLabelProps={{ shrink: true }}
                            type="date"
                            value={data.dob}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="c_nmbr"
                            error={err.c_nmbr}
                            fullWidth
                            label="Contact No"
                            autoFocus
                            value={data.c_nmbr}
                            type="text"
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="edu_qualific"
                            error={err.edu_qualific}
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
                            name="other_info"
                            error={err.other_info}
                            fullWidth
                            label="Other Info"
                            type="text"
                            value={data.other_info}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="op_dte"
                            error={err.op_dte}
                            fullWidth
                            type="date"
                            label="Opening Date"
                            InputLabelProps={{ shrink: true }}
                            value={data.op_dte}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="nationality"
                            error={err.nationality}
                            fullWidth
                            label="Nationality"
                            type="text"
                            value={data.nationality}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="member_acno"
                            fullWidth
                            label="Member A/C No."
                            type="text"
                            value={data.member_acno}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}> 
                        <TextField
                            variant="outlined"
                            name="member_fee"
                            fullWidth
                            label="Member Fee"
                            type="number"
                            value={data.member_fee}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>


                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ margin: 10, padding: 10 }}>
                <Typography variant='h5'>
                    Address
                </Typography>
                <Divider />
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="Address"
                            error={err.vill}
                            fullWidth
                            label="Vill"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.vill}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="Address"
                            error={err.vill}
                            fullWidth
                            label="Vill"
                            InputLabelProps={{ shrink: true }}
                            type="text"
                            value={data.vill}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="pin"
                            error={err.pin}
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
                            name="ward_no"
                            error={err.ward_no}
                            fullWidth
                            label="Ward No"
                            multiline
                            autoFocus
                            type="text"
                            value={data.ward_no}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ margin: 10, padding: 10 }}>
                <Typography variant='h5'>
                    Bank Details
                </Typography>
                <Divider />
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_ac"
                            error={err.bank_ac}
                            fullWidth
                            label="Bank ac no"
                            autoFocus
                            type="text"
                            value={data.bank_ac}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_det"
                            error={err.bank_det}
                            fullWidth
                            label="Bank Details"
                            multiline
                            autoFocus
                            type="text"
                            value={data.bank_det}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ margin: 10, padding: 10 }}>
                <Typography variant='h5'>
                    Nominee Details
                </Typography>
                <Divider />
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="nmni"
                            error={err.nmni}
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
                            name="relation_with_nom"
                            error={err.relation_with_nom}
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
                            fullWidth
                            label="Nominee address"
                            autoFocus
                            type="text"
                            value={data.nominee_add}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ margin: 10, padding: 10 }}>
                <Typography variant='h5'>
                    Documents
                </Typography>
                <Divider />
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="passport"
                            required
                            fullWidth
                            label="Photo"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            type="file"

                            onChange={handleImgChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="add1"
                            required
                            fullWidth
                            label="Address 1"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            type="file"
                            onChange={handleImgChange1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="add2"
                            required
                            fullWidth
                            label="Address 2"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            type="file"
                            onChange={handleImgChange2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="idproof"
                            required
                            fullWidth
                            label="Signature"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            type="file"
                            onChange={handleImgChange3}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="application"
                            required
                            fullWidth
                            label="Registration Form"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            type="file"
                            onChange={handleImgChange4}
                        />
                    </Grid>
                    

                </Grid>
            </Paper>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Button variant="contained" color="primary"
                        className={Style.button}
                        size="small"
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        Save Changes
                        {
                            loading ? <CircularProgress size={30} color="#fff" /> : ''
                        }
                    </Button>
                </Grid>

            </Grid>

            <SnakBar massg={mssg} setMassg={setMssg} />
        </Container>
    )
}

const styles = makeStyles((theme) => ({
    container: {
        padding: 0,


    },
    button: {
        alignSelf: 'right',
        marginTop: 20,

    }

}))