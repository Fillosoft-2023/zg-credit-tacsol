import { Box, Button, CircularProgress, Container,Divider,IconButton,Paper, TextField, Toolbar, Typography } from "@material-ui/core";
import { ArrowBack, Save } from "@material-ui/icons";
import { useState } from "react";
import Api from "../../api/api";
import { useHistory } from "react-router-dom";
import SnakBar from "../../consts/message";




export default function AddBranch(){
    const navigate = useHistory()
    const [formData, setFormData] = useState({})
    const [err, setErr] = useState({})
    const [massg, setMassg] = useState({})
    const [loading, setLoading] = useState(false)
    const onChange = (e)=>{
        setFormData({ 
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    const validate = ()=>{
        let valid  = true
        let errors = {}

        if(!formData.branch_name){
            valid = false
            errors['branch_name'] = true
        }
        if(!formData.branch_code){
            valid = false
            errors['branch_code'] = true
        }
        if(!formData.branch_add){
            valid = false
            errors['branch_add'] = true
        }
        
        if(!formData.password){
            valid = false
            errors['password'] = true
        }
        if(!formData.m_password){
            valid = false
            errors['m_password'] = true
        }
        setErr(errors)
        return valid
    }

    const onSubmit = ()=>{
        if(validate()){
            setLoading(true)
            fetch(Api+'add_branch',{
                method : 'POST',
                body : JSON.stringify(formData)
            })
            .then(res=>res.json())
            .then(res=>{
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
            <Typography>Add New Branch</Typography>
           </div>
        </Toolbar>
        <Divider />
        <Container maxWidth="sm" style={{padding : 10}}>
            <TextField
                variant="outlined"
                label="Branch Name"
                value={formData.branch_name}
                onChange={onChange}
                name="branch_name"
                error={err.branch_name}
                margin="normal"
                required
                fullWidth
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
            />
            <TextField
                variant="outlined"
                label="Branch Address"
                value={formData.branch_add}
                onChange={onChange}
                name="branch_add"
                error={err.branch_add}
                margin="normal"
                required
                fullWidth
            />
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
            <Button disabled={loading} onClick={onSubmit} color="primary" variant="contained">
                Save {loading ? <CircularProgress size={18} /> : <Save />}
            </Button>
        </Container>
        <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}