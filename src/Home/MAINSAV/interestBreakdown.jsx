import React, { useState, useEffect } from 'react';
import {
    Paper, Table,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Container,
    Toolbar,
    Typography
} from '@material-ui/core'; import Api from '../../api/api';

const InterestBreakdown = (props) => {
    const id = props.location.state.data.sav_no;
    const [data, setData] = useState([]);
    useEffect(() => {
        if (id) {
            fetch(Api + 'savIntDetails', {
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
                    setData(res);
                    console.log(res)
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        }
    }, [id]);
    let total = 0;
    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                    Savings A/C Interest Breakdown
                </Typography>
            </Toolbar>
            <div>
                <TableContainer component={Paper} style={{maxHeight:'77vh'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sl No.</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Interest Amount</TableCell>
                                <TableCell>Total Interest</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => {
                                total += Number(item.amount)
                                return (

                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>Rs.{Number(item.amount).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{total.toFixed(2)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    );
};

export default InterestBreakdown;
