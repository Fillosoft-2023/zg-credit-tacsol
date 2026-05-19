import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Toolbar,
    TextField
} from '@material-ui/core';

export default function Information() {

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', }}>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>
                    Informations Regarding The Software
                </Typography>
            </Toolbar>
            <Paper style={{margin:10,borderRadius:10}} elevation={0}>
                <Typography>
                    yuisdhfuihsduifh
                </Typography>
           </Paper>
        </Container>
    );
}
