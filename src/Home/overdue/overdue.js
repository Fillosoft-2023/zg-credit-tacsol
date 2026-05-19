import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Toolbar, Typography, LinearProgress, Menu, MenuItem } from "@material-ui/core";
import Api from "../../api/api";
import React from "react";
import { ArrowBack, ArrowForwardIos, MoreHoriz, Print, Tune } from "@material-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { PDFExport } from '@progress/kendo-react-pdf';
import OverduePrint from "./overduePrint";

export default function Overdue() {
    const [overdueList, setOverdueList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    const [selectedAgent, setSelectedAgent] = React.useState('');
    const [agentsMenuAnchor, setAgentsMenuAnchor] = React.useState(null);
    const pdfExportComponent = React.useRef(null);

    React.useEffect(() => {
        setLoading(true);
        fetch(Api + 'overdue')
            .then(res => res.json())
            .then(res => {
                setOverdueList(res.overdue_list || []);
                setLoading(false);
            })
            .catch(err => {
                alert('Failed to connect to the server');
                setLoading(false);
            });
    }, []);

    const linkToLadger = (props) => {
        history.push('/Home/LadgerBookHome', { 
            "data": props, 
            refresh: Math.random() 
        });
    };

    const handleAgentSelect = (agentName) => {
        setSelectedAgent(agentName);
        setAgentsMenuAnchor(null);
    };

    const handleMenuOpen = (event) => {
        setAgentsMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAgentsMenuAnchor(null);
    };

    const getUniqueAgents = () => {
        const uniqueAgents = [];
        overdueList.forEach(item => {
            if (!uniqueAgents.includes(item.ag_name)) {
                uniqueAgents.push(item.ag_name);
            }
        });
        return uniqueAgents;
    };

    // Filter by selected agent
    const filteredList = selectedAgent 
        ? overdueList.filter(item => item.ag_name === selectedAgent)
        : overdueList;

    return (
        <Container maxWidth='false' style={{ padding: 0, scrollbarWidth: 'thin' }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={() => history.goBack()}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    Overdue ({overdueList.length} accounts)
                </Typography>
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: 10 }}
                        onClick={handleMenuOpen}
                    >
                        <Tune /> Filter by Agent
                    </Button>
                    <Menu
                        anchorEl={agentsMenuAnchor}
                        open={Boolean(agentsMenuAnchor)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleAgentSelect('')}>All Agents</MenuItem>
                        {getUniqueAgents().map((agentName, index) => (
                            <MenuItem key={index} onClick={() => handleAgentSelect(agentName)}>
                                {agentName}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <Print /> Export PDF
                    </Button>
                </div>
            </Toolbar>
            {loading && <LinearProgress />}
            
            <TableContainer component={Paper} variant="outlined" style={{ scrollbarWidth: 'thin', height: '86vh' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No</TableCell>
                            <TableCell>Loan A/C No.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Agent Name</TableCell>
                            <TableCell>EMI Amount</TableCell>
                            <TableCell>Expected EMIs</TableCell>
                            <TableCell>Received EMIs</TableCell>
                            <TableCell>No of Overdue</TableCell>
                            <TableCell>Overdue Amount</TableCell>
                            <TableCell>More</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}.</TableCell>
                                <TableCell>{item.ln_id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.ag_name}</TableCell>
                                <TableCell>Rs. {item.emi_amnt}</TableCell>
                                <TableCell>{item.expected_emi_count}</TableCell>
                                <TableCell>{item.emi_count}</TableCell>
                                <TableCell>{item.overdue}</TableCell>
                                <TableCell style={{ color: 'red' }}>Rs. {item.overdue_amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        style={{ padding: 5 }} 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => linkToLadger(item)}
                                    >
                                        <ArrowForwardIos />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ position: "absolute", left: "-1000px", top: 0 }}>
                <PDFExport keepTogether='.keep' paperSize="A4" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='overdue.pdf' ref={pdfExportComponent}>
                    <OverduePrint data={filteredList} agentName={{ ag_name: selectedAgent }} />
                </PDFExport>
            </div>
        </Container>
    );
}