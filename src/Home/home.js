import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Avatar, Badge, Box, Menu, Tooltip } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NavList from './navpane-components/navlist'
import { Link, Route, Switch, BrowserRouter as Router, Redirect, useHistory } from "react-router-dom";

import Dashboard from './dashboard'
import Newreg from './newreg'
import MasterLogin from './shareManager/login'
import SahreManager from './shareManager/shareHome'
import CreateAc from './share_hol/create_ac'
import LoanHome from './loan_ac/loan_home'

import FdHome from './fd_ac/fd_home'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Notification from './notification'
import Expent from './expent/expent_home'
import Settings from './settings/settingsHome'
import BankHome from './bank/banHome'
import CashBook from './cashbook/cashHome'
// import LadgerHome from './ladgerbook/ladgerHome'
import LadgerHome from './ladgerbook/homeNew'
import EmployHome from './employMangment/employHome'
import ProfitLoss from './reports/profitLost'
import SavHome from './savings/savingsHome'
import ModifyTrans from './modifyTrans/modifyHome'
import BalSheet from './reports/balenceSheet'
import OtherAc from './OtherAc/otherHome'
import FundHome from './fund_ac/fund_home'
import LoanSheet from './sheets/loanSheets';
import SavingsSheet from './sheets/savingsSheet';
import LoanSheetHome from './sheets/loanSheetHome';
import SheetView from './sheets/loan_sheet_view';

import AllSavAccountInfo from './savings/all_account/all_account';
import AllLoan from './loan_ac/all_loan/all_loan';
import DayBook from './reports/dayBook';
import { AccountCircle, BugReport, ExitToAppSharp, Info } from '@material-ui/icons';
import Overdue from './overdue/overdue';
import Api from '../api/api';
import { Alert, AlertTitle } from '@material-ui/lab';
import PLlogin from './reports/pl_login';
import BLlogin from './reports/bl_login';
import CBlogin from './cashbook/ch_login';
import PolicyHome from './policy_ac/fd_home';
import LogoutInactive from '../api/loginactive';
import Passbook from './passbook/passboook';
import FinanceHome from './finance/financeHome';
import Exlogin from './modifyTrans/exLogin';
import AllMembers from './allMembers';
import MemberDetails from './members/memberDetails';
import MemberLoanDetails from './members/memLoanDetails';
import ProfileModify from './members/profileModify';
import MemberSavingDetails from './members/memSavDetails';
import LoanDetailsMem from './members/loanDetails';
import CreateLoanDisstructured from './loan_ac/create_loan_dissturctured';
import PrincipalDetails from './cashbook/principaldetails';
import InterestDetails from './cashbook/interestDetails';
import FineDetails from './cashbook/fineDetails';
import ProcessingFeesDetails from './cashbook/processingFeesDetails';
import TlProcessingFeeDetails from './cashbook/tlProcessingFeesdetails';
import ShareDetailsA from './cashbook/shareDetailsA';
import ShareDetailsB from './cashbook/shareDetailsB';
import SavMainHome from './MAINSAV/savingsMainHome';
import TransactionDateChange from './settings/transactionDateChange';
import AllSavingsAccountInfo from './MAINSAV/allAccounts';
import MemberRdDetails from './members/memRdDetails';
import Information from './information';
import Collection from './reports/collection';
import LadgerBook from './loan_ac/loanLadger';
import BulkTransaction from './loan_ac/bulkTransaction';
import Ticket from './tickets/ticket';
import CreateTicket from './tickets/createTicket';
import Tacsol from '../assets/tacsol.png'
import RdDepositDetails from './cashbook/rdDepositDetails';
import SavDepositDetails from './cashbook/savDepositDetails';
import MembershipFeeDetails from './cashbook/membershipFeeDetails';
import LoanAcDetails from './cashbook/loanAcDetails';
import RdWithdrawlDetails from './cashbook/rdWithdrawlDetails';
import SavWithdrawlDetails from './cashbook/savWithdrawlDetails';
import AllFdAccountsInfo from './fd_ac/allFdAccount';

