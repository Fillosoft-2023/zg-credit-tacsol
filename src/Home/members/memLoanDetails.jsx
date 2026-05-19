import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Typography,
    Container,
    Toolbar,
    CircularProgress,
    TableContainer,
    IconButton,
    Button,
    Grid,
    TableHead,
} from '@material-ui/core';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import { ArrowBack, MoreHorizSharp } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function MemberLoanDetails(props) {
    const { acno } = props.location.state || {};
    const [data, setData] = useState(null);
    const history = useHistory();




    const handleMoreClick = (id) => {
        history.push(`/home/LoanDetailsMem/${id}`, { id });

    };
    useEffect(() => {
        if (acno) {
            fetch(Api + 'memLoanDetails', {
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
                    setData(res);
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        }
    }, [acno]);

    const displayData = () => {
        if (!data || data.length === 0) {
            return <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5' style={{ marginTop: 50, color: 'red' }}>
                        No Loan Account Created Yet!
                    </Typography>
                </div>

            </>;
        }

        const combinedData = data.flatMap(item => item);

        return (
            <TableContainer component={Paper}>
                <Table aria-label="Registration Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl.No</TableCell>
                            <TableCell>Loan A/C No</TableCell>
                            <TableCell>Opening Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>More</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {combinedData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell >{index + 1}</TableCell>
                                <TableCell>{item.ln_id}</TableCell>
                                <TableCell>{item.opn_dte}</TableCell>
                                <TableCell>Rs.{item.ln_amnt}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleMoreClick(item.id)} variant='contained' size='small' color='primary'>
                                        More
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', marginBottom: 5 }}>
                <Grid container >
                    <Grid item md={7} lg={7}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton onClick={() => history.push('/Home/AllMembers/')}>
                                <ArrowBack />
                            </IconButton>
                            <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                                Loan Account Details
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

export default MemberLoanDetails;
