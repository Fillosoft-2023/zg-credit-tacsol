import { Container, Paper, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import AgentTransfer from './agentTransfer'

function EmployeeSettings() {
  return (
    <Container component={Paper} style={{ padding: 0, minHeight: '84vh' }}>
      <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h6' style={{ color: '#303F9F', fontWeight: 'bold' }}>
          Agent Transfer Settings
        </Typography>
      </Toolbar>
<AgentTransfer/>
    </Container>
  )
}

export default EmployeeSettings