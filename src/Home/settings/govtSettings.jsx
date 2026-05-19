import { Button, Container, Dialog, DialogActions, DialogContent, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import Api from '../../api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function GovtSettings() {
    const [info, setInfo] = React.useState([]);
    const [sendData, setSendData] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [selectedItemId, setSelectedItemId] = React.useState(null); // New state to store the selected item ID
    const [loading, setLoading] = React.useState(false);
    const [sendIntData, setSendIntData] = React.useState({});
    const [massg, setMassg] = React.useState({});
    const [err, setErr] = React.useState({});
    const today = new Date();
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
    });
    const [refresh, setRefresh] = React.useState(Math.random());
    const history = useHistory();

    React.useEffect(() => {
        setLoading(true);
        const sesDate = JSON.parse(sessionStorage.getItem('cash_date'));
        if (!sesDate === false) {
            setDate(sesDate);
        }
        fetch(Api + 'govtInt', {
            method: 'POST',
            body: JSON.stringify(date)
        })
            .then(res => res.json())
            .then(res => setInfo(res))
            .catch(err => {
                console.log(err);
            });
    }, [refresh]);

    const handleAddClick = (id) => { // Modified handleAddClick to accept id parameter
        setOpen(true);
        setSelectedItemId(id); // Set the selected item ID
        const selectedItem = info.find(item => item.id === id); // Find the selected item
        if (selectedItem) {
            // Populate the text fields with the selected item's data
            setSendIntData({
                loan_int: selectedItem.loan_int,
                rd_int: selectedItem.rd_int,
                sav_int: selectedItem.sav_int,
                policy_int: selectedItem.policy_int,
                tl_int: selectedItem.tl_int
            });
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleIntChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setSendIntData({
            ...sendIntData,
            [name]: value,
        });
    };

    const handleDialogSave = () => {
        fetch(Api + "updateGovtInt", {
            method: "POST",
            body: JSON.stringify({
                id: selectedItemId, // Pass the selected item ID
                ...sendIntData
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setLoading(false);
                if (res) {
                    if (res.code === 200) {
                        setRefresh(Math.random());
                        setOpen(false);
                        setMassg({
                            open: true,
                            massg: "Interest Updated Successfully",
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
    };

    return (
        <Container maxWidth="false" component={Paper} style={{ padding: 0, height: '84vh' }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h6' style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Government Account Settings
                </Typography>
            </Toolbar>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No.</TableCell>
                            <TableCell>Loan Interest</TableCell>
                            <TableCell>RD Interest</TableCell>
                            <TableCell>Savings Interest</TableCell>
                            <TableCell>Policy Interest</TableCell>
                            <TableCell>TL Interest</TableCell>
                            <TableCell>Update</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {info.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.loan_int}%</TableCell>
                                <TableCell>{item.rd_int}%</TableCell>
                                <TableCell>{item.sav_int}%</TableCell>
                                <TableCell>{item.policy_int}%</TableCell>
                                <TableCell>{item.tl_int}%</TableCell>
                                <TableCell>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={() => handleAddClick(item.id)} // Pass item ID to handleAddClick
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleDialogClose}>
                <Toolbar component={Paper}>
                    <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Update Government Rates
                    </Typography>
                </Toolbar>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Loan Interest"
                                fullWidth
                                variant="outlined"
                                value={sendIntData.loan_int}
                                onChange={handleIntChange}
                                style={{ marginTop: 10 }}
                                name='loan_int'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="RD Interest"
                                fullWidth
                                value={sendIntData.rd_int}
                                onChange={handleIntChange}
                                style={{ marginTop: 10 }}
                                name='rd_int'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Savings Interest"
                                fullWidth
                                value={sendIntData.sav_int}
                                onChange={handleIntChange}
                                style={{ marginTop: 10 }}
                                name='sav_int'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Policy Interest"
                                fullWidth
                                value={sendIntData.policy_int}
                                onChange={handleIntChange}
                                style={{ marginTop: 10 }}
                                name='policy_int'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="TL Interest"
                                fullWidth
                                value={sendIntData.tl_int}
                                onChange={handleIntChange}
                                style={{ marginTop: 10 }}
                                name='tl_int'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' size='small' onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button variant='contained' size='small' onClick={handleDialogSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default GovtSettings;
