import React from 'react'
import {
    Paper,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    makeStyles
} from '@material-ui/core'
import { Link, Route, Switch,BrowserRouter as Router } from "react-router-dom";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EmiCollect from './emiCollection'
import LoanRecords from './loanRecords'
import Rdcollect from './rdcollection'
import TaCollection from './taCollection'
import TaMaturity from './taMaturity'
import Expence from './expence'
import PropertyBuy from './propertyBuy'
import ShareCapital from './shareCapital'
import ShareAdm from './shareAdmisson'
import ProcessingCharge from './processingcollection'
import Insurence from './insurenceCollection'
import EmiIntrest from './LoanIntrestRecord'
const columns = [
    {
        name : "Emi collection Record",
        link : "/Home/LadgerHome/"
    },
    {
        name : "Interest collection Record",
        link : "/Home/LadgerHome/EmiIntrest"
    },
    {
        name : "Loan issue record",
        link : "/Home/LadgerHome/LoanRecords"
    },
    {
        name : "Rd Collection Record",
        link : "/Home/LadgerHome/Rdcollect"
    },
    {
        name: "Rd Maturity Record",
        link: "/LadgerHome/Rdcollection"
    },
    {
        name: "Ta collection Record",
        link: "/Home/LadgerHome/TaCollection"
    },
    {
        name: "Ta Maturity Record",
        link: "/Home/LadgerHome/TaMaturity"
    },
    {
        name: "Expenxe Records",
        link: "/Home/LadgerHome/Expence"
    },
    {
        name: "Property Buy Records",
        link: "/Home/LadgerHome/PropertyBuy"
    },
    {
        name: "Share capital records",
        link: "/Home/LadgerHome/ShareCapital"
    },
    {
        name: "Share addmisson records",
        link: "/Home/LadgerHome/ShareAdm"
    },
    {
        name: "Processing charge records",
        link: "/Home/LadgerHome/ProcessingCharge"
    },
    {
        name: "Insurence records",
        link: "/Home/LadgerHome/Insurence"
    }

    
]

export default function LadgerHome (props){
    console.log(props.match.path)
    const classess = useStyle()

    return (
        <Router>
        <Container maxWidth="lg" style={{marginTop: 15}}>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={3}>
                <Paper className={classess.leftSide}>
                <List>
                {
                    columns.map((item,index)=>{
                        return (
                            <div>
                                <ListItem key={index}>
                                    <ListItemText primary={item.name} />
                                    
                                    <ListItemIcon>
                                        <Link to={item.link} style={{textDecoration: 'none'}}>
                                        <IconButton size="small">
                                             <ChevronRightIcon />
                                        </IconButton>
                                        </Link> 
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                            </div>
                        )
                    })
                }
                </List>
                </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                <Switch>
                    <Route exact  path={props.match.path}  component={EmiCollect} />
                    <Route path={`${props.match.path}/LoanRecords`} component={LoanRecords} /> 
                    <Route path={`${props.match.path}/Rdcollect`} component={Rdcollect} /> 
                    <Route path={`${props.match.path}/TaCollection`} component={TaCollection} />
                    <Route path={`${props.match.path}/TaMaturity`} component={TaMaturity} />
                    <Route path={`${props.match.path}/Expence`} component={Expence} />
                    <Route path={`${props.match.path}/PropertyBuy`} component={PropertyBuy} />
                    <Route path={`${props.match.path}/ShareCapital`} component={ShareCapital} />
                    <Route path={`${props.match.path}/ShareAdm`} component={ShareAdm} />
                    <Route path={`${props.match.path}/ProcessingCharge`} component={ProcessingCharge} />
                    <Route path={`${props.match.path}/Insurence`} component={Insurence} />
                    <Route path={`${props.match.path}/EmiIntrest`} component={EmiIntrest} />
                </Switch>
                </Grid>
            </Grid>
        </Container>
        </Router>
    )
}

const useStyle = makeStyles(()=>({
    leftSide : {
        height: '85vh',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          
          backgroundColor: 'rgba(0,0,0,0,0)'
        },
        
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          
          borderRadius: 4,
         
        },
    }
}))

