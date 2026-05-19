import React from 'react'
import {
    Container,
    Grid,
    Paper,
    Divider,
    Typography,
    Toolbar
} from '@material-ui/core'
// import sendAsync from './../../backend/renderer'
import Menu from './menu'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import EmiTrans from './emiTrans'
import RdTrans from './rdTrans/rdTans'
import SavTrans from './savingsTrans/savingTrans'
import ExpenseTrans from './expenseTrans/expenseTrans'
import BankTrans from './BankTrans'
import ShareTrans from './shareTrans'
import OtherTrans from './otherTrans';
import TaTrans from './taTranjs';
import FundTrans from './fundTrans';
import SavingsTransMain from './savingsTrans/savingsTransMain';
export default function ModifyTrans(props) {
    return (
        <Router>
            <Container maxWidth="false" style={{ padding: 0 }} >
                <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    <Typography style={{ fontWeight: 'bold', textAlign: 'center', padding: 20 }} variant='h6'>
                        TRANSACTION HOME
                    </Typography>
                </Toolbar>

                <Grid container spacing={0}>
                    <Grid item xs={12} sm={3}>
                        <Container component={Paper} style={{height:'84vh',padding:0}}>
                            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', }}>
                                <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    Transactions
                                </Typography>
                            </Toolbar>
                            <Menu />
                        </Container>

                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Switch>
                            <Route exact path={props.match.path} component={() => (<EmiTrans callback={Math.floor(Math.random() * 10)} />)} />
                            <Route path={`${props.match.path}/SavTrans`} component={() => (<SavTrans callback={Math.floor(Math.random() * 100)} />)} />
                            <Route path={`${props.match.path}/SavingsTransMain`} component={() => (<SavingsTransMain callback={Math.floor(Math.random() * 100)} />)} />

                            <Route path={`${props.match.path}/RdTrans`} component={() => (<RdTrans callback={Math.floor(Math.random() * 1000)} />)} />
                            <Route path={`${props.match.path}/ExpenseTrans`} component={() => (<ExpenseTrans callback={Math.floor(Math.random() * 10000)} />)} />
                            <Route path={`${props.match.path}/BankTrans`} component={() => (<BankTrans callback={Math.floor(Math.random() * 100000)} />)} />
                            <Route path={`${props.match.path}/ShareTrans`} component={() => (<ShareTrans callback={Math.floor(Math.random() * 1000000)} />)} />
                            <Route path={`${props.match.path}/OtherTrans`} component={() => (<OtherTrans callback={Math.floor(Math.random() * 1000000)} />)} />
                            <Route path={`${props.match.path}/TaTrans`} component={() => (<TaTrans callback={Math.floor(Math.random() * 1000000)} />)} />
                            <Route path={`${props.match.path}/FundTrans`} component={() => (<FundTrans callback={Math.floor(Math.random() * 1000000)} />)} />

                            <Route render={() => <Redirect to="/Home/ModifyTrans/" />} />
                        </Switch>
                    </Grid>
                </Grid>

            </Container>
        </Router>
    )
}