// customer
import CustomerHome from './customer/customerHome';
import PrecloseDetails from './cashbook/PrecloseDetails';
import InsuranceFeeDetails from './cashbook/InsuranceFeeDetails';
import ShareMemberFeeDetails from './cashbook/shareMemberFeeDetails';
import ShareAdmissionFeeDetails from './cashbook/shareAdmissionFeeDetails';
import RdProcessingFeeDetails from './cashbook/RdProcessingFeeDetails';
import RdFineDetails from './cashbook/rdFineDetails';
import SavingProcessingFeeDetails from './cashbook/SavingProcessingFeeDetails';
import SavingFineDetails from './cashbook/SavingFineDetails';
import TlDepositDetails from './cashbook/TlDepositDetails';
import DemandLoanReport from './reports/DemandLoanReport';
import DemandRdReport from './reports/DemandRdReport';
import DemandRdReportDetails from './reports/DemandRdReportDetails';
import LoanOverdueReport from './reports/LoanOverdueReport';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,

    }),
    backgroundColor: '#f7f7f7'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    color: '#000'
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',




  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#aaa',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

    overflow: 'hidden',
    '&:hover': {
      overflow: 'auto',
    },
    '&::-webkit-scrollbar': {
      width: '0.4em',
      backgroundColor: 'rgb(66,66,66)'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.4)',
      outline: '1px solid slategrey',

    }
  },

  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    overflow: 'hidden',

  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,

  },
  toolbarNew: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    backgroundColor: '#242424',
    position: 'fixed',
    zIndex: 99999,

    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',




  },
}));

