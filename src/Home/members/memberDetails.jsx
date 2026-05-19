import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper, Typography, Container, Button, CircularProgress, Divider, LinearProgress, TableContainer, Toolbar, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, Avatar, Grid } from '@material-ui/core';
import DateHandler from '../../consts/date_format';
import { useParams } from 'react-router-dom';
import Api from '../../api/api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ArrowBack, Close, Print } from '@material-ui/icons';
import ImageApi from '../../api/image_api';

function MemberDetails(props) {
    const { acno } = props.location.state || {};
    const [data, setData] = useState(null);
    const [imgDisplay, setImgDisplay] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const [dialogImageUrl, setDialogImageUrl] = useState('');

    const handleOpenDialog = (imageType) => {
        setDialogImageUrl(imageType === 'set' ? data.img : imageType === 'id' ? data.id_prf : imageType === 'add' ? data.add_prf : imageType === 'application' ? data.application : imageType === 'add2' ? data.add_prf2 : null);
        setOpenDialog(true);
    };

    // Function to handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const history = useHistory();

    const handleRoute = () => {
        history.push('/Home/ProfileModify', { data: data })
    }
    const handleMenuItemClick = (account) => {
        setSelectedAccount(account);
        setAnchorEl(null);
    };


    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateMenuClick = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleCreateClose = () => {
        setAnchorE2(null);
    };
    const handleSavingsClick = (acno) => {
        history.push(`/home/MemberSavingDetails/${acno}`, { acno });

    };
    const handleRdClick = (acno) => {
        history.push(`/home/MemberRdDetails/${acno}`, { acno });

    };
    const handleLoanClick = (acno) => {
        history.push(`/home/MemberLoanDetails/${acno}`, { acno });

    };
    const handleCreateRDClick = () => {
        history.push(`/home/SavHome`);

    };
    const handleCreateSavingsClick = () => {
        history.push(`/home/SavMainHome`);

    };
    const handleCreateLoanClick = () => {
        history.push('/Home/LoanHome')

    };
    const handleCreateShareClick = () => {
        history.push('/Home/Share_sec')

    };
    const handleCreateTLClick = () => {
        history.push('/Home/FdHome')

    };
    const handleCreateOtherClick = () => {
        history.push('/Home/OtherAc')

    };
    React.useEffect(() => {
        if (acno) {
            fetch(Api + 'memRegDetails', {
                method: 'POST',
                body: JSON.stringify({ acno: acno }),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return res.json();
                })
                .then(res => {
                    console.log(res[0]);

                    setData(res[0]);
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        }
    }, [acno]);
  
    const displayData = () => {
        if (!data) {
            return <LinearProgress />;
        }
        return (
            <Container maxWidth="false" style={{ padding: 0 }}>
                <Paper variant='outlined' style={{ padding: 20, paddingTop: 0 }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0 }}>
                        <Typography variant='h6' style={{color:'#303F9F' }}>
                            Personal Details
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Name:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.name}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Registration Number:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.acno}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Date Of Birth:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.dob}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Gender:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.gender}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Account Open Date:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{DateHandler(data.op_dte)}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>C/O:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.f_name}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Educational qualification:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.edu_qualific}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Occupation:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.occupation}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Mobile Number:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.c_nmbr}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Address:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.vill}, {data.pin}</Typography>
                            </div>
                        </Grid>
                         
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Aadhar No:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.adhar_no}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>PAN No:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.pan_no}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Ward No:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.ward_no}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Member A/C No:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.member_acno}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Membership Fee:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>Rs.{data.member_fee}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper variant='outlined' style={{ padding: 20, paddingTop: 0 }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0 }}>
                    <Typography variant='h6' style={{color:'#303F9F' }}>
                            Banking Details
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Bank A/C Name:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>---</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Account Number:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.bank_ac}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Bank Name:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.bank_name}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Bank Branch:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.bank_branch}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Bank IFSC Code:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{ textTransform: 'uppercase',color:'#303F9F' }}>{data.bank_det}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper variant='outlined' style={{ padding: 20, paddingTop: 0 }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0 }}>
                    <Typography variant='h6' style={{color:'#303F9F' }}>
                            Nominee Details
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Nominee Name:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.nmni}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Nominee Address:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.nominee_add}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Relation with Nominee:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.relation_with_nom}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper variant='outlined' style={{ padding: 20, paddingTop: 0 }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0 }}>
                    <Typography variant='h6' style={{color:'#303F9F' }}>
                            Other Details
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Referral A/C No:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.rfl_ac_no}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '50%' }}>
                                <Typography  style={{color:'#303F9F',fontWeight:'550'}}>Other Info:</Typography>
                            </div>
                            <div style={{ width: '50%' }}>
                                <Typography style={{color:'#303F9F'}}>{data.other_info}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <TableContainer component={Paper}>                    
                    <Typography variant='h6' style={{ textAlign: 'center', marginTop: 15,color:'#303F9F' }}>
                        Verified Documents
                    </Typography>
                    <Divider />
                    <Grid container spacing={1} style={{ marginTop: 15, marginBottom: 20 }}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
                                <img src={ImageApi + data.img} alt=' photo' style={{ borderRadius: 10, width: '30vw', height: '35vh' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Photo
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size='small' variant='outlined' style={{ textAlign: 'center', margin: 5 }} color="primary" onClick={() => handleOpenDialog('set')}>
                                    view
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
                                <img src={ImageApi + data.id_prf} alt='id proof' style={{ borderRadius: 10, width: '30vw', height: '35vh' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Signature
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size='small' variant='outlined' style={{ textAlign: 'center', margin: 5 }} color="primary" onClick={() => handleOpenDialog('id')}>
                                    view
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
                                <img src={ImageApi + data.add_prf} alt='address proof' style={{ borderRadius: 10, width: '30vw', height: '35vh' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Address Proof
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size='small' variant='outlined' style={{ textAlign: 'center', margin: 5 }} color="primary" onClick={() => handleOpenDialog('add')}>
                                    view
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
                                <img src={ImageApi + data.add_prf2} alt='address proof' style={{ borderRadius: 10, width: '30vw', height: '35vh' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Address Proof 2
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size='small' variant='outlined' style={{ textAlign: 'center', margin: 5 }} color="primary" onClick={() => handleOpenDialog('add2')}>
                                    view
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
                                <img src={ImageApi + data.application} alt='application' style={{ borderRadius: 10, width: '30vw', height: '35vh' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
                                <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Registration Form
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size='small' variant='outlined' style={{ textAlign: 'center', margin: 5 }} color="primary" onClick={() => handleOpenDialog('application')}>
                                    view
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </TableContainer>
            </Container>
        );
    };

    return (
        <Container maxWidth="false" component={Paper} style={{ padding: 0 }}>
            <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={() => history.push('/Home/AllMembers/')}>
                    <ArrowBack />
                </IconButton>
                <div >
                    <Typography variant='h6' style={{ fontWeight: 'bold',color:'#303F9F' }}>
                        Member Registration Details
                    </Typography>
                </div>
                <div>
                    <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={() => handleRoute()}
                        style={{ marginRight: 10 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={handleCreateMenuClick}
                        style={{ marginRight: 10 }}
                    >
                        {selectedAccount ? selectedAccount : 'Create'}
                    </Button>
                    <Menu
                        anchorEl={anchorE2}
                        open={Boolean(anchorE2)}
                        onClose={handleCreateClose}
                    >
                        <MenuItem onClick={() => handleCreateRDClick()}>RD A/C</MenuItem>
                        <MenuItem onClick={() => handleCreateSavingsClick()}>Savings A/C</MenuItem>
                        <MenuItem onClick={() => handleCreateLoanClick()}>Loan A/C</MenuItem>
                        <MenuItem onClick={() => handleCreateShareClick()}>Share A/C</MenuItem>
                        <MenuItem onClick={() => handleCreateTLClick()}>TL A/C</MenuItem>
                        <MenuItem onClick={() => handleCreateOtherClick()}>Other A/C</MenuItem>
                    </Menu>
                    <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={handleMenuClick}
                        style={{ marginRight: 10 }}
                    >
                        {selectedAccount ? selectedAccount : 'Accounts'}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => handleSavingsClick(data.acno)}>Savings A/C</MenuItem>
                        <MenuItem onClick={() => handleRdClick(data.acno)}>RD A/C</MenuItem>
                        <MenuItem onClick={() => handleLoanClick(data.acno)}>Loan A/C</MenuItem>
                    </Menu>
                    <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                    >
                        <Print />
                    </Button>
                </div>
            </Toolbar>
            {displayData()}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    {dialogImageUrl && <img style={{ width: '100%' }} src={ImageApi + dialogImageUrl} alt="Image" />}
                </DialogContent>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button size='small' variant='contained' color='secondary' onClick={handleCloseDialog} style={{ marginRight: 23, marginBottom: 5 }}>
                        Close
                    </Button>
                </div>
            </Dialog>
        </Container>
    );
}

export default MemberDetails;
