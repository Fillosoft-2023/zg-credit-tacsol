import React from 'react'
import {
    makeStyle,
    Grid,
    Container,
    IconButton,
    Button,
    Divider
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {makeStyles} from '@material-ui/styles'
import ExistingHolder from './existing_mem'
import { Link, Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
import ResgisteredFdMem from './new_fund'
import {useHistory} from 'react-router-dom'
// import sendAsync from './../../backend/renderer'
import FdHolDet from './funHolderDet'
import ProfileModify from './profileModify'
import TaModify from './fund_modify'
import FdLadgerBook from './fund_ladger';
import CreateFund from './create_fund';
export default function FundHome(props){
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
 
    React.useEffect(()=>{
    
        // sendAsync('allFund').then((result)=>{
        //     setExisting(result);
            
        // })
       
    
},['fund'])

    

    return (
        <Router>
        {
            existingData.length === 0 ? (
                <div></div>
            ) : (
                
        <Container maxWidth={'xxl'} style={{marginTop: 15,height:'100%',padding: 0}}>
        <Grid container spacing={0} style={{height: '100%'}} >
            <Grid item xs={12} sm={4} className={classes.leftContain}>
                <Link to={props.match.path} style={{textDecoration: 'none'}}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    className={classes.addButton}

                   
                >
                    Create new Fund
                </Button>
                </Link>
                 <ExistingHolder className={classes.existinMem} callback={existingData.data2} /> 
            </Grid>
            <Grid item xs={12} sm={8} className={classes.leftContain} >
            <Switch>
            <Route exact  path={props.match.path}  component={() => (<ResgisteredFdMem myProp={existingData.data} />)} />
            <Route path={`${props.match.path}/CreateFd`} component={CreateFund} /> 
            <Route path={`${props.match.path}/FdHolDet`} component={FdHolDet} />
            <Route path={`${props.match.path}/ProfileModify`} component={ProfileModify} /> 
            <Route path={`${props.match.path}/TaModify`} component={TaModify} /> 
            <Route path={`${props.match.path}/FdLadgerBook`} component={FdLadgerBook} />
            <Route render={() => <Redirect to="/Home/FdHome/"/>}/>
            </Switch>
            </Grid>
        </Grid>
        </Container>
        
            )
        }
        </Router>
    )
}

const useStyle = makeStyles(()=>({
    leftContain: {
        padding: 5,
        height: '87%',
    
        
           
         
        
    },
    existinMem : {
        marginTop: 20,
    },
    addButton: {
        marginBottom: 10
    }
}))