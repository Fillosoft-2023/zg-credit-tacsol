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
    makeStyles,
    Menu,
    MenuItem,
    Typography,
    Toolbar
} from '@material-ui/core'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EmiCollect from './emiCollection'
import LoanRecords from './loanRecords'
import Rdcollect from './rdcollection'
import TaCollection from './taCollection'
import TaMaturity from './taMaturity'
import Expence from './expenceNew'
import PropertyBuy from './propertyBuy'
import ShareCapital from './shareCapital'
import ShareAdm from './shareAdmisson'
import ProcessingCharge from './processingcollection'
// import Insurence from './insurenceCollection'
import EmiIntrest from './LoanIntrestRecord'
import RdMatured from './RdLadger'
import SavRecord from './savingsRecord'
import FineCollection from './fineCollection'
import BankWithdrwal from './bankWithdrwal'
import BankDeposit from './bankDeposit'
import SavRecordWith from './savingsWith'
import SavRecordInt from './savingsIntrest'
import RdInterest from './RdInterst'
import TaInterest from './TaIntrest'
import BankInterest from './bankInterst'
import { useHistory } from 'react-router-dom'
import PropExpence from './propertyExpence'
import SavingsAdmission from './savingsAdmission'
import SavRecordMain from './savingsRecordMain';
import SavRecordWithMain from './savingsWithdrawlMain';
const columns = [
    {
        name: "Admisson Fee Receipt",
        link: "/Home/LadgerHome/ShareAdm"
    },
    {
        name: "Share Capital Receipt",
        link: "/Home/LadgerHome/ShareCapital"
    },
    {
        name: "RD Of Member",
        link: "/Home/LadgerHome/SavRecord"
    },
    {
        name: "Savings Of Member",
        link: "/Home/LadgerHome/SavRecordMain"
    },
    {
        name: "Bank interest Receipt",
        link: "/Home/LadgerHome/BankInterest" //bonaba lagibo
    },
    {
        name: "TL Receipt",
        link: "/Home/LadgerHome/TaCollection"
    },
    {
        name: "Loan capital Receipt ",
        link: "/Home/LadgerHome/" //emi collecction records ahi ase only principle collection record koribo lagibo
    },
    {
        name: "Interest Receipt",
        link: "/Home/LadgerHome/EmiIntrest"
    },
    {
        name: "Processing fee Receipt",
        link: "/Home/LadgerHome/ProcessingCharge"
    },
    {
        name: "Fine Receipt",
        link: "/Home/LadgerHome/FineCollection"
    },
    {
        name: "Expense",
        link: "/Home/LadgerHome/Expence"
    },
]
const disbursement = [
    {
        name: "Bank withdrawal",
        link: "/Home/LadgerHome/bankWithdrwal"  //bonaba lagibo
    },
    {
        name: "Loan issued to member",
        link: "/Home/LadgerHome/LoanRecords"
    },
    {
        name: "RD  withdrawal/Maturity",
        link: "/Home/LadgerHome/SavRecordWith"
    },
    {
        name: "Savings  withdrawal/Maturity",
        link: "/Home/LadgerHome/SavRecordWithMain"
    },
    {
        name: "Interest paid on RD",
        link: "/Home/LadgerHome/SavRecordInt"
    },
    {
        name: "TL withdrawal maturity",
        link: "/Home/LadgerHome/TaMaturity"
    },
    {
        name: "Interest paid on TL",
        link: "/Home/LadgerHome/TaInterest"
    },
    {
        name: "Bank deposit",
        link: "/Home/LadgerHome/BankDeposit" //bhag koriba lagibo
    },
    {
        name: "Property Purchased",
        link: "/Home/LadgerHome/PropExpence"
    },
]

