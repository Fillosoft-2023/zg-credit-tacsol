import React, { useEffect, useRef, useState } from 'react';
import {
    Container,
    Paper,
    makeStyles,
    TextField,
    Typography,
    IconButton,
    Toolbar,
} from '@material-ui/core';
import { ArrowBack, Send } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function CustomerChat(props) {
    const classes = useStyles();
    const history = useHistory();
    const messagesEndRef = useRef(null);

    const dummyMessages = [
        { sender: 'customer', message: 'Hi, I have a question.', timestamp: '10:00 AM' },
        { sender: 'admin', message: 'Sure, go ahead!', timestamp: '10:01 AM' },
        { sender: 'customer', message: 'How do I check my balance?', timestamp: '10:02 AM' },
        { sender: 'admin', message: 'Check Dashboard > Balance.', timestamp: '10:03 AM' },
    ];

    const [chatMessages, setChatMessages] = useState(dummyMessages);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newEntry = {
            sender: 'admin',
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, newEntry]);
        setNewMessage('');
    };

    return (
        <Container component={Paper} maxWidth="false" className={classes.root}>
            <Toolbar className={classes.header}>
                <IconButton onClick={() => history.push('/Home/CustomerHome')}>
                    <ArrowBack  style={{color:'white'}}/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>Customer Chat</Typography>
            </Toolbar>

            <div className={classes.chatContainer}>
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${classes.messageBubble} ${msg.sender === 'admin' ? classes.adminBubble : classes.customerBubble}`}
                    >
                        <Typography className={classes.messageText}>{msg.message}</Typography>
                        <Typography className={classes.timestamp}>{msg.timestamp}</Typography>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={classes.inputContainer}>
                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={classes.inputField}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                    <Send />
                </IconButton>
            </div>
        </Container>
    );
}

const useStyles = makeStyles(() => ({
    root: {
        padding: 0,
        height: '83vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#303F9F',
        color: '#fff',
        padding: '8px 12px',
    },
    title: {
        marginLeft: 10,
        fontWeight: 600,
    },
    chatContainer: {
        flex: 1,
        padding: 10,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    messageBubble: {
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: 20,
        marginBottom: 10,
        position: 'relative',
        display: 'inline-block',
        wordBreak: 'break-word',
    },
    adminBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderTopRightRadius: 0,
    },
    customerBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: '15px',
        color: '#303030',
    },
    timestamp: {
        fontSize: '11px',
        color: '#888',
        textAlign: 'right',
        marginTop: 4,
    },
    inputContainer: {
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ccc',
    },
    inputField: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: '0 px',
    },
}));
