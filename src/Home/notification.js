import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Toolbar,
    TextField
} from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

export default function Notification() {
    // Static array for notifications
    const notifications = [
        {
            type: 'New Update',
            title: 'New Updates Available',
            date: '21-01-2024',
            description: 'New Update Available For Sending Otp At Lower  Rate'
        },
        {
            type: 'Reminder',
            title: 'Annual Renewal ',
            date: '21-01-2024',
            description: 'Please Clear Your Annual Maintenance Charges.(Ps:Please Ignore This Message If Already Renewed)'
        },
        {
            type: 'Maintenance',
            title: 'Servvice Maintenace On 24th january ',
            date: '21-01-2024',
            description: 'There Will Be A servvice Maintenace From 12:30 pm to 1:30pm on 24th january'
        },
        {
            type: 'Others',
            title: 'Please Call Your It Administrator',
            date: '21-01-2024',
            description: 'Please Call Your IT Administrator For More Information About This Notification.'
        },
    ];

    const getBackgroundColor = (type) => {
        switch (type) {
            case 'New Update':
                return 'green';
            case 'Reminder':
                return 'blue';
            case 'Others':
                return 'orange';
            case 'Maintenance':
                return 'red';
            default:
                return 'grey';
        }
    };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                    Notifications
                </Typography>
            </Toolbar>
            <Paper style={{margin:10,borderRadius:10}} elevation={0}>
            <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    style={{borderRadius:10}}
                   
                />
            </Paper>
            {notifications.map((notification, index) => (
                <Paper
                    key={index}
                    style={{
                        margin: 10,
                        padding: 10,
                        borderRadius: 10,
                    }}
                    elevation={5}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                        <Typography style={{
                            fontWeight: 'bold', color: 'white',  padding: 5, paddingRight: 15,paddingLeft: 15, borderRadius: 10, backgroundColor: getBackgroundColor(notification.type),
                        }}>
                            {notification.type}
                        </Typography>
                        <Typography style={{ fontWeight: 'bold', color: 'grey',display:'flex' }}>
                            <AccessTime style={{marginRight:5}}/>
                            {notification.date}
                        </Typography>
                    </div>
                    <Typography style={{ fontWeight: 'bold', color: 'grey' }}>
                        {notification.title}
                    </Typography>
                    <Typography>
                        {notification.description}
                    </Typography>
                </Paper>
            ))}
        </Container>
    );
}
