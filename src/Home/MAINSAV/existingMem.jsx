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
    Tooltip,
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
import logo from '../../assets/logo.png'
import Api from '../../api/api';
import ImageApi from '../../api/image_api';
import SavingsTrans from './savingsTrans';





export default function ExistingHolder(props) {
    const classess = useStyle();
    const [allLoan, setallLoan] = useState([]);
    const [sendData, setsendData] = useState({})
    const [loading, setLoading] = React.useState(false);

    const history = useHistory()
    const handleChange = (event) => {
        let value = event.target.value;

        Object.assign(sendData, {
            "search": value,
            "press": "searchSavings"
        })
        setLoading(true)
        fetch(Api + 'searchSavings', {
            method: 'POST',
            body: JSON.stringify({ search: value })
        })
            .then(res => res.json())
            .then(res => {
                setallLoan(res)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const linkToLoan = (props, key) => {
        updateSelected(key)
        history.push('/Home/SavMainHome/SavingsHolDetails/',
            { "data": props })
    }
    const linkToLadger = (props, key) => {
        updateSelected(key)
        history.push('/Home/SavMainHome/SavingsLadger/',
            { "data": props, change: Math.random() })
    }

    const [isrefresh, setIsRefres] = React.useState(false)
    React.useEffect(() => {

        setLoading(true)
        fetch(Api + 'allSav')
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
                <>
                    <ListItem button key={key} autoFocus={true} style={{ backgroundColor: value.status === 'closed' ? '#8bf7b2' : '#fff' }} onClick={() => linkToLoan(value, key)} selected={selected === key}>
                        <ListItemAvatar>
                            <Avatar>
                                <Example />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography className={classess.font}>{value.name}</Typography>}
                            secondary={<Typography className={classess.fontSec} style={{ display: 'flex' }}>{value.acno}<Typography className={classess.fontSec} style={{ color: 'red' }}>/{value.sav_no}</Typography></Typography>}
                        />
                        <ListItemSecondaryAction style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <SavingsTrans callback={value} onClick={() => updateSelected(key)} />
                            <IconButton onClick={() => linkToLadger(value, key)}>
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
        <Container className={classess.Container} component={Paper}>
        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "center" }}>
            <Typography variant='h6' style={{ fontWeight: 'bold',color:'#023E8A' }}>
                Existing Savings Accounts
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
                    <Tooltip title="Displayed Holder's">
                        <GroupIcon style={{ color: '#808080', marginLeft: 10 }} />
                    </Tooltip>
                    <Typography style={{ marginLeft: 5, color: '#808080' }}>{allLoan.length}</Typography>



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