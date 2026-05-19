import React, { useEffect, useState } from 'react';
import { Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import Api from '../../../api/api';
import { useLocation } from 'react-router-dom';
import { ArrowBack, Print } from '@material-ui/icons';
import { PDFExport } from '@progress/kendo-react-pdf';
import json from './../../../appInfo.json'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function OutstandingReportDetails() {
    const location = useLocation();
    const agentId = location.state.agent_id;
    const appDet = json.Appinfo;
    const history = useHistory()


    const [collection, setCollection] = useState([]);
    const pdfExportComponent = React.useRef(null);

    useEffect(() => {
        if (agentId) {
            fetch(Api + 'outstandingDetails', {
                method: 'POST',
                body: JSON.stringify({ agent_id: agentId }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setCollection(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [agentId]);

    const handleExportToPDF = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    const htmlTable = `
    <div style="min-height: 75vh; overflow: auto; padding: 10px;">
    <div style="display: flex; justify-content: space-between;">
            <div style="flex-grow: 1;">
                <Typography>${appDet.name}</Typography><br/>
                <Typography>${appDet.Reg_no}</Typography><br/>
                <Typography>${appDet.Place}</Typography><br/>
            </div>
            <div style="flex-grow: 1; text-align: right;">
            <Typography>Loan Outstanding Report</Typography><br/>
            <Typography>For Agent:</Typography><br/>
            <Typography>Dated:</Typography><br/>

            </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; padding: 10px; border: 1px solid grey; margin-top: 20px;">
            <thead>
                <tr>
                    <th style="font-size: 10px; border: 1px solid grey;">Sl No.</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Account Name</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Registration Number</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Disbursed Amount</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Receivable Interest</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Principal Outstanding</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Interest Outstanding</th>
                    <th style="font-size: 10px; border: 1px solid grey;">Total Outstanding</th>
                </tr>
            </thead>
         
            <tbody>
                ${collection.map((item, index) => `
                    <tr key=${index}>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">${index + 1}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">${item.name}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">${item.acno}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">Rs.${Number(item.ln_amnt).toFixed(2)}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">Rs.${item.intrst_amnt}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">Rs.${(item.ln_amnt) - (item.princple)}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">Rs.${(item.intrst_amnt) - (item.emi_interest)}</td>
                        <td style="font-size: 10px; text-align: center; border: 1px solid grey;">Rs.${Number(item.ln_amnt) + Number(item.intrst_amnt) - (item.princple) - (item.emi_interest)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;


    return (
        <Container maxWidth="xl" component={Paper} variant="outlined">
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={() => history.push('/Home/EmployHome/OutStandingReport')}>
                    <ArrowBack />
                </IconButton>
                <div>
                    <Typography variant='h6' style={{ fontWeight: 'bold' }}>Outstanding Report Details for Id: {agentId}</Typography>
                </div>
                <div>
                    <IconButton onClick={handleExportToPDF}>
                        <Print />
                    </IconButton>
                </div>
            </Toolbar>
            <hr />
            <div>
                <TableContainer style={{ height: '75vh', overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Sl No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Reg No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Loan No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Disbursed Amount</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Receivable Interest</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Principle Outstanding</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Interest Outstanding</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Total Outstanding</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {collection.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{item.ln_id}</TableCell>
                                    <TableCell>Rs.{Number(item.ln_amnt).toFixed(2)}</TableCell>
                                    <TableCell>Rs.{item.intrst_amnt}</TableCell>
                                    <TableCell>Rs.{(Number(item.ln_amnt) - Number(item.princple).toFixed(2)).toFixed(2)}</TableCell>
                                    <TableCell>Rs.{(Number(item.intrst_amnt) - Number(item.emi_interest)).toFixed(2)}</TableCell>
                                    <TableCell>Rs.{(Number(item.ln_amnt) + Number(item.intrst_amnt) - Number(item.princple) - Number(item.emi_interest)).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div
                style={{
                    position: "fixed",
                    left: -10000,
                    top: -10000,
                }}
            >
                <PDFExport ref={pdfExportComponent} paperSize="A4">
                    {/* Inserting the HTML table here */}
                    <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
                </PDFExport>
            </div>
        </Container>
    );
}
