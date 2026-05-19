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
import ExistingHolder from './ExsitingMem'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import ResgisteredMem from './newSav'
import CreateSav from './createSav'
import { useHistory } from 'react-router-dom'
import SavHolDet from './savingsHolDet'
import SavLadger from './savingsLadger'
import ProfileModify from './profileModify'
import SavModify from './savModify'
import Api from '../../api/api'
export default function RdHome(props) {
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

                    <Container maxWidth={'false'} style={{ padding: 0 }}>
                        <Toolbar component={Paper} style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'center' }}>
                            <Grid container>
                                <Grid item sm={5} md={5} lg={5}>
                                </Grid>
                                <Grid item sm={7} md={7} lg={7} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'center',color:'#023E8A' }} variant='h6'>
                                        RD ACCOUNT
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => history.push('/Home/AllSavAccountInfo')}
                                        size="small"
                                    >
                                        All Account
                                    </Button>
                                </Grid>
                            </Grid>

                        </Toolbar>
                        <Grid container spacing={0}  >
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/CreateSav/`} component={CreateSav} />
                                    <Route path={`${props.match.path}/SavHolDet/`} component={SavHolDet} />
                                    <Route path={`${props.match.path}/SavLadger/`} component={SavLadger} />
                                    <Route path={`${props.match.path}/ProfileModify/`} component={ProfileModify} />
                                    <Route path={`${props.match.path}/SavModify/`} component={SavModify} />
                                    <Route render={() => <Redirect to="/Home/SavHome/" />} />
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
    },
    addButton: {
        marginBottom: 10
    }
}))