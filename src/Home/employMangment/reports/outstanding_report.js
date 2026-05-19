import { Container, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import Api from "../../../api/api";
import { ArrowBack, MoreHoriz } from "@material-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function OutStandingReport() {

    const [data, setData] = useState([])
    const history = useHistory();


    useEffect(() => {
        fetch(Api + 'collectOutstanding')
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => {
                console.log(err)
            })
    }, [])
    const handleMoreClick = (agentId) => {
        history.push('/Home/EmployHome/OutstandingReportDetails', { agent_id: agentId });
    }



    return (
        <Container component={Paper} variant="outlined" style={{ minHeight: '82vh' }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'left' }}>
                <IconButton onClick={() => history.push('/Home/EmployHome')}>
                    <ArrowBack />
                </IconButton>
                <h2>Outstanding Reports</h2>
            </Toolbar>
            <Divider />
            <TableContainer style={{ minHeight: '75vh', overflow: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableCell>Agent Name</TableCell>
                        <TableCell>Loan Disburshed</TableCell>
                        <TableCell>Receivable Interest</TableCell>
                        <TableCell>Total Principle Recovered</TableCell>
                        <TableCell>Total Interest Recovered</TableCell>
                        <TableCell>Total Principle Outstanding</TableCell>
                        <TableCell>Total Interest Outstanding</TableCell>
                        <TableCell>Loan Outstanding</TableCell>
                        <TableCell>More</TableCell>


                    </TableHead>
                    <TableBody>
                        {
                            data.map((item, index) => {
                                const principalOutstanding = item.total_loan_amount_provided - item.total_loan_recovered;
                                const interestOutstanding = item.total_interest_receivable - item.total_intrest_recovered;
                                const totalOutstanding = principalOutstanding + interestOutstanding;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{item.agent_name}</TableCell>
                                        <TableCell>Rs.{item.total_loan_amount_provided}</TableCell>
                                        <TableCell>Rs.{item.total_interest_receivable}</TableCell>
                                        <TableCell>Rs.{Number(item.total_loan_recovered).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{Number(item.total_intrest_recovered).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{Number(principalOutstanding).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{Number(interestOutstanding).toFixed(2)}</TableCell>
                                        <TableCell>Rs.{Number(totalOutstanding).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleMoreClick(item.agent_id)}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>
    )
}