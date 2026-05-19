import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { Link, Route, Switch, BrowserRouter, } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import RestoreIcon from '@material-ui/icons/Restore';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import './../../css/navlist.css'
import { ContactPhone, Group, ListAlt, Money, PhoneIphone, Report, WatchLater } from '@material-ui/icons';
import { ListItemAvatar } from '@material-ui/core';
const useStyles = makeStyles({
    root: {
        '&$selected': {
            borderLeft: '5px solid #fff',
            backgroundColor: '#1f1f1f',
            paddingLeft: '-5px',
            '&:hover': {
                backgroundColor: '#232323',
            }
        },
        backgroundColor: '#000000',

    },
    selected: {},
});
export default function NavList() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        if (index == 4) {
            setOpen(!open);
        }
        if (index == 3) {
            setOpenac(!openac)
        }
        if (index == 1) {
            setColOpen(!colOpen)
        }

    };

    const commingMassg = (event, number) => {
        handleListItemClick(event, number)
        alert('This feature is comming soon')
    }
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openac, setOpenac] = React.useState(true);
    const [colOpen, setColOpen] = React.useState(false)

    const handleClick = () => {
        setOpen(!open);
    }
    return (
        <div>
            <List style={{ backgroundColor: '#242424', marginTop: '64px', padding: 0 }}>
                <Link to="/Home/Dashboard" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4', }}> <HomeIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Home</Typography>} />
                    </ListItem>
                </Link>
                <ListItem button
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                    classes={{ root: classes.root, selected: classes.selected }}
                >
                    <ListItemIcon style={{ color: '#e4e4e4' }}>
                        <InboxIcon className="NavIcon" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Sheets</Typography>} />
                    {colOpen ? <ExpandLess style={{ color: '#e4e4e4' }} /> : <ExpandMore style={{ color: '#e4e4e4' }} />}
                </ListItem>
                <Collapse in={colOpen} timeout="auto" unmountOnExit>
                    <List component="div" style={{ backgroundColor: 'rgb(66,66,66)' }} disablePadding>
                        <Link to="/Home/LoanSheetHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Deemand sheet</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>
                <Link to="/Home/Newreg" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <NoteOutlinedIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">New Registration</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/AllMembers" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 15}
                        onClick={(event) => handleListItemClick(event, 15)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <ListAlt className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">All Members</Typography>} />
                    </ListItem>
                </Link>

                <ListItem button
                    selected={selectedIndex === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                    classes={{ root: classes.root, selected: classes.selected }}
                >
                    <ListItemIcon style={{ color: '#e4e4e4' }}>
                        <InboxIcon className="NavIcon" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Account</Typography>} />
                    {openac ? <ExpandLess style={{ color: '#e4e4e4' }} /> : <ExpandMore style={{ color: '#e4e4e4' }} />}
                </ListItem>
                <Collapse in={openac} timeout="auto" unmountOnExit>
                    <List component="div" style={{ backgroundColor: '#000' }} disablePadding>
                        <Link to="/Home/LoanHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Loan Account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        {/* <Link to="/Home/RdHome" style={{ textDecoration: 'none' }}>
                <ListItem button className={classes.nested}>
                    
                    <ListItemText primary={<Typography style={{fontWeight:'bold'}} className="list-sub-font">RD Account</Typography>} />
                    <AddCircleIcon className="subformIcon" />
                </ListItem>
                </Link> */}
                        <Link to="/Home/FdHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">TL Account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/SavHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">RD Account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/SavMainHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Savings Account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/PolicyHome" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Policy Account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/Share_sec" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Share management</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        {/* <Link to="/Home/FundHome" style={{ textDecoration: 'none' }}>
                <ListItem button className={classes.nested}>
                    
                    <ListItemText primary={<Typography style={{fontWeight:'bold'}} className="list-sub-font">Fund Account</Typography>} />
                    <AddCircleIcon className="subformIcon" />
                </ListItem>
                </Link> */}
                        <Link to="/Home/OtherAc" style={{ textDecoration: 'none' }}>
                            <ListItem button className={classes.nested}>

                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Other account</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>


                <ListItem button
                    selected={selectedIndex === 4}
                    onClick={(event) => handleListItemClick(event, 4)}
                    classes={{ root: classes.root, selected: classes.selected }}>
                    <ListItemIcon style={{ color: '#e4e4e4' }}>
                        <Report className="NavIcon" />
                    </ListItemIcon>
                    <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Report</Typography>} />
                    {open ? <ExpandLess style={{ color: '#e4e4e4' }} /> : <ExpandMore style={{ color: '#e4e4e4' }} />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" style={{ backgroundColor: '#000' }} disablePadding>
                        <Link to="/Home/BLlogin/" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Balance Sheet</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/PLlogin/" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Profit and Loss</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/Collection/" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Collection</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/reports/DemandLoanReport" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Demand Loan Report</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/reports/DemandRdReport" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Demand RD Report</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>
                        <Link to="/Home/reports/LoanOverdueReport" style={{ textDecoration: "none" }}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-sub-font">Loan Overdue Report</Typography>} />
                                <AddCircleIcon className="subformIcon" />
                            </ListItem>
                        </Link>

                    </List>
                </Collapse>
                <Link to="/Home/FinanceHome" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 5}
                        onClick={(event) => handleListItemClick(event, 5)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <Money className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Finance</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/Overdue" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 14}
                        onClick={(event) => handleListItemClick(event, 14)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <WatchLater className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Overdue</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/settings" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 6}
                        onClick={(event) => handleListItemClick(event, 6)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <SettingsIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Settings</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/LadgerHome" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 7}
                        onClick={(event) => handleListItemClick(event, 7)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <MenuBookIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">General ledger</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/CBlogin" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 8}
                        onClick={(event) => handleListItemClick(event, 8)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <ImportContactsIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Cash book</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/Exlogin" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 9}
                        onClick={(event) => handleListItemClick(event, 9)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <RestoreIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Transaction History</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/expent" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 10}
                        onClick={(event) => handleListItemClick(event, 10)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <ReceiptIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Expense Manager</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/Passbook" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 13}
                        onClick={(event) => handleListItemClick(event, 13)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <ContactPhone className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Passbook</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/Bank" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 11}
                        onClick={(event) => handleListItemClick(event, 11)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <AccountBalanceIcon className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Bank Manager</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/EmployHome" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 12}
                        onClick={(event) => handleListItemClick(event, 12)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <Group className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Employee Manager</Typography>} />
                    </ListItem>
                </Link>
                <Link to="/Home/CustomerHome" style={{ textDecoration: 'none' }}>
                    <ListItem button
                        selected={selectedIndex === 16}
                        onClick={(event) => handleListItemClick(event, 16)}
                        classes={{ root: classes.root, selected: classes.selected }}
                    >
                        <ListItemIcon style={{ color: '#e4e4e4' }}> <PhoneIphone className="NavIcon" /></ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }} className="list-font">Customer App Manager</Typography>} />
                    </ListItem>
                </Link>
            </List>


        </div>
    )
}

