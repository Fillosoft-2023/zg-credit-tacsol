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
    Typography, Divider, LinearProgress, Menu, MenuItem

} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/styles'
import PaymentIcon from '@material-ui/icons/Payment';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { useHistory } from 'react-router-dom'
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
import EmployeeTrans from './employeTrans'
import ListAltIcon from '@material-ui/icons/ListAlt';
import logo from '../../assets/logo.png'
import Api from '../../api/api';
import ImageApi from '../../api/image_api';
export default function ExistingHolder(props) {
    const classess = useStyle();
    const [allLoan, setallLoan] = useState(props.callback);
    const [sendData, setsendData] = useState({})
    const [loading, setLoading] = React.useState(false);
    const [menuView, setMenuView] = React.useState(null)
    const menu_open = Boolean(menuView)
    const [selected, setSelected] = useState({})
    const history = useHistory()
    const handleChange = (event) => {
        let value = event.target.value;

        Object.assign(sendData, {
            "data": value,
            "press": "searchEmploye"
        })
    }

    const linkToLoan = (props) => {

        history.push('/Home/EmployHome/EmployeDet', { "data": props, })
    }
    const linkToAgent = (props) => {

        history.push('/Home/EmployHome/AgentColl', { "data": props, random: Math.random() })
    }
    const linkToLadger = (props) => {
        history.push('/Home/EmployHome/EmployeLadger', { "data": props, random: Math.random() })
    }

    const linktoattandance = (props) => {
        history.push('/Home/EmployHome/AttendanceCalendar', { "data": props, random: Math.random() })
    }
    const [isrefresh, setIsRefres] = React.useState(false)
    React.useEffect(() => {
        setLoading(true)
        fetch(Api + 'allEmploye')
            .then(res => res.json())
            .then(data => {
                setallLoan(data.data2);
                setLoading(false);
                setIsRefres(false)
            })
            .catch(err => {
                setLoading(false)
            })

    }, [isrefresh])


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

                <ListItem button key={key} >
                    <ListItemAvatar>
                        <Avatar>
                            <Example data={value.img} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText

                        primary={<Typography className={classess.font}>{value.name}</Typography>}
                        secondary={<Typography className={classess.fontSec}>{value.id}</Typography>}
                    />
                    <ListItemSecondaryAction style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <EmployeeTrans callback={value} />
                        {/* <IconButton onClick={(e)=>{setSelected({value : value, key : key});setMenuView(e.currentTarget)}} edge="end" size="small" aria-label="delete">
                    <ListAltIcon />
                </IconButton>
                <IconButton onClick={(e)=>{setSelected({value : value, key : key});setMenuView(e.currentTarget)}} edge="end" size="small" aria-label="delete">
                    <ImportContactsIcon />
                </IconButton> */}
                        <IconButton onClick={(e) => { setSelected({ value: value, key: key }); setMenuView(e.currentTarget) }} edge="end" size="small" aria-label="delete">
                            <NavigateNextIcon />
                        </IconButton>

                    </ListItemSecondaryAction>
                </ListItem>
            )
        });





    return (
        <Paper className={classess.Container} variant='outlined'>
            <Paper component="form" className={classess.search} variant='outlined'>
                <InputBase
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    placeholder="Search by account no or names"
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
                    <IconButton size="small" style={{ marginLeft: 10 }} onClick={() => setIsRefres(true)}>
                        <RefreshIcon />
                    </IconButton>

                </ListItem>
                <Divider />
                {ListGenerate()}
            </List>

            <Menu
                open={menu_open}
                anchorEl={menuView}
                onClose={() => setMenuView(false)}
            >
                <MenuItem onClick={() => { linkToAgent(selected.value, selected.key); setMenuView(null) }}>
                    <ListAltIcon />
                    Collection Records
                </MenuItem>
                <MenuItem onClick={() => { linkToLadger(selected.value, selected.key); setMenuView(null) }}>
                    <ImportContactsIcon />
                    Commission Records
                </MenuItem>
                <MenuItem onClick={() => { linktoattandance(selected.value, selected.key); setMenuView(null) }}>
                    <ImportContactsIcon />
                    Attandance Records
                </MenuItem>
                <MenuItem onClick={() => { linkToLoan(selected.value, selected.key); setMenuView(null) }}>
                    <NavigateNextIcon />
                    More
                </MenuItem>
            </Menu>
        </Paper>
    )
}

const useStyle = makeStyles((theme) => ({
    Container: {
        padding: 0,
        backgroundColor: '#fff',

        borderRadius: 3,
        overflowX: 'auto',
        height: '69vh',
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