const expence = [
    {
        name: "Property Buy",
        value: "property buy"
    },
    {
        name: "Managment Expenditure",
        value: "managment"
    },
    {
        name: "Room rent",
        value: "rent"
    },
    {
        name: "Electricity Bill",
        value: "electricity"
    },
    {
        name: "Donation",
        value: "donation"
    },
    {
        name: "Food Expenditure",
        value: "food"
    },
    {
        name: "Salary Paid",
        value: "salary"
    },
    {
        name: "Managment Expenditure",
        value: "managment"
    },
    {
        name: "Travelling Alounces",
        value: "travelling"
    },
    {
        name: "Meeting expences",
        value: "meeting"
    },
    {
        name: "Audit fee",
        value: "Agent commission"
    },
    {
        name: "Other",
        value: "Other expences"
    },
]

export default function LadgerHome(props) {
    console.log(props.match.path)
    const history = useHistory()
    const classess = useStyle()
    const [selected, setSelect] = React.useState(null)
    const updateSelected = (selectedIndex) => {
        setSelect(selectedIndex)


    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Router>
            <Container maxWidth="false" style={{ padding: 0 }}>
                <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                    <Typography variant='h6' style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        GENERAL LEDGER
                    </Typography>
                </Toolbar>

                <Grid container spacing={0}>
                    <Grid item xs={12} sm={3}>
                        <Paper className={classess.leftSide}>
                            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    Receipts
                                </Typography>
                            </Toolbar>
                            <List>
                                {
                                    columns.map((item, index) => {
                                        return (
                                            <div>

                                                <ListItem key={index} onClick={() => updateSelected(index)} selected={selected === index}>

                                                    <ListItemText primary={item.name} />

                                                    <ListItemIcon>


                                                        <Link to={item.link} style={{ textDecoration: 'none' }}>
                                                            <IconButton size="small" onClick={() => updateSelected(index)}>
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
                                <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        Disbursement
                                    </Typography>
                                </Toolbar>
                                {
                                    disbursement.map((item, index) => {
                                        return (
                                            <div>

                                                <ListItem key={index} onClick={() => updateSelected(index)} selected={selected === index}>

                                                    <ListItemText primary={item.name} />

                                                    <ListItemIcon>


                                                        <Link to={item.link} style={{ textDecoration: 'none' }}>
                                                            <IconButton size="small" onClick={() => updateSelected(index)}>
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
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >{
                                        expence.map((item, index) => {
                                            const random = Math.random()

                                            return (
                                                <>

                                                    <MenuItem key={index} style={{ width: '100%' }} >

                                                        {item.name}
                                                        <Link to={{ pathname: "/Home/LadgerHome/Expence/", data: item, random: random }} style={{ textDecoration: 'none', color: '#000', display: 'flex' }}>
                                                            <IconButton style={{ float: 'right' }} size="small" >
                                                                <ChevronRightIcon />
                                                            </IconButton>
                                                        </Link>
                                                        <Divider />
                                                    </MenuItem>
                                                </>


                                            )
                                        })
                                    }

                                </Menu>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Switch>
                            <Route exact path={props.match.path} component={EmiCollect} />
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
                            <Route path={`${props.match.path}/SavRecordMain`} component={SavRecordMain} />

                            <Route path={`${props.match.path}/FineCollection`} component={FineCollection} />
                            <Route path={`${props.match.path}/bankWithdrwal`} component={BankWithdrwal} />
                            <Route path={`${props.match.path}/BankDeposit`} component={BankDeposit} />
                            <Route path={`${props.match.path}/SavRecordWith`} component={SavRecordWith} />
                            <Route path={`${props.match.path}/SavRecordWithMain`} component={SavRecordWithMain} />

                            <Route path={`${props.match.path}/SavRecordInt`} component={SavRecordInt} />
                            <Route path={`${props.match.path}/RdInterest`} component={RdInterest} />
                            <Route path={`${props.match.path}/TaInterest`} component={TaInterest} />
                            <Route path={`${props.match.path}/BankInterest`} component={BankInterest} />
                            <Route path={`${props.match.path}/PropExpence`} component={PropExpence} />
                            <Route path={`${props.match.path}/SavingsAdmission`} component={SavingsAdmission} />
                            <Route render={() => <Redirect to="/Home/LadgerHome/" />} />
                        </Switch>
                    </Grid>
                </Grid>
            </Container>
        </Router>
    )
}

const useStyle = makeStyles(() => ({
    leftSide: {
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

