import { Container, Divider, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { BiRupee } from "react-icons/bi";
import React, { useEffect, useState } from 'react';
import Api from '../api/api';
import { Collections } from '@material-ui/icons';

function DashboardCharts2() {
    const [data, setData] = useState({
        accounts_today: { today_dep: 0, today_with: 0 },
        emi_today: { today_emi: 0 },
        loan_today: { today_loan: 0 }
    });

    useEffect(() => {
        fetch(Api + 'moneyCount', {
            method: 'POST',
            body: JSON.stringify()
        })
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center', marginBottom: 5, backgroundColor: '#F8F9FA' }} elevation={0}>
                <Typography variant='h5' style={{ textAlign: 'center', fontWeight: 'bold', color: '#023e8a' }}>
                    Dashboard
                </Typography>
            </Toolbar>


            <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
                    <Paper elevation={0} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', padding: 15, borderRadius: 0 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3} md={3} component={Paper} style={{ backgroundColor: '#1572E8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                <IconButton>
                                    <BiRupee style={{ fontSize: 50, color: 'white' }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={9} sm={9} md={9}>
                                <Typography style={{ color: 'grey' }}>
                                    RD Deposit
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'left' }}>
                                    <Typography style={{ fontSize: 25 }}>
                                        {Number(data.accounts_today.today_dep).toFixed(2)}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Paper elevation={0} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', padding: 15, borderRadius: 10 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3} md={3} component={Paper} style={{ backgroundColor: '#48ABF7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                <IconButton>
                                    <BiRupee style={{ fontSize: 50, color: 'white' }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={9} sm={9} md={9}>
                                <Typography style={{ color: 'grey' }}>
                                    RD Withdrawl
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'left' }}>
                                    <Typography style={{ fontSize: 25 }}>
                                        {Number(data.accounts_today.today_with).toFixed(2)}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>

                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Paper elevation={0} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', padding: 15, borderRadius: 10 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3} md={3} component={Paper} style={{ backgroundColor: '#31CE36', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                <IconButton>
                                    <BiRupee style={{ fontSize: 50, color: 'white' }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={9} sm={9} md={9}>
                                <Typography style={{ color: 'grey' }}>
                                    EMI Collection
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'left' }}>
                                    <Typography style={{ fontSize: 25 }}>
                                        {Number(data.emi_today.today_emi).toFixed(2)}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>

                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Paper elevation={0} style={{ boxShadow: '0 2px 4px 0 rgba(0, 33, 247, 0.3)', padding: 15, borderRadius: 10 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3} md={3} component={Paper} style={{ backgroundColor: '#6861CE', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                <IconButton>
                                    <BiRupee style={{ fontSize: 50, color: 'white' }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={9} sm={9} md={9}>
                                <Typography style={{ color: 'grey' }}>
                                    Loan Disbursed
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'left' }}>
                                    <Typography style={{ fontSize: 25 }}>
                                        {Number(data.loan_today.today_loan).toFixed(2)}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default DashboardCharts2