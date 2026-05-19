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
    Toolbar

} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/styles'

import DateRangeIcon from '@material-ui/icons/DateRange';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { useHistory } from 'react-router-dom'
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
import Transac from './shareTrans'
import logo from '../../assets/logo.png'
import Api from '../../api/api';
import SnakBar from '../../consts/message';
import ImageApi from '../../api/image_api';
export default function ExistingHolder(props) {
    const classess = useStyle();
    const [allLoan, setallLoan] = useState([]);
    const [sendData, setsendData] = useState({})
    const [loading, setLoading] = React.useState(false)
    const [massg, setMassg] = React.useState({})
    const history = useHistory()
    const handleChange = (event) => {
        let value = event.target.value;


        setLoading(true)
        fetch(Api + 'searchSahre', {
            method: 'POST',
            body: JSON.stringify({
                search: value
            })
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                setallLoan(res)
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }

    const linkToLoan = (props) => {

        history.push('/Home/Share_reg/ShareHolDet/', { "data": props })
    }
    const linkToLadger = (props) => {
        history.push('/Home/Share_reg/ShareLadger/', { "data": props, change: Math.random() })
    }

    const [isrefresh, setIsRefres] = React.useState(false)
    React.useEffect(() => { 
        setLoading(true)
        fetch(Api + 'ExistShare')
            .then(res => res.json())
            .then(res => { setallLoan(res); setLoading(false) })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })


    }, [isrefresh])


    const ListGenerate = () =>
        allLoan.map((value, key) => {
            let Example = ''
            let data = ''
            if (value.img != null) {
                const img = Buffer.from(value.img).toString('base64')
                data = img
                Example = ({ data }) => <img style={{ width: '100%' }} src={ImageApi + value.img} />
            } else {
                Example = () => <img style={{ width: '100%' }} src={logo} />
            }
            return (

                <ListItem button key={key} >
                    <ListItemAvatar>
                        <Avatar>
                            <Example data={data} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText

                        primary={<Typography className={classess.font}>{value.name}</Typography>}
                        secondary={<Typography className={classess.fontSec} style={{ display: 'flex' }}>{value.acno}<Typography className={classess.fontSec} style={{ color: 'red' }}>/{value.id}</Typography></Typography>}
                    />
                    <ListItemSecondaryAction style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <Transac callback={value} />
                        <IconButton onClick={() => linkToLadger(value)}>
                            <ImportContactsIcon />
                        </IconButton>
                        <IconButton onClick={() => linkToLoan(value)} edge="end" size="small" aria-label="delete">
                            <NavigateNextIcon />
                        </IconButton>

                    </ListItemSecondaryAction>
                </ListItem>
            )
        });





    return (
        <Container className={classess.Container} component={Paper}>
        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "center" }}>
            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                Existing Share Accounts
            </Typography>
        </Toolbar >
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
            <List>
                <ListItem>
                    <GroupIcon style={{ color: '#808080' }} />
                    <Typography style={{ marginLeft: 5, color: '#808080' }}>{allLoan.length}</Typography>
                    <IconButton size="small" style={{ marginLeft: 10 }} onClick={() => setIsRefres(Math.random())}>
                        <RefreshIcon />
                    </IconButton>

                </ListItem>
                <Divider />
                {ListGenerate()}
            </List>
            <SnakBar massg={massg} setMassg={setMassg} />
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