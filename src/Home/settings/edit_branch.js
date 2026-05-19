import { Box, Button, CircularProgress, Container,Divider,FormControlLabel,IconButton,Paper, TextField, Toolbar, Typography, Checkbox } from "@material-ui/core";
import { ArrowBack, Save } from "@material-ui/icons";
import { useState } from "react";
import Api from "../../api/api";
import { useHistory } from "react-router-dom";
import SnakBar from "../../consts/message";





export default function EditBranch(props){
    const navigate = useHistory()
    const [formData, setFormData] = useState(props.location.state.selected)
    const [err, setErr] = useState({})
    const [massg, setMassg] = useState({})
    const [loading, setLoading] = useState(false)
    const [check_box, setCheakBox] = useState(false)
    const onChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }
   
    console.log(formData)
    const validate = ()=>{
        let valid  = true
        let errors = {}

        if(!formData.name){
            valid = false
            errors['name'] = true
        }
        if(!formData.branch_code){
            valid = false
            errors['branch_code'] = true
        }
        if(!formData.address){
            valid = false
            errors['address'] = true
        }
        
        // if(!formData.password){
        //     valid = false
        //     errors['password'] = true
        // }
        // if(!formData.m_password){
        //     valid = false
        //     errors['m_password'] = true
        // }
        setErr(errors)
        return valid
    }

    const onSubmit = ()=>{
        if(validate()){
            setLoading(true)
            fetch(Api+'EditBranch',{
                method : 'POST',
                body : JSON.stringify({...formData,pass_change : check_box})
            })
            .then(res=>res.json())
            .then(res=>{
                console.log(res)
                setLoading(false)
                if(res.code === 200){
                    setMassg({
                        open : true,
                        severity : 'success',
                        massg : 'Branch Add Successfull'
                    })
                }else{
                    setMassg({
                        open : true,
                        severity : 'error',
                        massg : 'Something went wrong'
                    })
                }
            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
                setMassg({
                    open : true,
                    severity : 'error',
                    massg : 'Faild to connect to the server'
                })
            })
        }
    }
    return(
        <Container component={Paper} variant="outlined">
        <Toolbar>
           <div style={{display : 'flex',alignItems : 'center'}}>
            <IconButton>
                <IconButton onClick={()=>navigate.goBack()}>
                    <ArrowBack />
                </IconButton>
            </IconButton>
            <Typography>Edit Branch {formData.name}</Typography>
           </div>
        </Toolbar>
        <Divider />
        <Container maxWidth="sm" style={{padding : 10}}>
            <TextField
                variant="outlined"
                label="Branch Name"
                value={formData.name}
                onChange={onChange}
                name="name"
                error={err.name}
                margin="normal"
                required
                fullWidth
                InputLabelProps={{shrink : true}}
            />
            <TextField
                variant="outlined"
                label="Branch Code"
                value={formData.branch_code}
                onChange={onChange}
                name="branch_code"
                error={err.branch_code}
                margin="normal"
                required
                fullWidth
                InputLabelProps={{shrink : true}}
                disabled
            />
            <TextField
                variant="outlined"
                label="Branch Address"
                value={formData.address}
                onChange={onChange}
                name="address"
                error={err.address}
                margin="normal"
                required
                fullWidth
                InputLabelProps={{shrink : true}}
            />

            <FormControlLabel required control={<Checkbox onChange={()=>setCheakBox(!check_box)} />} label="Change Password also" />
            {
                check_box ? (
                    <>
                        <TextField
                            variant="outlined"
                            label="Login PassWord"
                            value={formData.password}
                            onChange={onChange}
                            name="password"
                            error={err.password}
                            margin="normal"
                            required
                            fullWidth
                        />
                        <TextField
                            variant="outlined"
                            label="Master PassWord"
                            value={formData.m_password}
                            onChange={onChange}
                            name="m_password"
                            error={err.m_password}
                            margin="normal"
                            required
                            fullWidth
                        />
                    </>
                ) : ''
            }
            <br />
            <Button disabled={loading} onClick={onSubmit} color="primary" variant="contained">
                Save {loading ? <CircularProgress size={18} /> : <Save />}
            </Button>
        </Container>
        <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}