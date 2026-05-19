import React, { useState, useRef, useEffect } from 'react';
import {
    Button, Container, FormControl, MenuItem, Paper, Table, TableCell, TableContainer,
    TableHead, TableRow, TextField, Toolbar, Typography, Select, TableBody,
    LinearProgress, Menu,
    Tooltip,
    IconButton
} from '@material-ui/core';
import Api from '../../api/api';
import SnackBar from '../../consts/message';
import CollectionPrint from './collectionPrint';
import { PDFExport } from '@progress/kendo-react-pdf';
import { ArrowBack, Print, Tune } from '@material-ui/icons';

function Collection() {
    const [selectedAccountType, setSelectedAccountType] = useState('');
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [massg, setMassg] = useState({});
    const [date, setDate] = useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date().toLocaleDateString("en-CA"),
    });
    const [agentsMenuAnchor, setAgentsMenuAnchor] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [agents, setAgents] = useState({});

    const pdfExportComponent = useRef(null);

    const handleAccountTypeChange = (event) => {
        setSelectedAccountType(event.target.value);
    };

    const handleSearch = () => {
        setLoading(true);
        fetch(Api + 'allTransaction', {
            method: 'POST',
            body: JSON.stringify({
                ...date,
                transactionType: selectedAccountType
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(res => {
                let groupedArray = res.reduce((acc, curr) => {
                    const found = acc.find(item => item[0].ac_number === curr.ac_number);
                    if (found) {
                        found.push(curr);
                    } else {
                        acc.push([curr]);
                    }
                    return acc;
                }, []);
                setTableData(groupedArray);
                setFilteredData(groupedArray);
                setLoading(false);
                fetchAgentDetails(groupedArray);
            })
            .catch(err => {
                setLoading(false);
                setMassg({
                    open: true,
                    severity: 'error',
                    text: 'Failed to connect to the server'
                });
            });
    };

    const fetchAgentDetails = async (groupedArray) => {
        const agentIds = [...new Set(groupedArray.flat().map(item => item.agnt_id))];
        const agentDetails = {};
        for (const id of agentIds) {
            try {
                const res = await fetch(Api + 'agentDetails', {
                    method: 'POST',
                    body: JSON.stringify({ agentId: id })
                });
                const data = await res.json();
                agentDetails[id] = data.ag_name;
            } catch (error) {
                console.error(`Failed to fetch agent details for agent ID ${id}`, error);
            }
        }
        setAgents(agentDetails);
    };

    const handleMenuOpen = (event) => {
        setAgentsMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAgentsMenuAnchor(null);
    };

    const handleAgentSelect = (agentId) => {
        setSelectedAgent(agentId);
        setAgentsMenuAnchor(null);
        const filteredList = tableData.map(group =>
            group.filter(item => item.agnt_id === agentId)
        ).filter(group => group.length > 0);
        setFilteredData(filteredList);
    };

    const getUniqueAgents = () => {
        return Object.entries(agents).map(([id, name]) => ({ id, name }));
    };
    let grand_total = 0;
    let grand_total_sav = 0;
    return (
        <Container maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: "space-between" }}>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold', color: '#303F9F' }}>Members Collection Report</Typography>
                </div>
                <div>
                    <FormControl variant="outlined" style={{ marginRight: 10 }} size='small'>

                        <Select
                            value={selectedAccountType}
                            onChange={handleAccountTypeChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Select Account Type' }}

                        >
                            <MenuItem value="">Account Type</MenuItem>
                            <MenuItem value="RD">RD</MenuItem>
                            <MenuItem value="Savings">Savings</MenuItem>
                            <MenuItem value="EMI">LOAN</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="to"
                        onChange={(e) => setDate({ ...date, to: e.target.value })}
                        value={date.to}
                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginLeft: 10, marginRight: 10 }}
                        onChange={(e) => setDate({ ...date, from: e.target.value })}
                        value={date.from}
                    />
                    <Button variant='contained' color='primary' onClick={handleSearch} style={{ marginRight: 10 }}>
                        Search
                    </Button>
                    <Tooltip title="Filter By Agent">

                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: 10, marginRight: 10 }}
                            onClick={handleMenuOpen}
                        >
                            <Tune />
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={agentsMenuAnchor}
                        open={Boolean(agentsMenuAnchor)}
                        onClose={handleMenuClose}
                    >
                        {getUniqueAgents().map(({ id, name }) => (
                            <MenuItem key={id} onClick={() => handleAgentSelect(id)}>
                                {name}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{ marginRight: 5 }}
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <Tooltip title="Print">
                            <Print />
                        </Tooltip>
                    </Button>
                </div>
            </Toolbar>
            {loading ? <LinearProgress style={{ width: '100%', backgroundColor: 'red' }} /> : ''}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#888888' }}>
                            <TableCell style={{ color: 'white' }}>Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Reg No.</TableCell>
                            <TableCell style={{ color: 'white' }}>A/C No.</TableCell>
                            <TableCell style={{ color: 'white' }}>Agent</TableCell>
                            <TableCell style={{ color: 'white' }}>Received Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => {
                            let groupTotal = 0;
                            let groupSavTotal = 0;

                            return (
                                <React.Fragment key={index}>
                                    {row.map((item, index2) => {
                                        const amount = selectedAccountType === "EMI" ? Number(item.ttl) : Number(item.dep);
                                        if (selectedAccountType === "EMI") {
                                            groupTotal += amount;
                                            grand_total += amount;
                                        } else {
                                            groupSavTotal += amount > 0 ? amount : 0;
                                            grand_total_sav += amount > 0 ? amount : 0;
                                        }

                                        return (
                                            <TableRow key={index2} style={{ backgroundColor: '#fff' }}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.ac_no}</TableCell>
                                                <TableCell>{item.ac_number}</TableCell>
                                                <TableCell>{agents[item.agnt_id]}</TableCell>
                                                <TableCell>{item.recived_date || item.date}</TableCell>
                                                <TableCell>Rs.{amount}</TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    <TableRow style={{ backgroundColor: '#d8f3dc' }}>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#55a630' }}>Total</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#55a630' }}>
                                            Rs.{selectedAccountType === "EMI" ? groupTotal : groupSavTotal}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                        <TableRow style={{ backgroundColor: '#d8f3dc' }}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{ fontWeight: 'bold', color: 'red' }}>Grand Total</TableCell>
                            <TableCell style={{ fontWeight: 'bold', color: 'red' }}>
                                Rs.{selectedAccountType === "EMI" ? grand_total : grand_total_sav}
                            </TableCell>
                        </TableRow>
                    </TableBody>

                </Table>
            </TableContainer>
            <SnackBar massg={massg} setMassg={setMassg} />
            <div
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: 0,
                }}
            >
                <PDFExport keepTogether='.keep' paperSize="A4" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='collection_report.pdf' ref={pdfExportComponent}>
                    <CollectionPrint data={filteredData} accountType={{ type: selectedAccountType }} agents={agents} />
                </PDFExport>
            </div>
        </Container>
    );
}

export default Collection;