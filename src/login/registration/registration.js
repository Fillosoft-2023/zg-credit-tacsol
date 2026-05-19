import React,{useState,useEffect} from 'react';
import { TextField, makeStyles,Typography,FormGroup,FormLabel,Grid,Button} from '@material-ui/core'
import logo from './../../assets/logo.png'
import imageCompression from 'browser-image-compression'
import {useHistory} from 'react-router-dom'
export default function Registration(){
    const Style = Styles();
    const history = useHistory();
    const [state, setState] = useState({
        
    })
    const [error, setError] = useState({});
    
   
    const onSubmit = (event)=> {
        event.preventDefault()
        
        
        if(validate()){
            // send(state).then((res)=> {
            //     if(Array.isArray(res)){
            //         history.push('/Login')
            //     }else {
            //         alert(res)
            //     }
            // })
        }
    }

    
    
    const handleChnage = (event)=> {
        let name = event.target.name
        let value = event.target.value
        

        setState({
            ...state,
            [name] : value,
            "press" : "com_registration",
            
        })        
    }

    const handleImage =  (event)=> {

        if(event.target.files[0].type === 'image/png' || 'image/jepg' || 'image/jpg'){
            var imageFile = event.target.files[0];
            var imageName = event.target.files[0].name;
            Object.assign(state, {'image_name' : imageName})
            var options = {
                maxSizeMB: 0.100,
                maxWidthOrHeight: 1000,
                useWebWorker: false
            }
            imageCompression(imageFile, options)
                .then(function (compressedFile) {
                console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                console.log(`compressedFile size ${compressedFile.size} kB`); // smaller than maxSizeMB
                

                let  array = compressedFile.arrayBuffer()

                array.then(
                    function(value){
                        let test = new Uint8Array(value, 'binary')
                        Object.assign(state, {image : test})
                    }
                )

                


                })
                .catch(function (error) {
                console.log(error.message);
                });
              

                
        }


    }
    
    const validate = ()=> {
        let error = {}
        let isValid = true
        if(!state.name){
            isValid = false
            error['name'] = true
          
        }
        if(!state.rno){
            isValid = false
            error['rno'] = true
        }
        if(!state.lpassword){
            isValid = false
            error['lpassword'] = true
        }
        if(!state.lconfirmp){
            isValid = false
            error['lconfirmp'] = true
        }
        if(!state.mpassword){
            isValid = false
            error['mpassword'] = true
        }
        if(!state.mpasswordc){
            isValid = false
            error['mpasswordc'] = true
        }
        
        if(state.lpassword != state.lconfirmp){
            isValid = false
            error['lconfirmp'] = true
        }
        if(state.mpassword != state.mpasswordc){
            isValid = false
            error['mpasswordc'] = true
        }
        if(!state.place){
            isValid = false
            error['place'] = true
        }
      
        if(!state.image && !state.image_name){
                 isValid = false
                 error['logo'] = true
        }
        
        
        setError(error)
        
       return isValid;
    }
    
  
    return(
        <div className={Style.container}>
            <div className={Style.form}>
            <div className={Style.regHead}>
                <img src={logo} className={Style.logo} />
                <Typography className={Style.logoHead}>Well come thriftSolution</Typography>
            </div>
                <form className={Style.formMain} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="name"
                            variant="outlined"
                            name="name"
                            error={error.name}
                            required
                            fullWidth
                            label="Society Name"
                            autoFocus
                            value={state.name}
                            onChange={handleChnage}
                            type="text"
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="rno"
                            variant="outlined"
                            name="rno"
                            required
                            fullWidth
                            label="Registration No"
                            autoFocus
                            type="text"
                            error={error.rno}
                            value={state.regNo}
                            onChange={handleChnage}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="lpassword"
                            name="lpassword"
                            variant="outlined"
                            required
                            fullWidth
                            id="password"
                            error={error.lpassword}
                            label="Login Password"
                            autoFocus
                            type="password"
                            value={state.lpassword}
                            onChange={handleChnage}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="lconfirmp"
                            name="lconfirmp"
                            
                            variant="outlined"
                            required
                            fullWidth
                            id="lconformp"
                            label="Confirm Login Password"
                            autoFocus
                            type="password"
                            value={state.lconfirmp}
                            error={error.lconfirmp}
                            onChange={handleChnage}
                        />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="mpassword"
                            name="mpassword"
                            variant="outlined"
                            required
                            fullWidth
                            id="mpassword"
                            label="Master Password"
                            autoFocus
                            type="password"
                            error={error.mpassword}
                            value={state.mpassword}
                            onChange={handleChnage}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="mpasswordc"
                            name="mpasswordc"
                            variant="outlined"
                            required
                            fullWidth
                            id="mpasswordc"
                            label="Master Password Confirm"
                            autoFocus
                            type="password"
                            value={state.mpasswordc}
                            error={error.mpasswordc}
                            
                            onChange={handleChnage}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            autoComplete="logo"
                            name="logo"
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            label="logo"
                            autoFocus
                            type="file"
                            value={state.logo}
                            error={error.logo}
                            onChange={handleImage}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="place"
                            name="place"
                            variant="outlined"
                            required
                            fullWidth
                            id="place"
                            label="Place"
                            autoFocus
                            type="password"
                            value={state.place}
                            error={error.place}
                            
                            onChange={handleChnage}
                        />
                        </Grid>
                        
                    </Grid>
                    <Button variant="contained" type="submit" size="large" 
                        fullWidth className={Style.submitButton} 
                        color="primary"
                        onClick={onSubmit}
                    >
                    Primary
                    </Button>
                </form>
            </div>
        </div>
    )
}


const Styles = makeStyles({
    container : {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        height: '100%'
    },
    form : {
        width: 500,
        height: 'auto',
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 15,
        
    },
    logo : {
        width: '12%',
        marginLeft: '44%',

    },
    regHead : {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        
    },
    logoHead : {
        textAlign: 'center'
    },
    formMain : {
        
        marginTop: 20
    },
    submitButton : {
        marginTop: 20,
    }
})