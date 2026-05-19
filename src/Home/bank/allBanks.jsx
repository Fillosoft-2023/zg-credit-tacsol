import React, { useState, useEffect } from 'react';
import {
    Container,
    Dialog,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    TextField,
    Button,
    Grid
} from '@material-ui/core';
import { ArrowBack, Close, CloseOutlined, Edit } from '@material-ui/icons';
import SnackBar from '../../consts/message';
import Api from '../../api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function AllBanks() {
    const [bankNames, setBankNames] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [massg, setMassg] = useState({});
    const [refresh, setRefresh] = useState(4);
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEditClick = (bank) => {
        setSelectedBank(bank);
        setOpen(true);

        // fetch(`${Api}bankDetails/${bank.id}`)
        //     .then(res => res.json())
        //     .then(res => {
        //         setSelectedBank(res);
        //     })
        //     .catch(err => {
        //         console.error("Failed to fetch bank details:", err);
        //     });
    };

    const handleDialogClose = () => {
        setSelectedBank(null);
        setOpen(false);
    };

    const handleInputChange = (event, field) => {
        setSelectedBank({
            ...selectedBank,
            [field]: event.target.value
        });
    };
    const handleFormSubmit = () => {
        console.log(selectedBank)

        fetch(Api + 'bankUpdate', {
            method: 'POST',
            body: JSON.stringify(selectedBank)
        })
            .then((res) => res.json())
            .then((res) => {
                setLoading(false);
                if (res) {
                    if (res.code === 200) {
                        setRefresh(Math.random());
                        setOpen(false);
                        setMassg({
                            open: true,
                            massg: "Bank Details Updated Successfully",
                            severity: "success"
                        });
                    } else {
                        setMassg({
                            open: true,
                            massg: "Something Went Wrong",
                            severity: "error"
                        });
                    }
                } else {
                    setMassg({
                        open: true,
                        massg: "Failed To Connect to The Server",
                        severity: "error"
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                setMassg({
                    open: true,
                    massg: "Failed To Connect to The Server",
                    severity: "error"
                });
            });
        handleDialogClose();
    };

    useEffect(() => {
        fetch(Api + 'bankNames')
            .then(res => res.json())
            .then(res => {
                setBankNames(res);
            })
            .catch(err => {
                console.error("Failed to fetch bank names:", err);
            });
    }, [refresh]);

    return (
        <Container maxWidth="xxl">
            <TableContainer component={Paper} style={{ maxWidth: '1200px' }} maxWidth="xl">
                <Toolbar>
                    <IconButton onClick={() => history.goBack()}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant='h6' style={{ fontWeight: 'bold' }}>
                        Our Banks
                    </Typography>
                </Toolbar>
                <hr />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No</TableCell>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>A/C Holder Name</TableCell>
                            <TableCell>A/C No</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>More</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bankNames.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.ac_holder_name}</TableCell>
                                <TableCell>{item.account_no}</TableCell>
                                <TableCell>{item.branch}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(item)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleDialogClose}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <DialogTitle style={{ fontWeight: 'bold' }}>
                            Edit Bank Details
                        </DialogTitle>
                    </div>
                    <div>
                        <IconButton onClick={handleDialogClose}>
                            <CloseOutlined />
                        </IconButton>
                    </div>
                </div>
                {selectedBank && (
                    <Paper style={{ margin: 10, padding: 10 }} variant='outlined' >
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Account Holder Name"
                                    value={selectedBank.ac_holder_name}
                                    onChange={e => handleInputChange(e, 'ac_holder_name')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Bank Name"
                                    value={selectedBank.name}
                                    onChange={e => handleInputChange(e, 'name')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Account Number"
                                    value={selectedBank.account_no}
                                    onChange={e => handleInputChange(e, 'account_no')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="Branch"
                                    value={selectedBank.branch}
                                    onChange={e => handleInputChange(e, 'branch')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    label="IFSC Code"
                                    value={selectedBank.ifsc}
                                    onChange={e => handleInputChange(e, 'ifsc')}
                                />
                            </Grid>

                        </Grid>
                        <Button variant="contained" color="primary" onClick={handleFormSubmit} size='small' style={{ margin: 10 }}>
                            Submit
                        </Button>
                    </Paper>
                )}
            </Dialog>
            <SnackBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}

export default AllBanks;
