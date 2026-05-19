import React from 'react'
import {
    Grid,
    Container,
    Button,
    Divider,
    Toolbar,
    Paper,
    Menu,
    MenuItem,
    Typography
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles'
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Api from '../../api/api';
import { Chat, CollectionsTwoTone, HowToReg, } from '@material-ui/icons';
import ExistingHolder from './existingCustomer';
import ResgisteredMem from './newCustomer';
import CustomerLoanApp from './customerLoanApp';
import CreateLoanDisstructured from '../loan_ac/create_loan_dissturctured';
import CustomerRdApp from './customerRdApp';
import CreateSav from '../savings/createSav';
import CustomerSavingsApp from './CustomerSavingsApp';
import CreateSavings from '../MAINSAV/createSavings';
import CustomerPayments from './customerPayments';
import CustomerLoanPayments from './customerLoanPayment';
import CustomerSavingsPayments from './customerSavingsPayments';
import CustomerRdPayments from './customerRdPayment';
import CustomerDetails from './customerDetails';
import CustomerChat from './customerChat';
import MemberDetails from '../members/memberDetails';
import CustomerFdApp from './CustomerFdApp';
export default function CustomerHome(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
    const [menu, setMenu] = React.useState(null)
    const menuOpen = Boolean(menu)
    React.useEffect(() => {
        fetch(Api + 'allCustomers')
            .then(res => res.json())
            .then(data => setExisting(data))
            .catch(err => console.log(err))

    }, ['emoloye'])
    return (
        <Router>
            {
                existingData.length === 0 ? (
                    <div></div>
                ) : (
                    <Container maxWidth={'false'} style={{ padding: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant='h6' style={{ textAlign: 'center', fontWeight: 'bold', color: '#303F9F' }}>
                                Customer App Dashboard
                            </Typography>
                        </Toolbar>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <Paper variant='outlined'>
                                    <Toolbar style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold', color: '#303F9F' }}>
                                            Existing App Users
                                        </Typography>
                                    </Toolbar>
                                    <hr />
                                    <Toolbar style={{ margin: 0, paddingLeft: 5, overflow: 'auto', display: 'flex', justifyContent: 'right' }}>
                                        <div>
                                            <Link to={props.match.path + '/CustomerPayments'} style={{ textDecoration: 'none' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<CollectionsTwoTone />}
                                                    className={classes.addButton}
                                                    size='small'
                                                    disableElevation
                                                    style={{ marginRight: 10 }}
                                                >
                                                    Payments
                                                </Button>
                                            </Link>
                                            {/* <Link to={props.match.path + '/CustomerChat'} style={{ textDecoration: 'none' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Chat />}
                                                    className={classes.addButton}
                                                    size='small'
                                                    disableElevation
                                                    style={{marginRight:10}}
                                                >
                                                    Support
                                                </Button>
                                            </Link> */}
                                            <Button onClick={(e) => setMenu(e.currentTarget)} variant='outlined' color='primary' size='small' className={classes.addButton}>
                                                More
                                            </Button>
                                        </div>
                                    </Toolbar>
                                </Paper>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/CustomerLoanApp`} component={CustomerLoanApp} />
                                    <Route path={`/Home/LoanHome/CreateLoanDisstructured`} component={CreateLoanDisstructured} />
                                    <Route path={`${props.match.path}/CustomerRdApp`} component={CustomerRdApp} />
                                    <Route path={`/Home/SavHome/CreateSav`} component={CreateSav} />
                                    <Route path={`${props.match.path}/CustomerSavingsApp`} component={CustomerSavingsApp} />
                                    <Route path={`${props.match.path}/CustomerFdApp`} component={CustomerFdApp} />
                                    <Route path={`/Home/SavMainHome/CreateSavings`} component={CreateSavings} />
                                    <Route path={`${props.match.path}/CustomerPayments`} component={CustomerPayments} />
                                    <Route path={`${props.match.path}/CustomerLoanPayments`} component={CustomerLoanPayments} />
                                    <Route path={`${props.match.path}/CustomerSavingsPayments`} component={CustomerSavingsPayments} />
                                    <Route path={`${props.match.path}/CustomerRdPayments`} component={CustomerRdPayments} />
                                    <Route path={`${props.match.path}/CustomerDetails`} component={CustomerDetails} />
                                    <Route path={`${props.match.path}/CustomerChat`} component={CustomerChat} />
                                    <Route path={`/Home/MemberDetails`} component={MemberDetails} />

                                </Switch>
                            </Grid>
                        </Grid>
                    </Container>
                )
            }
            <Menu
                open={menuOpen}
                anchorEl={menu}
                onClose={() => setMenu(null)}
            >
                {/* <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <AddCircleIcon />
                        Create New Customer
                    </Link>
                </MenuItem> */}
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CustomerPayments'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <AddCircleIcon />
                        Payments
                    </Link>
                </MenuItem>
                <Divider />

                {/* <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/NewRegistrations'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New Registration Request
                    </Link>
                </MenuItem> */}
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CustomerLoanApp'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New Loan Applications
                    </Link>
                </MenuItem>
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CustomerRdApp'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New RD Applications
                    </Link>
                </MenuItem>
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CustomerSavingsApp'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New Savings Applications
                    </Link>
                </MenuItem>
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CustomerFdApp'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New FD Applications
                    </Link>
                </MenuItem>

            </Menu>
        </Router>
    )
}

const useStyle = makeStyles(() => ({
    leftContain: {
        padding: 5,
        minHeight: '80vh',
    },
    existinMem: {
        marginTop: 20,
    },
    addButton: {
        marginBottom: 10
    }
}))