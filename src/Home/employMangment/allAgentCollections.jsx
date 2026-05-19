import { Container, Paper, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

function AllAgentCollections() {
    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper}>
                <Typography variant='h6' style={{ textAlign: 'center' }}>
                    <strong>
                        All Agent Collections
                    </strong>
                </Typography>
            </Toolbar>

        </Container>
    )
}

export default AllAgentCollections