import React,{useState} from 'react'
import {
    makeStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Container,
    Grid,
    Button
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {useHistory} from 'react-router-dom'

import AddShareMem from './new_share_add'
import ExistingMem from './existingMem'
import ShareMemDet from './share_mem_det'
import { Link, Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
export default function Share_reg(props){
    const history = useHistory();
    const classes = style();
    
 
   
    return(
        <Router>
        <Container maxWidth={'lg'} className={classes.container}>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={4} className={classes.leftCont}>
                 <AddShareMem />
                 <ExistingMem />
                </Grid>
                <Grid item xs={12} sm={8}>
                <Switch>
                <Route exact path={props.match.path} component={AddShareMem} />
                <Route path={`${props.match.path}/test`} component={ShareMemDet} />
                <Route render={() => <Redirect to="/Home/Share_reg/"/>}/>
                </Switch>
                </Grid>
            </Grid>
        </Container>
        </Router>
    )
}

const style = makeStyles(()=> ({
    container : {
        backgroundColor: '#f7f7f7',
        padding: 20,
        
        
    },
    leftCont : {
        backgroundColor: '#fff',
        justifyContent: 'center',
        boxShadow: '0 1px 3px 2px rgba(0, 0, 0, .2)',
        borderRadius: 2
    }
}))