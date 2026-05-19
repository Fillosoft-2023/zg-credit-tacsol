import { Toolbar, Typography } from '@material-ui/core'
import React, { createElement } from 'react'
import {

    makeStyles,
    Container,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import LoginPass from './loginPass'
import MasterPass from './masterPass'
import Format from './format'
import BranchManager from './branch_manager';
import AddBranch from './add_branch';
import EditBranch from './edit_branch';
import TransactionMaster from './transactionMaster';
import TransactionDateChange from './transactionDateChange';
import GovtMaster from './govtMaster';
import GovtSettings from './govtSettings';

export default function Settings(props) {
    const classes = style()

    const downloadDb = () => {
        console.log('test')
    }
    const uploadFile = (value) => {
        console.log(value)
        const sendData = {
            data: value,
            press: 'updateDB'
        }
    }
    const handleChange = (event) => {


        let unitArray = event.target.files[0].arrayBuffer()
        unitArray.then((value) => {
            uploadFile(new Uint8Array(value, 'binary'))

        })
    }
    const importDb = () => {
        const selector = document.createElement('input')
        selector.type = 'file'
        selector.onchange = handleChange
        document.body.appendChild(selector)
        selector.click()
        selector.parentNode.removeChild(selector)
 
    }


    return (
        <Router>
            <Container maxWidth="false" component={Paper} style={{ margin: 0, padding: 5,height:'93vh' }}>
                <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                    <Typography variant='h6' style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        SETTINGS
                    </Typography>
                </Toolbar>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={3}>
                        <Paper style={{height:'84vh'}} variant='contained'>
                            <Toolbar component={Paper} style={{display:'flex',justifyContent:'center'}}>
                                <Typography style={{ fontWeight: 'bold' }}>
                                    General Settings
                                </Typography>
                            </Toolbar>
                            <List>
                                <Link to="/Home/settings/" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Login Password" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link to="/Home/settings/MasterPass" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Master Password" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link to="/Home/settings/BranchManager" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Branch Manager" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link to="/Home/settings/TransactionMaster" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Transaction Manager" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Divider />
                                {/* <Link to="/Home/settings/GovtMaster" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Govt App Manager" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link> */}
                                <Divider />

                                {/* <ListItem button onClick={() => downloadDb()}>
                                    <ListItemText primary="Data Backup" />
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem button onClick={() => importDb()}>
                                    <ListItemText primary="Data Restore" />
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                </ListItem>
                                <Divider /> <Divider />
                                <Link to="/Home/settings/format" style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItem button>
                                        <ListItemText primary="Format" />
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Divider /> */}

                                {/*<ListItem button>
                                <ListItemText primary="Data Backup" onClick={()=>createZip()} />
                                <ListItemIcon>
                                    <ChevronRightIcon />
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="License" />
                                <ListItemIcon>
                                    <ChevronRightIcon />
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="Help" />
                                <ListItemIcon>
                                    <ChevronRightIcon />
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemText primary="About us" />
                                <ListItemIcon>
                                    <ChevronRightIcon />
                                </ListItemIcon>
                            </ListItem> */}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Switch>
                            <Route exact path={props.match.path} component={LoginPass} />
                            <Route path={`${props.match.path}/BranchManager`} component={BranchManager} />
                            <Route path={`${props.match.path}/MasterPass`} component={MasterPass} />
                            <Route path={`${props.match.path}/AddBranch`} component={AddBranch} />
                            <Route path={`${props.match.path}/EditBranch`} component={EditBranch} />
                            <Route path={`${props.match.path}/format`} component={Format} />
                            <Route path={`${props.match.path}/TransactionMaster`} component={TransactionMaster} />
                            <Route path={`${props.match.path}/TransactionDateChange`} component={TransactionDateChange} />
                            <Route path={`${props.match.path}/GovtMaster`} component={GovtMaster} />
                            <Route path={`${props.match.path}/GovtSettings`} component={GovtSettings} />





                            <Route render={() => <Redirect to="/Home/settings/" />} />
                        </Switch>
                    </Grid>
                </Grid>
            </Container>
        </Router>
    )
}

const style = makeStyles(() => ({
    continer: {
        marginTop: 15,
    },

}))