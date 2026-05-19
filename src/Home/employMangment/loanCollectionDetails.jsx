import { Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Toolbar, Tooltip } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Api from '../../api/api';
import { ArrowBack, GetApp, Print, Search } from '@material-ui/icons';
import MyDocument from '../../pdf/juornal/employeeLoanCollectionDetails';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LoanCollectionDetails() {
    const history = useHistory()
    const location = useLocation();
    const agentId = location.state.agent_id;
    const [collection, setCollection] = React.useState([]);
    const [massg, setMssg] = useState(false);
    const today = new Date();

    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toISOString().split('T')[0], // Correct date format
        from: new Date(next).toISOString().split('T')[0], // Correct date format
    });
    const [searchDates, setSearchDates] = useState({
        to: new Date().toISOString().split('T')[0],
        from: new Date(next).toISOString().split('T')[0],
    });

    const handleDateChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setSearchDates({
            ...searchDates,
            [name]: value,
        });
    };

    const handleSearch = () => {
        setDate({ ...searchDates });
        setMssg(!massg);
    };
    const filename = Math.floor(Math.random() * 10000000);
    const handleDownload = () => {
        setSendData(collection)
        setReady(true)
    }
    const [agentDetails, setAgentDetails] = React.useState({ ag_name: '' });
    React.useEffect(() => {
        fetch(Api + 'agentDetails', {
            method: 'POST',
            body: JSON.stringify({ agentId: location.state.agent_id })
        })
            .then(res => res.json())
            .then(res => setAgentDetails(res))
            .catch(err => {
                console.log(err);
            });
    }, [location.state.agent_id]);


    React.useEffect(() => {
        if (massg) {
            fetch(Api + 'agentLoanCollectionDetails', {
                method: 'POST',
                body: JSON.stringify({
                    ...searchDates,
                    agent_id: agentId,
                }),
            })
                .then((res) => res.json())
                .then((res) => setCollection(res))
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [massg, agentId, searchDates]);
    let sum = 0;
    return (
        <Container maxWidth="false" style={{ padding: 0 }} component={Paper}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <IconButton onClick={() => history.push('/Home/EmployHome')}>
                    <ArrowBack />
                </IconButton>
                <div>
                    <h3>Agent Loan Collection Details: </h3>
                </div>
                <div>
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="to"
                        value={searchDates.to}
                        onChange={handleDateChange}
                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginLeft: 10, marginRight: 10 }}
                        value={searchDates.from}
                        onChange={handleDateChange}
                    />
                    <Button color='primary' variant='contained' onClick={handleSearch} >
                        Search
                    </Button>
                    {
                        ready ? (
                            <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} agentName={agentDetails.res_name} />} fileName={filename + "employeeRdCollectiondetails.pdf"}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                    <Tooltip title="Download this sheet">
                                        <Button color='primary' variant='contained' style={{ marginLeft: 10 }} onClick={() => setReady(false)}>
                                            <GetApp />
                                        </Button>
                                    </Tooltip>
                                )}
                            </PDFDownloadLink>


                        ) : (

                            <Tooltip title="Print list">
                                <Button color='primary' variant='contained' style={{ marginLeft: 10 }} onClick={() => handleDownload()}>
                                    <Print />
                                </Button>
                            </Tooltip>
                        )
                    }
                </div>
            </Toolbar>
            <TableContainer style={{ height: '75vh', overflow: 'scroll' }}>
                <h5 style={{ paddingLeft: 10 }}>Agent Name: {agentDetails.res_name}</h5>

                <Table>
                    <TableRow>
                        <TableCell>Sl No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Reg No.</TableCell>
                        <TableCell>Loan A/C No.</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Emi Amount</TableCell>
                        <TableCell>Total</TableCell>

                    </TableRow>
                    <TableBody>
                        {collection.map((item, index) => {
                            sum += Number(item.ttl);
                            return (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{item.ln_id}</TableCell>
                                    <TableCell>{item.recived_date}</TableCell>
                                    <TableCell>Rs.{item.ttl}</TableCell>
                                    <TableCell>Rs.{sum}</TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default LoanCollectionDetails;
