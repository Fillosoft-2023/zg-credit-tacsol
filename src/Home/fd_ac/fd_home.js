import React from 'react'
import {
    makeStyle,
    Grid,
    Container,
    IconButton,
    Button,
    Divider,
    Paper,
    Typography,
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
export default function RdHome(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
    const history = useHistory()

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
                        <Toolbar component={Paper} style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'center', marginBottom: 5 }}>
                            <Grid container>
                                <Grid item sm={5} md={5} lg={5}>
                                </Grid>
                                <Grid item sm={7} md={7} lg={7} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'center', color: '#023E8A' }} variant='h6'>
                                        TEMPORARY LOAN ACCOUNT
                                    </Typography>
                                    <div style={{ display: 'flex' }}>
                                        
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => history.push('/Home/AllFdAccountsInfo')}
                                            size="small"
                                        >
                                            All Account
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>

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
        height: '87%',





    },
    existinMem: {
        marginTop: 20,
    },
    addButton: {
        marginBottom: 10
    }
}))