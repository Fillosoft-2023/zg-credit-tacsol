import { Button, Container, IconButton, Paper, Toolbar, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom'

function Ticket() {
    return (
        <Container maxWidth="false" style={{ padding: 0, backgroundColor: '#F3F5F7', }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0, 33, 247, 0.3)' }}>
                <Typography variant='h6' style={{ fontWeight: 'bold', color: '#023E8A' }}>
                    Help Center
                </Typography>
            </Toolbar>
            <Container component={Paper} elevation={0} variant='outlined' maxWidth="lg" style={{ padding: 0, minHeight: '75vh' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 6px 0 rgba(0, 33, 247, 0.3)', marginTop: 5 }}>
                    <Typography>
                        Pending
                    </Typography>
                    <Link to="/Home/CreateTicket" style={{ textDecoration: 'none' }}>
                        <Button variant='contained' color='primary' size='small'>
                            Create new ticket
                        </Button>
                    </Link>
                </Toolbar>
                <div style={{ padding: 20 }}>
                    <Typography style={{ backgroundColor: '#F6F6FE', fontSize: 12, fontFamily: 'monospace' }}>
                        <strong>Note:</strong> Tickets sent only from your registered email id will be available here.
                    </Typography>
                </div>



            </Container>
        </Container>
    )
}

export default Ticket