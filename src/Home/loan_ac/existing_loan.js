import React, { useState, useEffect } from 'react'
import {
    Container,
    Grid,
    Paper,
    InputBase,
    IconButton,
    List,
    ListItem,
    Avatar,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Divider,
    LinearProgress,
    Toolbar,

} from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/styles'
import DateRangeIcon from '@material-ui/icons/DateRange';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { useHistory } from 'react-router-dom'
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
import LoanTrans from './loanTrans'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import logo from '../../assets/logo.png'
import Api from '../../api/api';
import ImageApi from '../../api/image_api'
export default function ExistingHolder(props) {
    const classess = useStyle();
    const [allLoan, setallLoan] = useState([]);
    const [sendData, setsendData] = useState({})
    const [loading, setLoading] = React.useState(false);

    const history = useHistory()
    const handleChange = (event) => {
        let value = event.target.value;

        setLoading(true)
        fetch(Api + 'searchLoan', {
            method: "POST",
            body: JSON.stringify({ search: value })
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setallLoan(res)
            })
    }

    const linkToLoan = (props, key) => {
        updateSelected(key)
        history.push('/Home/LoanHome/LoanHol/', { "data": props })
    }
    const linkToLadger = (props, key) => {
        updateSelected(key)
        history.push('/Home/LoanHome/LadgerBook/', { "data": props, refresh: Math.random() })
    }
    const [isrefresh, setIsRefres] = React.useState(false)
    React.useEffect(() => {


        setLoading(true)
        fetch(Api + 'allLoan')
            .then(res => res.json())
            .then(data => {
                setallLoan(data.data2);
                setLoading(false)
            })
            .catch(err => console.log(err))


    }, [isrefresh])
    const [selected, setSelect] = React.useState(null)
    const updateSelected = (selectedIndex) => {
        setSelect(selectedIndex)


    }
    var countMat = allLoan.reduce(function (n, val) {
        return n + (val.ln_stts === 'completed');
    }, 0);
    var countActive = allLoan.reduce(function (n, val) {
        return n + (val.ln_stts === 'not submitted');
    }, 0);


    const ListGenerate = () =>
        allLoan.map((value, key) => {
            let Example = ''
            let data = ''
            if (value.img != null) {
                const img = Buffer.from(value.img).toString('base64')
                data = img
                Example = ({ data }) => <img style={{ width: '100%' }} src={ImageApi + data} />
            } else {
                Example = () => <img style={{ width: '100%' }} src={logo} />
            }

            return (
                <>
                    <ListItem button key={key} onClick={() => linkToLoan(value, key)} style={{ backgroundColor: value.ln_stts === 'completed' ? '#8bf7b2' : '#fff' }} selected={selected === key}>
                        <ListItemAvatar>
                            <Avatar>
                                <Example data={value.img} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography className={classess.font}>{value.name}</Typography>}
                            secondary={
                                <Typography className={classess.fontSec} style={{ display: 'flex' }}>{value.acno}
                                    <Typography className={classess.fontSec} style={{ color: 'red' }} component={'strong'}>/{!value.ln_id ? value.id : value.ln_id}
                                    </Typography>
                                </Typography>}
                        />
                        <ListItemSecondaryAction style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


                            <LoanTrans callback={value} onClick={() => updateSelected(key)} />

                            <IconButton size="small" onClick={() => linkToLadger(value, key)}>
                                <ImportContactsIcon />
                            </IconButton>
                            <IconButton onClick={() => linkToLoan(value, key)} edge="end" size="small" aria-label="delete">
                                <NavigateNextIcon />
                            </IconButton>

                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </>

            )
        });





    return (
        <Container component={Paper} className={classess.Container}>
            <Toolbar component={Paper} style={{display:'flex',justifyContent:"center"}}>
            <Typography variant='h6' style={{ fontWeight: 'bold',color:'#023E8A' }}>
                Existing Loan Accounts
            </Typography>
            </Toolbar>
            
            <Paper component="form" className={classess.search}>
                <InputBase
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    placeholder="Search by account no or name"
                    inputProps={{ 'aria-label': 'Search by account no or name' }}
                    className={classess.input}
                    onChange={handleChange}
                />
                <IconButton aria-label="search">
                    <SearchIcon />
                </IconButton>


            </Paper>
            {
                loading ? <LinearProgress /> : ''
            }
            <List >
                <ListItem style={{ display: 'flex', justifyContent: 'left' }}>
                    <Tooltip title="Displayed Holder's">
                        <GroupIcon style={{ color: '#808080', marginLeft: 10 }} />
                    </Tooltip>
                    <Typography style={{ marginLeft: 5, color: '#808080' }}>{allLoan.length}</Typography>

                    <Tooltip title="Completed Account">
                        <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: 10 }} />
                    </Tooltip>
                    <Typography style={{ marginLeft: 5, color: 'green' }}>{countMat}</Typography>

                    <Tooltip title="Running Loan">
                        <DirectionsRunIcon style={{ color: 'red', marginLeft: 10 }} />
                    </Tooltip>
                    <Typography style={{ marginLeft: 5, color: 'red' }}>{countActive}</Typography>

                    <Tooltip title="Refresh">
                        <IconButton size="small" style={{ marginLeft: 10 }} onClick={() => setIsRefres(Math.random())}>
                            <RefreshIcon style={{ color: '#808080', marginLeft: 10 }} />
                        </IconButton>
                    </Tooltip>

                </ListItem>
                <Divider />
                {ListGenerate()}
            </List>

        </Container>
    )
}

const useStyle = makeStyles((theme) => ({
    Container: {
        padding: 0,
        backgroundColor: '#fff',

        borderRadius: 3,
        overflowX: 'auto',
        height: '84vh',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },

    },
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',


    },
    input: {

        flex: 1,
    },
    font: {
        fontSize: '0.9em'
    },
    fontSec: {
        fontSize: '0.9em',
        color: '#5c5c5c'
    }
}))