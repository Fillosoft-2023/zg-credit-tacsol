import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper, Typography, Container, Button, CircularProgress, Divider, LinearProgress, TableContainer, Toolbar, Menu, MenuItem } from '@material-ui/core';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';

function MemberLoanDetails(props) {
    const { id } = props.location.state || {};
    const [data, setData] = useState(null);
    React.useEffect(() => {
        if (id) {
            fetch(Api + 'memLoanDetails2', {
                method: 'POST',
                body: JSON.stringify({ id: id }),
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
    }, [id]);



    const displayData = () => {
        if (!data) {
            return <Typography>No Loan Account Created yet</Typography>;
        }

        return (
            <TableContainer component={Paper}>
                <Table stickyHeader >
                <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">Loan No</TableCell>
                    <TableCell>{data.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">Loan A/C No</TableCell>
                    <TableCell>{data.ln_id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Loan Type</TableCell>
                    <TableCell>{data.ln_tpe === 'squred' ? 'secured' : data.ln_tpe}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Loan Date</TableCell>
                    <TableCell>{DateHandler(data.opn_dte)}</TableCell>
                </TableRow>
                {/* <TableRow>
                    <TableCell >Agent Id</TableCell>
                    <TableCell>{data.agnt_id}</TableCell>
                </TableRow> */}
                <TableRow>
                    <TableCell >Loan Amount</TableCell>
                    <TableCell>Rs.{data.ln_amnt}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Interest Rate</TableCell>
                    <TableCell>{data.intrst}%</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Loan Frequency</TableCell>
                   
                    <TableCell>{data.frequecy}</TableCell>
                    
                </TableRow>
                <TableRow>
                    <TableCell >Collection Day</TableCell>
                   
                    <TableCell>{data.collection_day}</TableCell>
                    
                </TableRow>
                <TableRow>
                    <TableCell >No Of EMI</TableCell>
                    <TableCell>
                        {data.no_emi}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >No Of Month</TableCell>
                    <TableCell>
                        {data.no_of_month}
                    </TableCell>
                </TableRow>
                {/*<TableRow>
                    <TableCell >Insurence</TableCell>
                    <TableCell>
                        {data.insrnce}
                    </TableCell>
                </TableRow>*/}
                <TableRow>
                    <TableCell >Processing Fees</TableCell>
                    <TableCell>
                        Rs.{data.pros_chrg}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Insurence</TableCell>
                    <TableCell>
                        Rs.{data.insrnce}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Service Tax</TableCell>
                    <TableCell>
                        Rs.{data.s_tax}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >EMI amount</TableCell>
                    <TableCell>
                        Rs.{data.emi_amnt}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >EMI Principle</TableCell>
                    <TableCell>
                        Rs.{data.emi_princ}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >EMI Interest</TableCell>
                    <TableCell>
                        Rs.{data.emi_intr}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell >Interest Amount</TableCell>
                    <TableCell>
                        Rs.{data.intrst_amnt}
                    </TableCell>
                </TableRow>
                <TableRow>
                <TableCell >Total Amount</TableCell>
                    <TableCell>
                        Rs.{data.totl_amnt}
                    </TableCell>
                </TableRow>
                <TableRow>
                <TableCell >Account Status</TableCell>
                    <TableCell>
                        {data.ln_stts}
                    </TableCell>
                </TableRow>
                {/* <TableRow>
                <TableCell >Created/Modified By</TableCell>
                    <TableCell>
                        {data.l_user}
                    </TableCell>
                </TableRow> */}

            </TableBody>
        

                </Table>
            </TableContainer>
        );
    };

    return (
        <Container maxWidth="false" component={Paper}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6' style={{fontWeight:'bold'}}>
                    Loan Details
                </Typography>
                <div>
                    {/* <Button variant='contained' color='primary' size='small'>
                        Edit Loan
                    </Button> */}
                </div>
            </Toolbar>
            {displayData()}
        </Container>
    );
}

export default MemberLoanDetails;
