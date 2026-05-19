import React, { useState, useEffect } from 'react';
import {
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
    Menu,
    MenuItem
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Chat, People } from '@material-ui/icons';
import logo from '../../assets/logo.png';
import Api from '../../api/api';
import ImageApi from '../../api/image_api';

export default function ExistingHolder(props) {
    const classess = useStyle();
    const [allLoan, setallLoan] = useState(props.callback || []);
    const [sendData, setsendData] = useState({});
    const [loading, setLoading] = React.useState(false);
    const [menuView, setMenuView] = React.useState(null);
    const menu_open = Boolean(menuView);
    const [selected, setSelected] = useState({});
    const history = useHistory();

    const handleChange = (event) => {
            let value = event.target.value;
    
            setLoading(true)
            fetch(Api + 'searchCustomer', {
                method: "POST",
                body: JSON.stringify({ search: value })
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false)
                    setallLoan(res)
                })
        }

    const linkToLoan = (data) => {
        history.push('/Home/CustomerHome/CustomerDetails', { "data": data });
    };

    const linkToChat = (data) => {
        history.push('/Home/CustomerHome/CustomerChat', { "data": data, random: Math.random() });
    };

    const [isrefresh, setIsRefres] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        fetch(Api + 'registeredCustAppUsers')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setallLoan(Array.isArray(data.data2) ? data.data2 : []);
                setLoading(false);
                setIsRefres(false);
            })
            .catch(err => {
                console.error("Failed to fetch data:", err);
                setallLoan([]);
                setLoading(false);
                setIsRefres(false);
            });
    }, [isrefresh]);

    const ListGenerate = () => {
        if (allLoan.length === 0 && !loading) {
            return (
                <ListItem>
                    <ListItemText primary={<Typography align="center" color="textSecondary">No data available</Typography>} />
                </ListItem>
            );
        }

        return allLoan.map((value, key) => {
            let Example;
            if (value.img != null) {
                const imageUrl = ImageApi + value.img; 
                Example = () => (
                    <img
                        style={{ width: '100%' }}
                        src={imageUrl}
                        alt="User Avatar"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                        }}
                    />
                );
            } else {
                Example = () => (
                    <img
                        style={{ width: '100%' }}
                        src={logo}
                        alt="Default Avatar"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                        }}
                    />
                );
            }

            return (
                <ListItem button key={key}>
                    <ListItemAvatar>
                        <Avatar>
                            <Example />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography className={classess.font}>{value.name}</Typography>}
                        secondary={<Typography className={classess.fontSec}>{value.id}</Typography>}
                    />
                    <ListItemSecondaryAction style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton onClick={(e) => { setSelected({ value: value, key: key }); setMenuView(e.currentTarget); }} edge="end" size="small" aria-label="options">
                            <NavigateNextIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });
    };

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
            {loading && <LinearProgress />}
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
                <MenuItem onClick={() => { linkToChat(selected.value); setMenuView(null); }}>
                    <Chat style={{ marginRight: 10 }} />
                    Customer Chat
                </MenuItem>
                <MenuItem onClick={() => { linkToLoan(selected.value); setMenuView(null); }}>
                    <People style={{ marginRight: 10 }} />
                    User Profile
                </MenuItem>
            </Menu>
        </Paper>
    );
}

const useStyle = makeStyles(() => ({
    Container: {
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: 3,
        overflowX: 'hidden',
        overflowY: 'auto', 
        height: '68vh',
        '&::-webkit-scrollbar': {
            width: '0.4em',
            backgroundColor: 'transparent' 
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
}));