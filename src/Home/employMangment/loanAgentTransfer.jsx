import {
    Container,
    Paper,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    Snackbar
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Api from '../../api/api';
import { Alert } from '@material-ui/lab';

function LoanAgentTransfer() {
    const location = useLocation();
    const { agentId, agentName, accountCount } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [loanAccounts, setLoanAccounts] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [selectedNewAgent, setSelectedNewAgent] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchLoanAccounts = () => {
        setLoading(true);
        fetch(Api + 'getLoanAccountsForTransfer', {
            method: 'POST',

            body: JSON.stringify({ agent_id: agentId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLoanAccounts(data.loanAccounts || []);
                    setAgents(data.agents || []);
                } else {
                    showSnackbar(data.message || 'Error fetching data', 'error');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching loan accounts:', err);
                showSnackbar('Error fetching loan accounts', 'error');
                setLoading(false);
            });
    };

    useEffect(() => {
        if (agentId) {
            fetchLoanAccounts();
        }
    }, [agentId]);

    const handleTransfer = () => {
        if (selectedAccounts.length === 0) {
            showSnackbar('Please select at least one loan account', 'warning');
            return;
        }

        if (!selectedNewAgent) {
            showSnackbar('Please select a new agent', 'warning');
            return;
        }

        setTransferring(true);
        fetch(Api + 'updateLoanAgent', {
            method: 'POST',
            
            body: JSON.stringify({
                loan_ids: selectedAccounts,
                new_agent_id: selectedNewAgent,
                current_agent_id: agentId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showSnackbar(data.message, 'success');
                    // Refresh data
                    fetchLoanAccounts();
                    setSelectedAccounts([]);
                    setSelectedNewAgent('');
                } else {
                    showSnackbar(data.message, 'error');
                }
                setTransferring(false);
            })
            .catch(err => {
                console.error('Error transferring accounts:', err);
                showSnackbar('Transfer failed', 'error');
                setTransferring(false);
            });
    };

    const handleSelectAccount = (loanId) => {
        setSelectedAccounts(prev =>
            prev.includes(loanId)
                ? prev.filter(id => id !== loanId)
                : [...prev, loanId]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedAccounts(loanAccounts.map(account => account.ln_id));
        } else {
            setSelectedAccounts([]);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'green';
            case 'closed': return 'red';
            case 'pending': return 'orange';
            default: return 'gray';
        }
    };

    return (
        <Container component={Paper} maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ justifyContent: 'center', marginBottom: 5 }}>
                <Typography variant='h6' style={{ fontWeight: 'bold', color: '#303F9F', textAlign: 'center' }}>
                    Agent Loan Transfer
                </Typography>
            </Toolbar>

            <Toolbar elevation={0} component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ fontWeight: 'bold' }}>Agent: {agentName}</Typography>
                <Typography style={{ fontWeight: 'bold' }}>Agent ID: {agentId}</Typography>
                <Typography style={{ fontWeight: 'bold' }}>Total Accounts: {accountCount}</Typography>
            </Toolbar>

            {/* Transfer Controls */}
            <Box p={2} component={Paper} elevation={1} style={{ margin: '16px 0' }}>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        Selected: {selectedAccounts.length} account(s)
                    </Typography>
                    <div>
                        <FormControl variant="outlined" size="small" style={{ minWidth: 200, marginRight: 5 }}>
                            <InputLabel>Transfer To Agent</InputLabel>
                            <Select
                                value={selectedNewAgent}
                                onChange={(e) => setSelectedNewAgent(e.target.value)}
                                label="Transfer To Agent"
                            >
                                <MenuItem value=""><em>Select Agent</em></MenuItem>
                                {agents.map(agent => (
                                    <MenuItem key={agent.id} value={agent.id}>
                                        {agent.ag_name} ({agent.id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{ marginRight: 5 }}
                            onClick={handleTransfer}
                            disabled={transferring || selectedAccounts.length === 0 || !selectedNewAgent}
                            startIcon={transferring ? <CircularProgress size={20} /> : null}
                        >
                            {transferring ? 'Transferring...' : 'Transfer Selected Accounts'}
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setSelectedAccounts([]);
                                setSelectedNewAgent('');
                            }}
                        >
                            Clear Selection
                        </Button>
                    </div>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedAccounts.length > 0 && selectedAccounts.length < loanAccounts.length}
                                    checked={loanAccounts.length > 0 && selectedAccounts.length === loanAccounts.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Reg No.</TableCell>
                            <TableCell>Loan No.</TableCell>
                            <TableCell>Account Holder</TableCell>
                            <TableCell>Loan Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : loanAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No loan accounts found for this agent
                                </TableCell>
                            </TableRow>
                        ) : (
                            loanAccounts.map(account => (
                                <TableRow key={account.ln_id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedAccounts.includes(account.ln_id)}
                                            onChange={() => handleSelectAccount(account.ln_id)}
                                        />
                                    </TableCell>
                                    <TableCell>{account.ac_no}</TableCell>
                                    <TableCell>{account.ln_id}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        {account.account_holder_name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        ₹{Number(account.ln_amnt).toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            style={{
                                                color: account.ln_stts === 'not submitted' ? 'green' : 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {account.ln_stts === 'not submitted' ? 'Active' : 'Closed'}
                                        </span>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default LoanAgentTransfer;