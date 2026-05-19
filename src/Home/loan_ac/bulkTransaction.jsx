import React, { useState, useEffect } from 'react';
import {
    Button, Container, Paper, Table, TableCell, TableContainer,
    TableHead, TableRow, Typography, TableBody,
    Toolbar,
    TextField,
    Checkbox,
    Tooltip,
} from '@material-ui/core';
import Api from '../../api/api';
import SnackBar from '../../consts/message';
import LoaderComponent from '../../consts/loader';
import { Save } from '@material-ui/icons';

function BulkTransaction() {
    const [loading, setLoading] = useState(false);
    const [massg, setMassg] = useState({});
    const [loans, setLoans] = useState([]);
    const [loanData, setLoanData] = useState([]);
    const [err, setErr] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [checked, setChecked] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);


    useEffect(() => {
        if (loans.length > 0) {
            const initialLoanData = loans.map((loan) => ({
                principle: '',
                interest: '',
                fine: '',
                date: '',
                emi_amount: '',
                reffer_id: loan.reffer_id,
                ac_no: loan.ac_no,
                emi_amnt: loan.emi_amnt,
                date: new Date().toISOString().split('T')[0],
                agent_id : loan.agnt_id,
                remarks : ''

            }));
            setLoanData(initialLoanData);
        }
    }, [loans]);

    const handleSearch = (frequency) => {
        setLoading(true);
        setErr([]);
        fetch(Api + 'bulkLoans', {
            method: 'POST',
            body: JSON.stringify({ frequency }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setLoans(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                setMassg({
                    open: true,
                    severity: 'error',
                    text: 'Failed to connect to the server',
                });
            });
    };

    const handleClick = (frequency) => {
        handleSearch(frequency);
    };

    const handleChange = (event, index) => {
        let name = event.target.name;
        let value = event.target.value;

        setDisabled(false);
        const newLoanData = [...loanData];
        newLoanData[index] = {
            ...newLoanData[index],
            [name]: value,
            reffer_id: loans[index] ? loans[index].reffer_id : '',
            agent_id: loans[index] ? loans[index].agnt_id : '',
            acno: loans[index] ? loans[index].acno : '',
            emi_amnt: loans[index] ? loans[index].emi_amnt : '',
            press: "loanTrans",
        };
        setLoanData(newLoanData);
    };

    const onChange = (amount, item, index) => {
        if (item === 'emi_amount' && loans[index]) {
            let loan_amount = Number(loans[index].ln_amnt);
            let interest_rate = Number(loans[index].intrst);
            if (interest_rate > 10) {
                alert("Found abnormal interest rate, auto calculation couldn't work for this account ");
            } else {
                let interest_amount = Number(loans[index].intrst_amnt);
                let total_recoverable = loan_amount + interest_amount;
                let emi_amnt = total_recoverable / loans[index].no_emi;
                let paid_amt_int = ((interest_amount / loans[index].no_emi) / emi_amnt) * amount;
                let paid_amt_princ = amount - paid_amt_int;
                const newLoanData = [...loanData];
                newLoanData[index] = {
                    ...newLoanData[index],
                    principle: paid_amt_princ.toFixed(2).toString(),
                    interest: paid_amt_int.toFixed(2).toString(),
                    emi_amount: amount
                };
                setLoanData(newLoanData);
            }
        } else {
            const newLoanData = [...loanData];
            newLoanData[index] = {
                ...newLoanData[index],
                [item]: amount
            };
            setLoanData(newLoanData);
        }
    };

    const validate = () => {
        let isValid = true;
        let error = [];

        loanData.forEach((data, index) => {
            if (data.emi_amount != '') {
                if (!data.date) {
                    isValid = false;
                    error[index] = { date: true };
                }
                if (!data.principle) {
                    isValid = false;
                    error[index] = {principle : true};
                }
                if (!data.interest) {
                    isValid = false;
                    error[index] = {interest : true};

                }
                if (Number((Number(loans[index].tot_princple) + Number(data.principle)).toFixed(2)) > Number(Number(loans[index].ln_amnt).toFixed(2)) + 0.9) {
                    isValid = false;
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Principle amount is greater than actual principle' + loans[index].name
                    });
                    error[index] = {principle : true}
                }

                if (Number(((loans[index].tot_interest) + Number(data.interest)).toFixed(2)) > Number(Number(loans[index].intrst_amnt).toFixed(2)) + 0.9 ) {
                    isValid = false;
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Interest amount is greater than actual Interest for  ' + loans[index].name
                    });
                    error[index] = {interest : true};

                }
            }
        });

        setErr(error);

        return isValid;
    };

    const handleSubmit = () => {
        setDisabled(true);
        const sendData = [];
        loanData.map((item, index) => {
            if (!item.emi_amount) {

            } else {
                sendData.push(item)
            }
        })
        if (validate()) {
            setLoading(true);
            fetch(Api + 'loanTransBulk', {
                method: 'POST',
                body: JSON.stringify({ ...sendData })
            })
                .then(res => res.json())
                .then(res => {
                    setLoading(false);
                    if (res.code === 200) {
                        setLoanData([])
                        setMassg({
                            open: true,
                            severity: 'success',
                            massg: res.massg
                        });
                    } else {
                        setMassg({
                            open: true,
                            severity: 'error',
                            massg: res.massg
                        });
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: 'Failed to connect to the server'
                    });
                });

        }
    };

    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar style={{ display: 'flex', justifyContent: "space-between" }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', padding: 0 }}>
                    <Button
                        variant='text'
                        color='primary'
                        style={{ marginRight: 5, fontWeight: 'bold' }}
                        onClick={() => handleClick(1)}
                    >
                        Daily
                    </Button>
                    <Button
                        variant='text'
                        color='primary'
                        style={{ marginRight: 5, fontWeight: 'bold' }}
                        onClick={() => handleClick(7)}
                    >
                        Weekly
                    </Button>
                    <Button
                        variant='text'
                        color='primary'
                        style={{ marginRight: 5, fontWeight: 'bold' }}
                        onClick={() => handleClick(30)}
                    >
                        Monthly
                    </Button>
                </div>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold', color: '#303F9F' }}>Daily Emi Collection</Typography>
                </div>
                <Button variant='contained' size='small' color='primary' onClick={handleSubmit}>
                    Save
                </Button>
            </Toolbar>
            {loading && <LoaderComponent />}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#888888' }}>
                            <TableCell style={{ color: 'white' }}>Sl No.</TableCell>
                            <TableCell style={{ color: 'white' }}>Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Reg No.</TableCell>
                            <TableCell style={{ color: 'white' }}>Loan Id.</TableCell>
                            <TableCell style={{ color: 'white' }}>Agent</TableCell>
                            <TableCell style={{ color: 'white' }}>EMI Amount</TableCell>
                            <TableCell style={{ color: 'white' }}>Paid Amount</TableCell>
                            <TableCell style={{ color: 'white' }}>Principle</TableCell>
                            <TableCell style={{ color: 'white' }}>Interest</TableCell>
                            <TableCell style={{ color: 'white' }}>Fine</TableCell>
                            <TableCell style={{ color: 'white' }}>Rec Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Remarks</TableCell>
                            <TableCell style={{ color: 'white' }}>Alert</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.map((loan, index) => (
                            <TableRow key={index} onClick={() => setSelectedLoan(loan)}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{loan.name}</TableCell>
                                <TableCell>{loan.ac_no}</TableCell>
                                <TableCell>{loan.ln_id}</TableCell>
                                <TableCell>{loan.ag_name}</TableCell>
                                <TableCell>Rs.{loan.emi_amnt}</TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        label="Paid Amount"
                                        size='small'
                                        type='number'
                                        name="emi_amount"
                                        onChange={(e) => onChange(e.target.value, 'emi_amount', index)}
                                        value={loanData[index]?.emi_amount || ''}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        label="Principle"
                                        size='small'
                                        type='number'
                                        name="principle"
                                        error={err[index]?.principle || false}
                                        value={loanData[index]?.principle || ''}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        label="Interest"
                                        size='small'
                                        type='number'
                                        name="interest"
                                        error={err[index]?.interest || false}
                                        value={loanData[index]?.interest || ''}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        label="Fine"
                                        size='small'
                                        type='number'
                                        name="fine"
                                        value={loanData[index]?.fine || ''}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        size='small'
                                        type='date'
                                        name="date"
                                        error={err[index]?.date || false}
                                        value={loanData[index]?.date || ''}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant='standard'
                                        size='small'
                                        type='text'
                                        name="remarks"
                                        value={loanData[index]?.remarks || ''}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <SnackBar massg={massg} setMassg={setMassg} />
        </Container>
    );
}

export default BulkTransaction;
