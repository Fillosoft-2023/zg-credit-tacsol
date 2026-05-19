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

function FdAgentTransfer() {
    const location = useLocation();
    const { agentId, agentName, accountCount } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [fdAccounts, setFdAccounts] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [selectedNewAgent, setSelectedNewAgent] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchFdAccounts = () => {
        setLoading(true);
        fetch(Api + 'getFdAccountsForTransfer', {
            method: 'POST',
            
            body: JSON.stringify({ agnt_id: agentId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFdAccounts(data.fdAccounts || []);
                    setAgents(data.agents || []);
                } else {
                    showSnackbar(data.message || 'Error fetching data', 'error');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching FD accounts:', err);
                showSnackbar('Error fetching FD accounts', 'error');
                setLoading(false);
            });
    };

    useEffect(() => {
        if (agentId) {
            fetchFdAccounts();
        }
    }, [agentId]);

    const handleTransfer = () => {
        if (selectedAccounts.length === 0) {
            showSnackbar('Please select at least one FD account', 'warning');
            return;
        }

        if (!selectedNewAgent) {
            showSnackbar('Please select a new agent', 'warning');
            return;
        }

        setTransferring(true);
        fetch(Api + 'updateFdAgent', {
            method: 'POST',
          
            body: JSON.stringify({
                account_ids: selectedAccounts,
                new_agent_id: selectedNewAgent,
                current_agent_id: agentId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showSnackbar(data.message || 'FD accounts transferred successfully', 'success');
                    // Refresh data
                    fetchFdAccounts();
                    setSelectedAccounts([]);
                    setSelectedNewAgent('');
                } else {
                    showSnackbar(data.message || 'Transfer failed', 'error');
                }
                setTransferring(false);
            })
            .catch(err => {
                console.error('Error transferring accounts:', err);
                showSnackbar('Transfer failed', 'error');
                setTransferring(false);
            });
    };

    const handleSelectAccount = (accountId) => {
        setSelectedAccounts(prev =>
            prev.includes(accountId)
                ? prev.filter(id => id !== accountId)
                : [...prev, accountId]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedAccounts(fdAccounts.map(account => account.id));
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
            case 'matured': return 'blue';
            case 'closed': return 'red';
            case 'pending': return 'orange';
            default: return 'gray';
        }
    };

    // Calculate current balance for FD account
    const calculateCurrentBalance = (account) => {
        const initialDep = parseFloat(account.initial_dep) || 0;
        const totalDep = parseFloat(account.tot_dep) || 0;
        const totalWith = parseFloat(account.tot_with) || 0;
        const totalInterest = parseFloat(account.tot_interest) || 0;
        
        return initialDep + totalDep + totalInterest - totalWith;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    return (
        <Container component={Paper} maxWidth="false" style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ justifyContent: 'center', marginBottom: 5 }}>
                <Typography variant='h6' style={{ fontWeight: 'bold', color: '#303F9F', textAlign: 'center' }}>
                    Agent FD Transfer
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
            <TableContainer component={Paper} style={{height:'60vh',overflow:'scroll'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedAccounts.length > 0 && selectedAccounts.length < fdAccounts.length}
                                    checked={fdAccounts.length > 0 && selectedAccounts.length === fdAccounts.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Reg No.</TableCell>
                            <TableCell>FD No.</TableCell>
                            <TableCell>Account Holder</TableCell>
                            <TableCell>Reference ID</TableCell>
                            <TableCell>Initial Amount</TableCell>
                            <TableCell>Maturity Amount</TableCell>
                            <TableCell>Interest Amount</TableCell>
                            <TableCell>Maturity Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : fdAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    No FD accounts found for this agent
                                </TableCell>
                            </TableRow>
                        ) : (
                            fdAccounts.map(account => {
                                return (
                                    <TableRow key={account.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedAccounts.includes(account.id)}
                                                onChange={() => handleSelectAccount(account.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{account.ac_no}</TableCell>
                                        <TableCell>{account.id}</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>
                                            {account.account_holder_name || 'N/A'}
                                        </TableCell>
                                        <TableCell>{account.reffer_id || 'N/A'}</TableCell>
                                        <TableCell>
                                            ₹{Number(account.initial_dep || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            ₹{Number(account.mt_amt || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            ₹{Number(account.int_amt || 0).toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(account.mt_dt)}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    color: getStatusColor(account.mt_stus),
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {account.mt_stus || 'N/A'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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

export default FdAgentTransfer;