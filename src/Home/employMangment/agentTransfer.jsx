import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    Button,
    CircularProgress,
    Box,
    Tooltip
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Api from '../../api/api';
import { useHistory } from 'react-router-dom'

function AgentTransfer() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [agentsData, setAgentsData] = useState([]);
    const [isrefresh, setIsRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(Api + 'agentAccountCount')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAgentsData(data.data || []);
                }
                setLoading(false);
                setIsRefresh(false);
            })
            .catch(err => {
                console.error('Error fetching agent data:', err);
                setLoading(false);
            });
    }, [isrefresh]);

    const handleAccountClick = (agent, accountType) => {
        const count = getAccountCount(agent, accountType);
        if (count === 0) return;

        // Use history.push for React Router v5
        switch (accountType) {
            case 'loan':
                history.push('/Home/EmployHome/LoanAgentTransfer', { 
                    agentId: agent.id,
                    agentName: agent.ag_name,
                    accountType: 'loan',
                    accountCount: agent.loan_account_count
                });
                break;
            case 'savings':
                history.push('/Home/EmployHome/SavingsAgentTransfer', { 
                    agentId: agent.id,
                    agentName: agent.ag_name,
                    accountType: 'savings',
                    accountCount: agent.sav_account_count
                });
                break;
            case 'rd':
                history.push('/Home/EmployHome/RdAgentTransfer', { 
                    agentId: agent.id,
                    agentName: agent.ag_name,
                    accountType: 'rd',
                    accountCount: agent.rd_account_count
                });
                break;
            case 'fd':
                history.push('/Home/EmployHome/FdAgentTransfer', { 
                    agentId: agent.id,
                    agentName: agent.ag_name,
                    accountType: 'fd',
                    accountCount: agent.fd_account_count
                });
                break;
            default:
                break;
        }
    };
    const getAccountCount = (agent, accountType) => {
        switch (accountType) {
            case 'loan': return agent.loan_account_count || 0;
            case 'savings': return agent.sav_account_count || 0;
            case 'rd': return agent.rd_account_count || 0;
            case 'fd': return agent.fd_account_count || 0;
            default: return 0;
        }
    };

    const getButtonVariant = (count) => {
        return count > 0 ? 'outlined' : 'text';
    };

    const getButtonColor = (count) => {
        return count > 0 ? 'primary' : 'default';
    };

    const getTooltipTitle = (count, accountType) => {
        if (count === 0) return `No ${accountType} accounts`;
        return `View ${count} ${accountType} account${count > 1 ? 's' : ''}`;
    };

    return (
        <Container component={Paper} maxWidth={false} style={{ padding: 0 }}>
            <Toolbar component={Paper}>
                <Typography variant='h6' style={{ fontWeight: 'bold', color: '#303F9F' }}>
                    Agent Accounts Overview
                </Typography>
            </Toolbar>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No.</TableCell>
                            <TableCell>Agent Name</TableCell>
                            <TableCell>Agent ID</TableCell>
                            <TableCell align="center">Loan Accounts</TableCell>
                            <TableCell align="center">Savings Accounts</TableCell>
                            <TableCell align="center">RD Accounts</TableCell>
                            <TableCell align="center">FD Accounts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : agentsData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No agents found
                                </TableCell>
                            </TableRow>
                        ) : (
                            agentsData.map((agent, index) => (
                                <TableRow key={agent.id || index} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        {agent.ag_name || 'N/A'}
                                    </TableCell>
                                    <TableCell>{agent.id || 'N/A'}</TableCell>

                                    {/* Loan Accounts Button */}
                                    <TableCell align="center">
                                        <Tooltip title={getTooltipTitle(agent.loan_account_count, 'loan')}>
                                            <Button
                                                variant={getButtonVariant(agent.loan_account_count)}
                                                color={getButtonColor(agent.loan_account_count)}
                                                size="small"
                                                onClick={() => handleAccountClick(agent, 'loan')}
                                                disabled={!agent.loan_account_count}
                                                style={{
                                                    minWidth: '60px',
                                                    fontWeight: agent.loan_account_count ? 'bold' : 'normal'
                                                }}
                                            >
                                                {agent.loan_account_count || 0}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    {/* Savings Accounts Button */}
                                    <TableCell align="center">
                                        <Tooltip title={getTooltipTitle(agent.sav_account_count, 'savings')}>
                                            <Button
                                                variant={getButtonVariant(agent.sav_account_count)}
                                                color={getButtonColor(agent.sav_account_count)}
                                                size="small"
                                                onClick={() => handleAccountClick(agent, 'savings')}
                                                disabled={!agent.sav_account_count}
                                                style={{
                                                    minWidth: '60px',
                                                    fontWeight: agent.sav_account_count ? 'bold' : 'normal'
                                                }}
                                            >
                                                {agent.sav_account_count || 0}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    {/* RD Accounts Button */}
                                    <TableCell align="center">
                                        <Tooltip title={getTooltipTitle(agent.rd_account_count, 'RD')}>
                                            <Button
                                                variant={getButtonVariant(agent.rd_account_count)}
                                                color={getButtonColor(agent.rd_account_count)}
                                                size="small"
                                                onClick={() => handleAccountClick(agent, 'rd')}
                                                disabled={!agent.rd_account_count}
                                                style={{
                                                    minWidth: '60px',
                                                    fontWeight: agent.rd_account_count ? 'bold' : 'normal'
                                                }}
                                            >
                                                {agent.rd_account_count || 0}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    {/* FD Accounts Button */}
                                    <TableCell align="center">
                                        <Tooltip title={getTooltipTitle(agent.fd_account_count, 'FD')}>
                                            <Button
                                                variant={getButtonVariant(agent.fd_account_count)}
                                                color={getButtonColor(agent.fd_account_count)}
                                                size="small"
                                                onClick={() => handleAccountClick(agent, 'fd')}
                                                disabled={!agent.fd_account_count}
                                                style={{
                                                    minWidth: '60px',
                                                    fontWeight: agent.fd_account_count ? 'bold' : 'normal'
                                                }}
                                            >
                                                {agent.fd_account_count || 0}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>

                                    
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default AgentTransfer;