import React, { useEffect, useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    IconButton,
    Typography
} from "@material-ui/core";
import Api from '../../api/api'
import { PDFExport } from "@progress/kendo-react-pdf";
import { Delete } from "@material-ui/icons";


export default function PaymentReport({ open, onClose, selectedPaymentReport }) {
    const [businessName, setBusinessName] = React.useState("");
    const [ph_no, setPhNo] = React.useState("");
    const [name, setName] = React.useState("");
    const [paymentReports, setPaymentReports] = React.useState([]);
    const [otherLoading, setOtherLoading] = React.useState({ del_loading: false, in_loading: false })
    const [selected, setSelected] = React.useState({})
    const [massg, setMassg] = React.useState({})
    const [refresh, setRefresh] = React.useState(Math.random())
    const [anchorE1, setAnchorE1] = React.useState(null)







    const pdfExportComponent = useRef(null);

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem("auth_state"));
        if (sessionData && sessionData.b_name) {
            setBusinessName(sessionData.b_name);
            setName(sessionData.name);
            setPhNo(sessionData.ph_no);
        }

        // Fetch data from the API
        fetchPaymentReports();
    }, [selectedPaymentReport]);

    const fetchPaymentReports = async () => {
        console.log(selectedPaymentReport.id)
        if (!selectedPaymentReport.id) {

        } else {
            try {
                const response = await fetch(Api + 'financePaymentReport', {
                    method: 'POST',
                    body: JSON.stringify({ loan_id: selectedPaymentReport.id })
                });

                const data = await response.json();
                console.log(data)
                setPaymentReports(data); // Assuming the API response is an array of payment reports
            } catch (error) {
                console.error("Error fetching payment reports:", error);
            }
        }
    };


    const handlePrint = () => {
        pdfExportComponent.current.save();
    };

    const currentDate = new Date().toLocaleDateString();


    const handleDelete = (id) => {
        console.log(id)
        setOtherLoading({ ...otherLoading, del_loading: true })
        fetch(Api + 'deleteFinancePayment', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
            })
        })
            .then(res => res.json())
            .then(res => {
                setOtherLoading({ ...otherLoading, del_loading: false })
                fetchPaymentReports()

                if (res.code === 200) {
                    setAnchorE1(null)
                    setMassg({
                        open: true,
                        severity: 'success',
                        massg: res.massg
                    })
                } else {
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: res.massg
                    })
                }
            })
            .catch(err => {
                console.log(err)
                setOtherLoading({ ...otherLoading, del_loading: false })
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })

    }
    let total = 0
    let totalPdf = 0
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Finance Report</DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                                <TableCell style={{ padding: "8px", textAlign: "left" }}>Serial No
                                </TableCell>
                                <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                    Payment Date
                                </TableCell>
                                <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                    Payment Amount
                                </TableCell>
                                <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                    Balance
                                </TableCell>
                                <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                    More
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {paymentReports.map((report, index) => {
                                total += Number(report.payment_amount)

                                return (
                                    <TableRow key={index}>
                                        <TableCell style={{ padding: "8px", textAlign: "left"  }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                            {report.payment_date}
                                        </TableCell>
                                        <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                            {report.payment_amount}
                                        </TableCell>
                                        <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                            {Number(selectedPaymentReport.amount) + Number(selectedPaymentReport.interest) - total}
                                        </TableCell>
                                        <TableCell style={{ padding: "8px", textAlign: "left" }}>
                                            <IconButton onClick={() => handleDelete(report.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )

                            })}
                        </TableBody>

                    </Table>
                </TableContainer>
                
                <Button variant="contained" size="small" color="primary" style={{margin:'10px'}} onClick={handlePrint}>
                    Print
                </Button>
                <div style={{ position: "fixed", left: -10000, top: -10000 }}>
                {/* <div> */}
                    <PDFExport ref={pdfExportComponent} paperSize="A4" fileName="payment_report.pdf">
                        <div style={{ padding: '20px', border: '1px solid grey' }}>
                            <Typography variant="h6" style={{ textAlign: 'center', borderBottom: '1px solid grey', marginBottom: '10px',fontWeight:'bold' }}>
                                Finance Report
                            </Typography>
                            <div style={{ marginBottom: '10px', borderBottom: '1px solid grey' }}>
                                {selectedPaymentReport && (
                                    <React.Fragment>
                                        <p style={{ fontSize: "12px" }}>Lender's Name: <span style={{ fontSize: "12px" }}>{selectedPaymentReport.name}</span></p>
                                        <p style={{ fontSize: "12px" }}>Phone Number: <span style={{ fontSize: "12px" }}>{selectedPaymentReport.ph_no}</span></p>
                                        <p style={{ fontSize: "12px" }}>Loan Amount: <span style={{ fontSize: "12px" }}>{selectedPaymentReport.amount}</span></p>
                                        <p style={{ fontSize: "12px" }}>Interest Amount: <span style={{ fontSize: "12px" }}>{selectedPaymentReport.interest}</span></p>
                                        <p style={{ fontSize: "12px" }}>Total Due: <span style={{ fontSize: "12px" }}>{Number(selectedPaymentReport.interest) + Number(selectedPaymentReport.amount)}</span></p>
                                        <p style={{ fontSize: "12px" }}>Loan Issue Date: <span style={{ fontSize: "12px" }}>{selectedPaymentReport.date}</span></p>
                                    </React.Fragment>
                                )}
                            </div>
                            <div className="mb-2 p-0">
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold',marginBottom:'10px',borderBottom:'1px solid grey' }}>
                                    Transaction Report
                                </Typography>
                                <Table style={{ width: "100%", marginBottom: "20px",border:'1px solid grey' }}>
                                    <TableHead >
                                        <TableRow>
                                            <TableCell style={{ fontWeight:'bold' }}>Serial No</TableCell>
                                            <TableCell style={{ fontWeight:'bold' }}>Payment Date</TableCell>
                                            <TableCell style={{ fontWeight:'bold' }}>Payment Amount</TableCell>
                                            <TableCell style={{ fontWeight:'bold' }}>Balance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paymentReports.map((report, index) => {
                                            totalPdf += Number(report.payment_amount)
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{ padding: "8px", fontSize: "11px",fontWeight:'bold' }}>{index + 1}</TableCell>
                                                    <TableCell style={{ padding: "8px", fontSize: "11px" }}>{report.payment_date}</TableCell>
                                                    <TableCell style={{ padding: "8px", fontSize: "11px" }}>Rs.{report.payment_amount}</TableCell>
                                                    <TableCell style={{ padding: "8px", fontSize: "11px" }}>Rs.{Number(selectedPaymentReport.amount) + Number(selectedPaymentReport.interest) - totalPdf}</TableCell>
                                                </TableRow>
                                            )


                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <p style={{ textAlign: "right", fontSize: "6px" }}>
                                    PDF generated on: <span style={{ color: "#dc3545", fontSize: "6px" }}>{currentDate}</span>
                                </p>
                            </div>
                        </div>
                    </PDFExport>




                </div>

            </DialogContent>
        </Dialog>
    );
}
