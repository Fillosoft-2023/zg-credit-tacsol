import React, { useState, useEffect } from 'react'
import {
    Container,
    Typography,
    makeStyles,
    Grid,
    TextField,
    Button,
    Snackbar,
    Box,
    Paper,
    Divider,
    Toolbar,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import imageCompression from 'browser-image-compression'
import Api from '../api/api';
import LoaderComponent from '../consts/loader';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const occupation = [
    'None',
    'Shopkeeper',
    'Government Employee',
    'Private Employee',
    'Business',
    'Teacher',
    'Engineer',
    'Doctor',
    'Farmer',
    'Accountant',
    'Lawyer',
    'Chef',
    'Driver',
    'Housekeeper',
    'Craftsman',
    'Carpenter',
    'Tailor',
    'Electrician',
    'Plumber',
    'Artist',
    'Policeman',
    'Salesperson',
    'Priest',
    'Construction Worker',
    'Social Worker',
    'Driver',
    'Pilot',
    'Nurse',
    'Security Guard',
    'Beautician',
    'Writer',
    'Actor',
    'Musician',
    'Other'
];
export default function Newreg() {
    const Style = styles();
    const [data, setData] = useState({})
    const [err, setErr] = useState({})
    const [mssg, setMssg] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [seq, setSeq] = useState(0)
    const [isRefresed, setRefresed] = useState(Math.random())
    const [images, setImages] = useState({})
    const [loading, setLoading] = useState(false)
    const [same_add, setSameAdd] = useState(false)
    const [error, setError] = useState('Something Went Wrong')
    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const b_id = queryParameters.get("b_id")

    const onSubmit = async () => {
        setRefresed(true)
        setDisabled(true)
        if (validate()) {

            const new_Data = new FormData
            Object.keys(data).map((item) => {
                new_Data.append(item, data[item])
            })
            Object.keys(images).map((item) => {
                new_Data.append(item, images[item])
            })
            if (!id && !b_id) {

            } else {
                new_Data.append('agentid', id)
                new_Data.append('b_id', b_id)
            } 

            setLoading(true)
            fetch(Api + 'newReg', {
                method: 'POST',
                body: new_Data
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    setRefresed(Math.random())
                    if (res.code === 200) {
                        setMssg(true)
                    } else {

                        setError(res.massg)
                        setTimeout(() => {
                            setMssg('error')
                        }, 1000)
                    }
                })
                .catch(err => {
                    setMssg('error')
                    setLoading(false)
                })
        } else {
            console.log(err)
            alert('Please fill all required filled')
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMssg(false);

    };
    const handleChange = (event) => {
        setDisabled(false)
        let name = event.target.name;
        let value = event.target.value; 

        setData({
            ...data,
            [name]: value,
            "press": "mem_rgstrsn",

        })
    }
    const handleImage = (event) => {
        if (event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg') {
            setImages({
                ...images,
                [event.target.name]: event.target.files[0]
            })
        }
    }
    const validate = () => {
        let isValid = true;
        let error = {};
        if (!data.name) {
            isValid = false;
            error['name'] = true;
        }
        if (!data.h_name) {
            isValid = false;
            error['h_name'] = true;
        }
        if (!data.vill) {
            isValid = false;
            error['vill'] = true;
        }
        if (!data.po) {
            isValid = false;
            error['po'] = true;
        }
        if (!data.pin) {
            isValid = false;
            error['pin'] = true;
        }
        if (!data.ps) {
            isValid = false;
            error['ps'] = true;
        }
        if (!data.dist) {
            isValid = false;
            error['dist'] = true;
        }
        if (!data.c_no) {
            isValid = false;
            error['c_no'] = true;
        }
        if (!data.nominee) {
            isValid = false;
            error['nominee'] = true;
        }
        if (!data.ac_o_date) {
            isValid = false;
            error['ac_o_date'] = true;
        }
        // if (!data.adhar_no && !data.pan_no) {
        //     isValid = false;
        //     error['adhar_no'] = true;
        //     error['pan_no'] = true;
        // }
        

        setErr(error)

        return isValid;

    }

    const handleSame = () => {
        setSameAdd(!same_add);
        setData({
            ...data,
            p_vill: data.vill,
            p_pin: data.pin,
            p_po: data.po,
            p_ps: data.ps,
            p_dist: data.dist
        })
    }

    const [agent, setAgent] = React.useState([])
    React.useEffect(() => {
        fetch(Api + 'agentMobile')
            .then(res => res.json())
            .then(res => setAgent(res))
    }, [])

    return (
        <Container component={Paper} maxWidth="xxl" style={{ paddingTop: 10 }}>
            <Paper variant='outlined' style={{ padding: 10 }}>
                <h2 style={{ margin: 0, marginBottom: 10, textAlign: 'center',color:'#023E8A' }}>Register A New Member</h2>
            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography variant='h6' style={{color:'#023E8A'}}>Personal Information</Typography>
                <Grid container style={{ marginTop: 10 }} spacing={2}>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="name"
                            error={err.name}
                            required
                            fullWidth
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="acno"
                            fullWidth
                            label="Registration Number"
                            type="text"
                            value={data.acno}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="h_name"
                            error={err.h_name}
                            required
                            fullWidth
                            label="F/H Name"
                            type="text"
                            value={data.h_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="dob"
                            error={err.dob}
                            required
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
                            name="c_no"
                            error={err.c_no}
                            required
                            fullWidth
                            label="Contact No"

                            value={data.c_no}
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="edu_quali"
                            // error={err.edu_quali}
                            required
                            fullWidth
                            label="Educational qualification"

                            value={data.edu_quali}
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel style={{ padding: 5,color:'#023E8A' }}>Occupation</InputLabel>
                            <Select
                                variant="outlined"
                                name="occupation"
                                error={err.occupation}
                                required
                                label="Occupation"
                                value={data.occupation}
                                type="text"
                                onChange={handleChange}
                            >
                                {
                                    occupation.map((item, index) =>
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>

                    </Grid>



                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="passport"
                            error={err.passport}
                            fullWidth
                            type="file"
                            label="Passport Image"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleImage}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="add_prof"
                            error={err.add_prof}
                            fullWidth
                            type="file"
                            label="Address Proof"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleImage}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="add_prof2"
                            error={err.add_prof2}
                            fullWidth
                            type="file"
                            label="Address Proof 2"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleImage}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="id_prof"
                            error={err.id_prof}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            type="file"
                            label="Signature"
                            onChange={handleImage}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="application"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            type="file"
                            label="Registration Form"
                            onChange={handleImage}
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
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="reffer"
                            error={err.reffer}
                            fullWidth
                            label="Referral ac no"
                            type="text"
                            value={data.reffer}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="ac_o_date"
                            error={err.ac_o_date}
                            required
                            fullWidth
                            type="date"
                            label="Opening Date"
                            InputLabelProps={{ shrink: true }}
                            value={data.ac_o_date}
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
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                variant='outlined'
                                name="gender"
                                error={err.gender}
                                fullWidth
                                value={data.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female"> Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="pan_no" 
                            // error={err.pan_no}
                            fullWidth
                            label="Pan number"
                            type="text"
                            value={data.pan_no}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="adhar_no"
                            // error={err.adhar_no}
                            fullWidth
                            label="Aadhar Number"
                            type="text"
                            value={data.adhar_no}
                            onChange={handleChange}
                        />
                    </Grid>

                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography style={{color:'#023E8A'}}>Present Address</Typography>
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="vill"
                            error={err.vill}
                            required
                            fullWidth
                            label="Vill"
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
                            type="text"
                            value={data.dist}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="ward_no"
                            fullWidth
                            label="Ward No."
                            type="text"
                            value={data.ward_no}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography variant='h6' style={{color:'#023E8A'}}>Permanent Address</Typography>
                <Toolbar>

                    <Checkbox checked={same_add} onClick={handleSame} />
                    <Typography>Same as present address</Typography>
                </Toolbar>
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="p_vill"
                            error={err.p_vill}
                            required
                            fullWidth
                            label="vill"
                            type="text"
                            value={data.p_vill}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: same_add }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="p_ps"
                            error={err.p_ps}
                            required
                            fullWidth
                            label="PS"
                            type="text"
                            value={data.p_ps}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: same_add }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="p_po"
                            error={err.p_po}
                            required
                            fullWidth
                            label="PO"
                            type="text"
                            value={data.p_po}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: same_add }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="p_pin"
                            error={err.p_pin}
                            required
                            fullWidth
                            label="PIN"
                            type="number"
                            value={data.p_pin}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: same_add }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="p_dist"
                            error={err.p_dist}
                            required
                            fullWidth
                            label="Dist"
                            type="text"
                            value={data.p_dist}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: same_add }}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography style={{color:'#023E8A'}}>Bank Details</Typography>
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_ac_no"
                            error={err.bank_ac_no}
                            fullWidth
                            label="Bank AC No"
                            value={data.bank_ac_no}
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_name"
                            error={err.bank_name}
                            fullWidth
                            label="Bank name"
                            value={data.bank_name}
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_branch"
                            error={err.bank_branch}
                            fullWidth
                            label="Branch"
                            value={data.bank_branch}
                            type="text"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="bank_other_det"
                            error={err.bank_other_det}
                            fullWidth
                            label="IFSC CODE"
                            value={data.bank_other_det}
                            type="text"
                            onChange={handleChange}
                            multiline
                        />
                    </Grid>
                </Grid>

            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography style={{color:'#023E8A'}}>Membership Details</Typography>
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="member_acno"
                            fullWidth
                            label="Member A/C No."
                            type="text"
                            value={data.member_acno}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="member_fee"
                            fullWidth
                            label="Membership Fee"
                            type="text"
                            value={data.member_fee}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper variant='outlined' style={{ marginTop: 10, padding: 10 }}>
                <Typography style={{color:'#023E8A'}}>Nominee Details</Typography>
                <Grid container style={{ marginTop: 10 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="nominee"
                            error={err.nominee}

                            fullWidth
                            label="Nominee Name"

                            type="text"
                            value={data.nominee}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="rel_moninee"
                            error={err.rel_moninee}

                            fullWidth
                            label="Relation with nominee"

                            type="text"
                            value={data.rel_moninee}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="add_of_nominee"
                            error={err.add_of_nominee}

                            fullWidth
                            label="Adress of Nominee"

                            type="text"
                            value={data.add_of_nominee}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            name="nominee_dob"
                            error={err.nominee_dob}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            label="Date Of Birth"
                            type="date"
                            value={data.nominee_dob}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Occupation</InputLabel>
                            <Select
                                variant="outlined"
                                name="n_occupation"
                                // error={err.n_occupation}


                                label="Occupation"

                                value={data.n_occupation}
                                type="text"
                                onChange={handleChange}
                            >
                                {
                                    occupation.map((item, index) =>
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>

                    </Grid>

                    {/* {
                        !id ? (
                            <Grid item xs={12} sm={6}>
                                <FormControl variant="outlined" fullWidth>
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
                                            agent.map((item, index) => {
                                                return (
                                                    <MenuItem key={index} value={item.id}>{item.ag_name}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : ''
                    } */}

                    <Grid item xs={12} sm={4}>
                        <Button variant="contained" color="primary"
                            className={Style.button}
                            size="large"
                            onClick={onSubmit}
                            disabled={disabled}
                        >
                            
                            Create account
                        </Button>
                        {
                                loading ? <LoaderComponent /> : ''
                            }
                    </Grid>
                </Grid>
            </Paper>

            {
                mssg == true ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                            Registration successfull!
                        </Alert>
                    </Snackbar>
                ) : mssg == 'error' ? (
                    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                            {error}
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

const styles = makeStyles((theme) => ({
    container: {
        padding: 20,
        minHeight: '90vh'

    },
    button: {
        alignSelf: 'right',
        marginTop: 20,
        marginLeft: 50,
    }

}))



