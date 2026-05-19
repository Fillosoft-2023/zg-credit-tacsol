import React from 'react'
import {
    Grid,
    Container,
    Button,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import ExistingHolder from './existingMem';
import ResgisteredMem from './newSavings';
import CreateSavings from './createSavings';
import SavingsLadger from './savingLadger';
import Api from '../../api/api';
import ProfileModifySavings from './profileModify';
import SavingsModify from './savingsModify';
import SavingsHolDetails from './savingsHolDetails';
import InterestBreakdown from './interestBreakdown';
export default function SavMainHome(props) {
    const classes = useStyle()
    const history = useHistory()
    const [existingData, setExisting] = React.useState([])

    React.useEffect(() => {
        fetch(Api + 'allSav')
            .then(res => res.json())
            .then(res => setExisting(res))
            .catch(err => {
                console.log(err)
            })
    }, ['sav'])



    return (
        <Router>
            {
                existingData.length === 0 ? (
                    <div></div>
                ) : (

                    <Container maxWidth={'false'} style={{ padding: 0 }}  elevation={0}>
                        <Toolbar component={Paper} style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'center', marginBottom: 1 }}>
                            <Grid container>
                                <Grid item sm={5} md={5} lg={5}>
                                </Grid>
                                <Grid item sm={7} md={7} lg={7} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'center',color:'#023E8A' }} variant='h6'>
                                        Savings Account
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => history.push('/Home/AllSavingsAccountInfo')}
                                        size="small"
                                    >
                                        All Account
                                    </Button>
                                </Grid>
                            </Grid>

                        </Toolbar>
                        <Grid container spacing={0} style={{ height: '100%' }} >
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/CreateSavings/`} component={CreateSavings} />
                                    <Route path={`${props.match.path}/SavingsHolDetails/`} component={SavingsHolDetails} />
                                    <Route path={`${props.match.path}/SavingsLadger/`} component={SavingsLadger} />
                                    <Route path={`${props.match.path}/ProfileModify/`} component={ProfileModifySavings} />
                                    <Route path={`${props.match.path}/SavingsModify/`} component={SavingsModify} />
                                    <Route path={`${props.match.path}/interestbreakdown/`} component={InterestBreakdown} />

                                    <Route render={() => <Redirect to="/Home/SavMainHome/" />} />
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