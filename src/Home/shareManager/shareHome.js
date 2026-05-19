import React from 'react'
import {
    makeStyle,
    Grid,
    Container,
    IconButton,
    Button,
    Divider,
    Typography,
    Toolbar,
    Paper,

} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/styles'
import ExistingHolder from './ExistingMem'
import { Link, Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import ResgisteredMem from './newShare'
import CreateShare from './createSahre'
import { useHistory } from 'react-router-dom'
import ShareHolDet from './shareMemDet'
import ShareLadger from './shareladger'
import ProfileModify from './profileModify'
import ShareModify from './modifyShare'
import Api from '../../api/api';
export default function SahreManager(props) {
    const classes = useStyle()
    const [existingData, setExisting] = React.useState([])
    const history = useHistory()
    React.useEffect(() => {
        if (!props.location.state) {
            history.push('Home/Share_sec')
        }
        fetch(Api + 'rstrsn')
            .then(res => res.json())
            .then(res => setExisting(res))
            .catch(err => {
                console.log(err)
            })


    }, ['share'])



    return (
        <Router>
            {
                existingData.length === 0 ? (
                    <div></div>
                ) : (
                    <Container maxWidth={'false'} style={{  padding: 0 }}>
                        <Toolbar component={Paper} style={{display:'flex',justifyContent:'center',marginBottom:5}}>
                        <Typography style={{ fontWeight: 'bold', textAlign: 'center' }} variant='h6'>
                            SHARE ACCOUNT
                        </Typography>
                        </Toolbar>
                        
                        <Grid container spacing={0} style={{ height: '100%' }} >
                            <Grid item xs={12} sm={3} className={classes.leftContain}>
                                <ExistingHolder className={classes.existinMem} callback={Math.random()} />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.leftContain} >
                                <Switch>
                                    <Route exact path={props.match.path} component={() => (<ResgisteredMem myProp={existingData} />)} />
                                    {/*<Route path={`${props.match.path}/CreateRd`} component={CreateRd} /> 
            <Route path={`${props.match.path}/RdHolDet`} component={RdHolDet} />
            <Route path={`${props.match.path}/RdLadger`} component={RdLadger} />*/}
                                    <Route path={`${props.match.path}/CreateShare`} component={CreateShare} />
                                    <Route path={`${props.match.path}/ShareHolDet`} component={ShareHolDet} />
                                    <Route path={`${props.match.path}/ShareLadger`} component={ShareLadger} />
                                    <Route path={`${props.match.path}/ProfileModify`} component={ProfileModify} />
                                    <Route path={`${props.match.path}/ShareModify`} component={ShareModify} />
                                    <Route render={() => <Redirect to="/Home/Share_reg/" />} />
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
        maxHeight: '78vh'





    },
    existinMem: {
        marginTop: 20,
    },
    addButton: {
        marginBottom: 10
    }
}))