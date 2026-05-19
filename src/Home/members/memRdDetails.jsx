import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper, Typography, Container, Button, CircularProgress, Divider, LinearProgress, TableContainer, Toolbar, Menu, MenuItem, IconButton, Grid } from '@material-ui/core';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ArrowBack } from '@material-ui/icons';

function MemberRdDetails(props) {
    const { acno } = props.location.state || {};
    const [data, setData] = useState(null);
    const history = useHistory()

    React.useEffect(() => {
        if (acno) {
            fetch(Api + 'memRdDetails', {
                method: 'POST',
                body: JSON.stringify({ acno: acno }),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return res.json();
                })
                .then(res => {
                    setData(res[0]);
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        }
    }, [acno]);



    const displayData = () => {
        if (!data) {
            return <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h5' style={{ marginTop: 50,color:'red' }}>
                        No RD Account Created Yet!
                    </Typography>
                </div>

            </>;
        }

        return (
            <TableContainer component={Paper}>
                <Table >
                <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">Registration NO</TableCell>
                    <TableCell>{data.acno}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">RD A/C No</TableCell>
                    <TableCell>{data.rd_no}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Open Date</TableCell>
                    <TableCell>{DateHandler(data.date)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Agent Id</TableCell>
                    <TableCell>{data.agent_id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Interest Rate</TableCell>
                    <TableCell>{data.intrest}%</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Processing Fees</TableCell>
                    <TableCell>
                        Rs.{data.proc_chrg}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Insurance Fees</TableCell>
                    <TableCell>
                        Rs.{data.insur}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Maturity Date</TableCell>
                    <TableCell>{DateHandler(data.mt_date)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Deposit Amount</TableCell>
                    <TableCell>Rs.{data.dep_amount}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Estimate Total deposit </TableCell>
                    <TableCell>Rs.{data.tot_dep_amt}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Estimate Total interest</TableCell>
                    <TableCell>Rs.{data.tot_int}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Estimate Total maturity</TableCell>
                    <TableCell>Rs.{data.mt_amt}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Tenure</TableCell>
                    <TableCell>{data.tenure}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Frequency</TableCell>
                    <TableCell>{data.frquency}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Account Status</TableCell>
                    <TableCell>
                        active
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Created/Modified By</TableCell>
                    <TableCell>
                        {data.s_user}
                    </TableCell>
                </TableRow>
               
                
                

            </TableBody>

                </Table>
            </TableContainer>
        );
    };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', marginBottom: 10 }}>
                <Grid container >
                    <Grid item md={7} lg={7}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton onClick={() => history.push('/Home/AllMembers/')}>
                                <ArrowBack />
                            </IconButton>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                RD Account Details
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item md={5} lg={5}>
                    </Grid>
                </Grid>

            </Toolbar>
            {displayData()}
        </Container>
    );
}

export default MemberRdDetails;
