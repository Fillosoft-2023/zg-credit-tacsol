import { Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Api from '../../api/api';
import { ArrowBack, GetApp, Print, Search } from '@material-ui/icons';
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import MyDocument from '../../pdf/juornal/savingsPrintDetails';


function SavingsCollectionDetails() {
    const location = useLocation();
    const agentId = location.state.agent_id;
    const [collection, setCollection] = React.useState([]);
    const [massg, setMssg] = useState(false);
    const today = new Date();
    const [ready, setReady] = React.useState(false)
    const [send, setSendData] = React.useState(null)
    const history = useHistory()
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



    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toISOString().split('T')[0],
        from: new Date(next).toISOString().split('T')[0],
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

    React.useEffect(() => {
        if (massg) {
            fetch(Api + 'agentSavingsCollectionDetails', {
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
        <Container maxWidth="xxl" component={Paper} variant="outlined" style={{ padding: 0 }} >
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
                <Typography style={{ display: 'flex', justifyContent: 'left' }}>
                    <Button onClick={() => history.push('/Home/EmployHome')}>
                        <ArrowBack />
                    </Button>
                    <Typography variant='h6' style={{ fontWeight: 'bold', marginLeft: 5 }}>
                        Savings Collection Details Of Agent ID: {agentId}
                    </Typography>
                </Typography>
                <div style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'space-between' }}>
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
                        style={{ marginLeft: 10 }}
                        value={searchDates.from}
                        onChange={handleDateChange}
                    />
                    <Button variant='contained' color='primary' onClick={handleSearch} style={{ marginLeft: 10 }}>
                        Search
                    </Button>
                    {
                        ready ? (
                            <PDFDownloadLink document={<MyDocument callback={send} DateDiffer={date} agentName={agentDetails.res_name} />} fileName={filename + "employeeRdCollectiondetails.pdf"}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                    <Tooltip title="download this sheet">
                                        <Button variant='contained' color='primary' onClick={() => setReady(false)} style={{ marginLeft: 10 }}>
                                            <GetApp />
                                        </Button>
                                    </Tooltip>

                                )}
                            </PDFDownloadLink>

                        ) : (

                            <Tooltip title="Print list">
                                <Button variant='contained' color='primary' onClick={() => handleDownload()} style={{ marginLeft: 10 }}>
                                    <Print />
                                </Button>
                            </Tooltip>
                        )
                    }
                </div>
            </Toolbar>
            <hr />
            <TableContainer style={{ height: '75vh', overflow: 'scroll' }}>
                <h5 style={{ paddingLeft: 10 }}>Agent Name: {agentDetails.res_name}</h5>

                <Table>
                    <TableRow>
                        <TableCell>Sl No.</TableCell>
                        <TableCell>A/C Type</TableCell>
                        <TableCell>A/C No.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                    <TableBody>
                        {
                            collection.map((item, index) => {
                                sum += Number(item.dep)
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.scheme}</TableCell>
                                        <TableCell>{!item.sav_no ? item.rd_no : item.sav_no}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>Rs.{item.dep}</TableCell>
                                        <TableCell>Rs.{sum}</TableCell>

                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
                <hr />

            </TableContainer>
        </Container>
    );
}

export default SavingsCollectionDetails;
