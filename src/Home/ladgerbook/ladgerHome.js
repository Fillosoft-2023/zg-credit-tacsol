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
import { Link, Route, Switch,BrowserRouter as Router,Redirect } from "react-router-dom";
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
// import Insurence from './insurenceCollection'
import EmiIntrest from './LoanIntrestRecord'
import RdMatured from './RdLadger'
import SavRecord from './savingsRecord'
import FineCollection from './fineCollection'
const columns = [
    {
        name : "Emi collection Records",
        link : "/Home/LadgerHome/"
    },
    {
        name : "Interest collection Records",
        link : "/Home/LadgerHome/EmiIntrest"
    },
    {
        name : "Loan issue Records",
        link : "/Home/LadgerHome/LoanRecords"
    },
    {
        name : "Rd Collection Records",
        link : "/Home/LadgerHome/Rdcollect"
    },
    {
        name: "Rd Maturity Records",
        link: "/Home/LadgerHome/RdMatured"
    },
    {
        name: "TL collection Records",
        link: "/Home/LadgerHome/TaCollection"
    },
    {
        name: "TL withdrawal Records",
        link: "/Home/LadgerHome/TaMaturity"
    },
    {
        name: "Expense Records",
        link: "/Home/LadgerHome/Expence"
    },
    {
        name: "Property Buy Records",
        link: "/Home/LadgerHome/PropertyBuy"
    },
    {
        name: "Share capital Records",
        link: "/Home/LadgerHome/ShareCapital"
    },
    {
        name: "Share addmisson Records",
        link: "/Home/LadgerHome/ShareAdm"
    },
    {
        name: "Processing charge Records",
        link: "/Home/LadgerHome/ProcessingCharge"
    },
    {
        name: "RD  Records",
        link: "/Home/LadgerHome/SavRecord"
    },
    {
        name: "fine collection Records",
        link: "/Home/LadgerHome/FineCollection"
    },
    // {
    //     name: "Insurence records",
    //     link: "/Home/LadgerHome/Insurence"
    // }

    
]

export default function LadgerHome (props){
    console.log(props.match.path)
    const classess = useStyle()
    const [selected, setSelect] = React.useState(null)
    const updateSelected = (selectedIndex)=>{
        setSelect(selectedIndex)
        
        
    }

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
                                <ListItem key={index} onClick={()=>updateSelected(index)} selected={selected === index}>
                                    <ListItemText primary={item.name} />
                                    
                                    <ListItemIcon>
                                        <Link to={item.link} style={{textDecoration: 'none'}}>
                                        <IconButton size="small" onClick={()=>updateSelected(index)}>
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
                    {/*<Route path={`${props.match.path}/Insurence`} component={Insurence} />*/}
                    <Route path={`${props.match.path}/EmiIntrest`} component={EmiIntrest} />
                    <Route path={`${props.match.path}/RdMatured`} component={RdMatured} />
                    <Route path={`${props.match.path}/SavRecord`} component={SavRecord} />
                    <Route path={`${props.match.path}/FineCollection`} component={FineCollection} />
                    <Route render={() => <Redirect to="/Home/LadgerHome/"/>}/>
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

