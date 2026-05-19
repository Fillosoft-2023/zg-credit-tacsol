import React from 'react'
import {
    makeStyle,
    Grid,
    Container,
    IconButton,
    Button,
    Divider,
    Typography,
    Paper,
    Toolbar
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles'
import ExistingHolder from './existing_mem'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import ResgisteredFdMem from './new_fd'
import CreateFd from './create_fd'
import { useHistory } from 'react-router-dom'
import FdHolDet from './fdHolDet'
import ProfileModify from './profileModify'
import TaModify from './taModify'
import FdLadgerBook from './fd_ladger';
import Api from '../../api/api';
export default function PolicyHome(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])

    React.useEffect(() => {

        fetch(Api + 'allTa')
            .then(res => res.json())
            .then(data => setExisting(data))
            .catch(err => console.log(err))


    }, ['fd'])



    return (
        <Router>
            {
                existingData.length === 0 ? (
                    <div></div>
                ) : (
                    <Container maxWidth={'false'} style={{ padding: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 1 }}>
                            <Typography style={{ fontWeight: 'bold', textAlign: 'center' }} variant='h6'>
                                POLICY ACCOUNT
                            </Typography>
                        </Toolbar>
                        <Grid container spacing={0} style={{ height: '100%' }} >
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredFdMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/CreateFd`} component={CreateFd} />
                                    <Route path={`${props.match.path}/FdHolDet`} component={FdHolDet} />
                                    <Route path={`${props.match.path}/ProfileModify`} component={ProfileModify} />
                                    <Route path={`${props.match.path}/TaModify`} component={TaModify} />
                                    <Route path={`${props.match.path}/FdLadgerBook`} component={FdLadgerBook} />
                                    <Route render={() => <Redirect to="/Home/FdHome/" />} />
                                </Switch>
                            </Grid>
                        </Grid>
                    </Container>

                )
            }
        </Router>
    )
}

const useStyle = makeStyles(() => ({
    leftContain: {
        padding: 5,





    },
    existinMem: {
        marginTop: 20,
    },
    addButton: {
        marginBottom: 10
    }
}))