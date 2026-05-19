import React from 'react'
import {
    makeStyle,
    Grid,
    Container,
    IconButton,
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
import { useHistory } from 'react-router-dom'
import ExistingHolder from './existingemploye'
import ResgisteredMem from './newEmploye'
import EmployeDet from './employeDetails'
import EmployeLadger from './employeLadger'
import AgentColl from './emplyeeCol'
import Api from '../../api/api';
import CollectionsByAgent from '../collections_by_agent/collections';
import CollectionDetailsByAgent from '../collections_by_agent/collection_details';
import CollectionDetailsBySavings from '../collections_by_agent/savings_details';
import { AllInboxRounded, Collections, CollectionsBookmarkOutlined, CollectionsTwoTone, HowToReg, MoreHoriz, Report, TransferWithinAStation } from '@material-ui/icons';
import Attandance from './attandance';
import AttendanceCalendar from './attandance_records';
import OutStandingReport from './reports/outstanding_report';
import NewRegistrations from './other/new_registration';
import NewLoanApproval from './other/loan_approval';
import RdCollectionDetails from './rdCollectionDetails';
import LoanCollectionDetails from './loanCollectionDetails';
import OutstandingReportDetails from './reports/outstandingReportDetails';
import Settings from '@material-ui/icons/Settings';
import EmployeeSettings from './settings';
import AllAgentCollections from './allAgentCollections';
import CollectionDetailsByRd from '../collections_by_agent/rdDetails';
import SavingsCollectionDetails from './savingsCollectionDetails';
import AgentTransferMaster from './masterPassAgentTransfer';
import AgentTransfer from './agentTransfer';
import LoanAgentTransfer from './loanAgentTransfer';
import SavingsAgentTransfer from './SavingsAgentTransfer';
import RdAgentTransfer from './RdAgentTransfer';
import FdAgentTransfer from './fdAgentTransfer';
export default function EmployHome(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
    const [menu, setMenu] = React.useState(null)
    const menuOpen = Boolean(menu)
    React.useEffect(() => {

        fetch(Api + 'allEmploye')
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
                            <Typography variant='h6' style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Employee Dashboard
                            </Typography>
                        </Toolbar>

                        <Grid container spacing={0}  >
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <Paper variant='outlined'>
                                    <Toolbar style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                                        <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                            Employee Manager
                                        </Typography>
                                    </Toolbar>
                                    <hr />
                                    <Toolbar style={{ margin: 0, paddingLeft: 5, overflow: 'auto' }}>
                                        <Link to={props.match.path} style={{ textDecoration: 'none' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddCircleIcon />}
                                                className={classes.addButton}
                                                style={{ marginRight: 5 }}
                                                size='small'
                                                disableElevation
                                            >
                                                New
                                            </Button>
                                        </Link>

                                        <Link to={props.match.path + '/CollectionsByAgent'} style={{ textDecoration: 'none' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CollectionsTwoTone />}
                                                className={classes.addButton}
                                                size='small'
                                                disableElevation
                                            >
                                                Collections
                                            </Button>
                                        </Link>
                                        <Link to={props.match.path + '/Attandance'} style={{ textDecoration: 'none' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<HowToReg />}
                                                className={classes.addButton}
                                                size='small'
                                                disableElevation
                                                style={{ marginLeft: 5 }}
                                            >
                                                Attandance
                                            </Button>
                                        </Link>
                                        <IconButton onClick={(e) => setMenu(e.currentTarget)}>
                                            <MoreHoriz />
                                        </IconButton>
                                    </Toolbar>
                                </Paper>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/EmployeDet`} component={EmployeDet} />
                                    <Route path={`${props.match.path}/EmployeLadger`} component={EmployeLadger} />
                                    <Route path={`${props.match.path}/AgentColl`} component={AgentColl} />
                                    <Route path={`${props.match.path}/CollectionsByAgent`} component={CollectionsByAgent} />
                                    <Route path={`${props.match.path}/CollectionDetailsByAgent`} component={CollectionDetailsByAgent} />
                                    <Route path={`${props.match.path}/CollectionDetailsBySavings`} component={CollectionDetailsBySavings} />
                                    <Route path={`${props.match.path}/CollectionDetailsByRd`} component={CollectionDetailsByRd} />
                                    <Route path={`${props.match.path}/Attandance`} component={Attandance} />
                                    <Route path={`${props.match.path}/AttendanceCalendar`} component={AttendanceCalendar} />
                                    <Route path={`${props.match.path}/OutStandingReport`} component={OutStandingReport} />
                                    <Route path={`${props.match.path}/NewRegistrations`} component={NewRegistrations} />
                                    <Route path={`${props.match.path}/NewLoanApproval`} component={NewLoanApproval} />
                                    <Route path={`${props.match.path}/RdCollectionDetails`} component={RdCollectionDetails} />
                                    <Route path={`${props.match.path}/SavingsCollectionDetails`} component={SavingsCollectionDetails} />
                                    <Route path={`${props.match.path}/LoanCollectionDetails`} component={LoanCollectionDetails} />
                                    <Route path={`${props.match.path}/OutstandingReportDetails`} component={OutstandingReportDetails} />
                                    <Route path={`${props.match.path}/EmployeeSettings`} component={EmployeeSettings} />
                                    <Route path={`${props.match.path}/AgentTransfer`} component={AgentTransfer} />
                                    <Route path={`${props.match.path}/AgentTransferMaster`} component={AgentTransferMaster} />
                                    <Route path={`${props.match.path}/AllAgentCollections`} component={AllAgentCollections} />
                                    <Route path={`${props.match.path}/LoanAgentTransfer`} component={LoanAgentTransfer} />
                                    <Route path={`${props.match.path}/SavingsAgentTransfer`} component={SavingsAgentTransfer} />
                                    <Route path={`${props.match.path}/RdAgentTransfer`} component={RdAgentTransfer} />
                                    <Route path={`${props.match.path}/FdAgentTransfer`} component={FdAgentTransfer} />
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
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <AddCircleIcon />
                        Create New Employee
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/CollectionsByAgent'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <AddCircleIcon />
                        Collection
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/AllAgentCollections'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <AllInboxRounded />
                        Agent Collections
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/Attandance'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        Attandance
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/OutStandingReport'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        Outstanding Report
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/NewRegistrations'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New Registration Request
                    </Link>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/NewLoanApproval'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <HowToReg />
                        New Loan Applications
                    </Link>
                </MenuItem>
                <MenuItem onClick={() => setMenu(null)}>
                    <Link to={props.match.path + '/AgentTransferMaster'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <TransferWithinAStation />
                        Agent Transfer
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