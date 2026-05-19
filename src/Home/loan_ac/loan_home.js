import React from 'react'
import {
    Grid,
    Container,
    Button,
    Toolbar,
    Paper,
    Typography,
    Divider
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles'
import ExistingHolder from './existing_loan'
import ResgisteredMem from './new_loan'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import CreateLoan from './create_loan'
import { useHistory } from 'react-router-dom'
import LoanHolDet from './loanHolDet'
import LadgerBook from './loanLadger'
import ProfileModify from './profileModify'
import LoanModify from './loanModify'
import LoanTrans from './loanTrans'
import LoanType from './loan_type_manager';
import Api from '../../api/api';
import CreateLoanDisstructured from './create_loan_dissturctured';
export default function LoanHome(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
    const [newLoan, setNewLoan] = React.useState({})
    const history = useHistory();
    React.useEffect(() => {
        fetch(Api + 'allLoan')
            .then(res => res.json())
            .then(data => setExisting(data))
            .catch(err => console.log(err))
    }, ['loan'])



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
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'center',color:'#023E8A' }} variant='h6'>
                                        LOAN ACCOUNT
                                    </Typography>
                                    <div>
                                    <Button size="small" style={{marginRight:10}} variant="contained" color="primary" onClick={() => history.push('/Home/AllLoanView')}>
                                        All Account
                                    </Button>
                                    <Button size="small" style={{marginRight:10}} variant="outlined" color="primary" onClick={() => history.push('/Home/BulkTransaction')}>
                                        Bulk Transaction
                                    </Button>
                                    </div>
                                   
                                </Grid>
                            </Grid>
                        </Toolbar>

                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <ExistingHolder className={classes.existinMem} callback={existingData.data2} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData.data} />)} />
                                    <Route path={`${props.match.path}/CreateLoan`} component={CreateLoan} />
                                    <Route path={`${props.match.path}/CreateLoanDisstructured`} component={CreateLoanDisstructured} />
                                    <Route path={`${props.match.path}/LoanHol`} component={LoanHolDet} />
                                    <Route path={`${props.match.path}/LadgerBook`} component={LadgerBook} />
                                    <Route path={`${props.match.path}/ProfileModify`} component={ProfileModify} />
                                    <Route path={`${props.match.path}/LoanModify`} component={LoanModify} />
                                    <Route path={`${props.match.path}/LoanTrans`} component={LoanTrans} />
                                    <Route path={`${props.match.path}/LoanType`} component={LoanType} />
                                    <Route render={() => <Redirect to="/Home/LoanHome/" />} />
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
        marginRight: 5
    }
}))