export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [noti, setNoti] = React.useState([])
  const [em_info, setEmINfo] = React.useState({})
  const [menuOpen, setMenuOpen] = React.useState(null)
  const emMenu = Boolean(menuOpen)
  const history = useHistory()
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const branch_id = localStorage.getItem('branch_code')
    const em_id = localStorage.getItem('em_code')
    if (!branch_id || !em_id) {
      history.push('/')
    }
    fetch(Api + 'user_info', {
      method: 'POST',
      body: JSON.stringify({ id: localStorage.getItem('em_code') })
    })
      .then(res => res.json())
      .then(res => setEmINfo(res[0]))
      .catch(err => {
        console.log(err)
      })
    const authState = localStorage.getItem('authState')
    if (!authState) {
      history.push('/')
    }
  }, [])

  const handleLogout = () => {

    localStorage.setItem('authState', false)
    localStorage.clear('branch_code')
    localStorage.clear('em_id')
    window.location.replace('/')
  }

  const handleMenuIcon = (e) => {
    setMenuOpen(e.currentTarget)
  }
  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
          elevation={0}
          style={{ borderBottom: '1px solid #ddd', backgroundColor: '#3F3F3F' }}
        >
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <div style={{ textAlign: 'center' }} >
              <Typography variant='h6' style={{ color: '#3F51B5', marginBottom: 0, fontWeight: 'bold' }}>
                ZG THRIFT AND CREDIT COOPERATIVE SOCIETY LTD
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/Home/Ticket" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <Badge badgeContent={noti.length} color='primary' >
                    <Tooltip title="Raise a ticket">

                      <BugReport style={{ color: '#3F51B5' }} />
                    </Tooltip>
                  </Badge>
                </IconButton>
              </Link>
              <Link to="/Home/Information" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <Badge badgeContent={noti.length} color='primary' >
                    <Tooltip title="Information">
                      <Info style={{ color: '#3F51B5' }} />
                    </Tooltip>
                  </Badge>
                </IconButton>
              </Link>
              <Link to="/Home/Notification" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <Tooltip title="Notification">
                    <NotificationsActiveIcon style={{ color: '#3F51B5' }} />
                  </Tooltip>
                </IconButton>
              </Link>
              <IconButton onClick={() => handleLogout()}>
                <Tooltip title="Logout">
                  <ExitToAppSharp style={{ color: '#3F51B5' }} />
                </Tooltip>
              </IconButton>
              <IconButton onClick={handleMenuIcon}>
                <Tooltip title="Profile">
                  <AccountCircle style={{ color: '#3F51B5' }} />
                </Tooltip>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbarNew} style={{ backgroundColor: '#FFFFFF' }}>
            <div></div>
            <img src={Tacsol} width={150} height={30} style={{ marginRight: 5 }} />
            <IconButton style={{ color: '#3F51B5' }} onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <NavList />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} style={{ backgroundColor: '#fff' }} />
          <Switch>
            <Route exact path={props.match.path} component={Dashboard} />
            <Route path={`${props.match.path}/Newreg`} component={Newreg} />
            <Route path={`${props.match.path}/Share_reg`} component={SahreManager} />
            <Route path={`${props.match.path}/LoanHome`} component={LoanHome} />
            <Route path={`${props.match.path}/FdHome`} component={FdHome} />
            <Route path={`${props.match.path}/expent`} component={Expent} />
            <Route path={`${props.match.path}/settings`} component={Settings} />
            <Route path={`${props.match.path}/Bank`} component={BankHome} />
            <Route path={`${props.match.path}/CashHome`} component={CashBook} />
            <Route path={`${props.match.path}/LadgerHome`} component={LadgerHome} />
            <Route path={`${props.match.path}/EmployHome`} component={EmployHome} />
            <Route path={`${props.match.path}/SavHome`} component={SavHome} />
            <Route path={`${props.match.path}/OtherAc`} component={OtherAc} />
            <Route path={`${props.match.path}/FundHome`} component={FundHome} />
            <Route path={`${props.match.path}/PolicyHome`} component={PolicyHome} />
            <Route path={`${props.match.path}/FinanceHome`} component={FinanceHome} />
            <Route path={`${props.match.path}/SavMainHome`} component={SavMainHome} />
            <Route path={`${props.match.path}/Collection`} component={Collection} />
            <Route path={`${props.match.path}/BulkTransaction`} component={BulkTransaction} />

            <Route path={`${props.match.path}/LadgerBookHome`} component={LadgerBook} />

            <Route path={`${props.match.path}/AllMembers`} component={AllMembers} />
            <Route path={`${props.match.path}/MemberDetails`} component={MemberDetails} />
            <Route path={`${props.match.path}/MemberLoanDetails`} component={MemberLoanDetails} />
            <Route path={`${props.match.path}/ProfileModify`} component={ProfileModify} />
            <Route path={`${props.match.path}/MemberSavingDetails`} component={MemberSavingDetails} />
            <Route path={`${props.match.path}/MemberRdDetails`} component={MemberRdDetails} />
            <Route path={`${props.match.path}/LoanDetailsMem`} component={LoanDetailsMem} />
            <Route path={`${props.match.path}/shareDetailsA`} component={ShareDetailsA} />
            <Route path={`${props.match.path}/shareDetailsB`} component={ShareDetailsB} />
            <Route path={`${props.match.path}/ShareMemberFeeDetails`} component={ShareMemberFeeDetails} />
            <Route path={`${props.match.path}/ShareAdmissionFeeDetails`} component={ShareAdmissionFeeDetails} />
            <Route path={`${props.match.path}/Share_sec`} component={MasterLogin} />
            <Route path={`${props.match.path}/CreateAc`} component={CreateAc} />
            <Route path={`${props.match.path}/Notification`} component={Notification} />
            <Route path={`${props.match.path}/Information`} component={Information} />
            <Route path={`${props.match.path}/Ticket`} component={Ticket} />
            <Route path={`${props.match.path}/CreateTicket`} component={CreateTicket} />

            <Route path={`${props.match.path}/ProfitLoss`} component={ProfitLoss} />
            <Route path={`${props.match.path}/ModifyTrans`} component={ModifyTrans} />
            <Route path={`${props.match.path}/Dashboard`} component={Dashboard} />
            <Route path={`${props.match.path}/BalSheet`} component={BalSheet} />
            <Route path={`${props.match.path}/LoanSheet`} component={LoanSheet} />
            <Route path={`${props.match.path}/LoanSheetHome`} component={LoanSheetHome} />
            <Route path={`${props.match.path}/SavingsSheet`} component={SavingsSheet} />
            <Route path={`${props.match.path}/LoanSheetView`} component={SheetView} />
            <Route path={`${props.match.path}/AllSavAccountInfo`} component={AllSavAccountInfo} />
            <Route path={`${props.match.path}/AllFdAccountsInfo`} component={AllFdAccountsInfo} />
            <Route path={`${props.match.path}/AllLoanView`} component={AllLoan} />
            <Route path={`${props.match.path}/DayBook`} component={DayBook} />
            <Route path={`${props.match.path}/Overdue`} component={Overdue} />
            <Route path={`${props.match.path}/PLlogin`} component={PLlogin} />
            <Route path={`${props.match.path}/BLlogin`} component={BLlogin} />
            <Route path={`${props.match.path}/CBlogin`} component={CBlogin} />
            <Route path={`${props.match.path}/settings/TransactionDateChange`} component={TransactionDateChange} />
            <Route path={`${props.match.path}/Exlogin`} component={Exlogin} />
            <Route path={`${props.match.path}/Passbook`} component={Passbook} />
            <Route path={`${props.match.path}/principalDetails/:to/:from/:ref`} component={PrincipalDetails} />
            <Route path={`${props.match.path}/PrecloseDetails/:to/:from/:ref`} component={PrecloseDetails} />
            <Route path={`${props.match.path}/interestDetails/:to/:from/:ref`} component={InterestDetails} />
            <Route path={`${props.match.path}/fineDetails/:to/:from/:ref`} component={FineDetails} />
            <Route path={`${props.match.path}/processingFeesDetails/:to/:from/:ref`} component={ProcessingFeesDetails} />
            <Route path={`${props.match.path}/InsuranceFeeDetails/:to/:from/:ref`} component={InsuranceFeeDetails} />
            <Route path={`${props.match.path}/tlProcFeesDetails/:to/:from/:ref`} component={TlProcessingFeeDetails} />
            <Route path={`${props.match.path}/rdDepositDetails/:to/:from/:ref`} component={RdDepositDetails} />
            <Route path={`${props.match.path}/RdProcessingFeeDetails/:to/:from/:ref`} component={RdProcessingFeeDetails} />
            <Route path={`${props.match.path}/RdFineDetails/:to/:from/:ref`} component={RdFineDetails} />
            <Route path={`${props.match.path}/SavingProcessingFeeDetails/:to/:from/:ref`} component={SavingProcessingFeeDetails} />
            <Route path={`${props.match.path}/SavingFineDetails/:to/:from/:ref`} component={SavingFineDetails} />
            <Route path={`${props.match.path}/TlDepositDetails/:to/:from/:ref`} component={TlDepositDetails} />
            <Route path={`${props.match.path}/savDepositDetails/:to/:from/:ref`} component={SavDepositDetails} />
            <Route path={`${props.match.path}/membershipFeeDetails/:to/:from/:ref`} component={MembershipFeeDetails} />
            <Route path={`${props.match.path}/loanAcDetails/:to/:from/:ref`} component={LoanAcDetails} />
            <Route path={`${props.match.path}/rdWithdrawlDetails/:to/:from/:ref`} component={RdWithdrawlDetails} />
            <Route path={`${props.match.path}/savWithdrawlDetails/:to/:from/:ref`} component={SavWithdrawlDetails} />

            {/* customer app */}


            <Route path={`${props.match.path}/CustomerHome`} component={CustomerHome} />
            <Route path={`${props.match.path}/reports/DemandLoanReport`} component={DemandLoanReport} />
            <Route path={`${props.match.path}/reports/DemandRdReport`} component={DemandRdReport} />
            <Route path={`${props.match.path}/reports/DemandRdReportDetails`} component={DemandRdReportDetails} />
            <Route path={`${props.match.path}/reports/LoanOverdueReport`} component={LoanOverdueReport} />




            <Route path={`${props.match.path}/AllSavingsAccountInfo`} component={AllSavingsAccountInfo} />
            <Route render={() => <Redirect to="/Home/" />} />
          </Switch>
        </main>
        <Menu
          open={emMenu}
          anchorEl={menuOpen}
          onClose={() => setMenuOpen(null)}

        >
          <Box style={{ backgroundColor: '#3F51B5', color: '#fff', padding: 5 }}>
            <Typography>Branch Code: {localStorage.getItem('branch_code')}</Typography>
          </Box>
          <Toolbar>
            <Avatar>
              <AccountCircle />
            </Avatar>
            <div style={{ marginLeft: 15 }}>
              <Typography style={{ textTransform: 'uppercase' }}>{em_info.ag_name ?? ''}</Typography>
              <Typography>{em_info.id ?? ''}</Typography>
            </div>
          </Toolbar>
        </Menu>
        <LogoutInactive logout={handleLogout} />
      </div>
    </Router>
  );
}