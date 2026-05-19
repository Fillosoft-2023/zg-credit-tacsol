import React from 'react';
import { Button, Container, IconButton, Paper, Toolbar, Typography, TextField, Grid, Box } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

function CreateTicket() {
    return (
        <Container maxWidth="false" style={{ padding: 0, backgroundColor: '#F3F5F7' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0, 33, 247, 0.3)' }}>
                <Typography variant='h6' style={{ fontWeight: 'bold', color: '#023E8A' }}>
                    Help Center
                </Typography>
            </Toolbar>
            <Container component={Paper} elevation={0} variant='outlined' maxWidth="lg" style={{ padding: 0, minHeight: '75vh' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 6px 0 rgba(0, 33, 247, 0.3)', marginTop: 5 }}>
                    <IconButton>
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant='h6'>
                        Submit a ticket
                    </Typography>
                    <div></div>
                </Toolbar>
                <div style={{ padding: 20 }}>

                    <div>
                        <form noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        defaultValue="ashirbad@tacsol.in"
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="subject"
                                        label="Subject"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        multiline
                                        rows={6}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="text"
                                        component="label"
                                        color='primary'
                                    >
                                        + Attach a file
                                        <input
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" style={{ marginRight: 10 }}>
                                            Submit
                                        </Button>
                                        <Button variant="contained" color="secondary">
                                            Cancel
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default CreateTicket;
