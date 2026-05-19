import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, Button, IconButton, Toolbar, InputBase, Avatar } from '@material-ui/core';
import { ArrowBack, MoreHorizOutlined, Search } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Api from '../api/api';
import ImageApi from '../api/image_api';
import icon from '../assets/icon.png';

function AllMembers() {
    const [registrationData, setRegistrationData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const itemsPerPage = 50;

    useEffect(() => {
        fetchRegistrationData();
    }, [currentPage]);

    const handleChange = (event) => {
        let value = event.target.value;

        const form = new FormData();
        form.append('search', value);
        setLoading(true);

        fetch(Api + 'search_rstrsn', {
            method: 'POST',
            body: form
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then(res => {
                setRegistrationData(res);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                alert('Failed to connect to the server');
            });
    };

    const fetchRegistrationData = async () => {
        try {
            const response = await fetch(Api + 'allRegistration', {
                method: 'POST',
                body: JSON.stringify({ page: currentPage, limit: itemsPerPage })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setRegistrationData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleMoreClick = (acno) => {
        history.push(`/home/MemberDetails/${acno}`, { acno });
    };

    const displayData = searchResults.length > 0 ? searchResults : registrationData;

    return (
        <Container maxWidth="false" component={Paper} style={{ padding: 0 }} elevation={0}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: 10, margin: 0 }} component={Paper}>
                <IconButton>
                    <ArrowBack />
                </IconButton>
                <div >
                    <Typography style={{ fontWeight: 'bold',color:'#023E8A' }} variant='h6'>
                        All Registered Members
                    </Typography>
                </div>
                <div style={{ display: 'flex' }}>

                    <Typography style={{ margin: 10, textAlign: 'right' }}>
                        <Button variant='contained' color='primary' size='small' onClick={() => history.push('/Home/Newreg/')}>
                            Add Members
                        </Button>
                    </Typography>
                </div>
            </Toolbar>
            <Paper component="form" style={{ display: 'flex', padding: 0 }} variant='outlined'>
                <InputBase
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    placeholder="Search By Registration Number Or Name"
                    inputProps={{ 'aria-label': 'Search By Registration Number Or Name' }}
                    onChange={handleChange}
                    style={{ padding: 10 }}
                    fullWidth
                />
                <IconButton aria-label="search">
                    <Button variant='outlined' size='small' color='primary'>
                        Search
                    </Button>
                </IconButton>
            </Paper>
            <TableContainer component={Paper} style={{ maxHeight: '78vh' }} elevation={0}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Sl No.</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Photo</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Reg No.</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>C/O</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Aadhar No</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Address</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Opening Date</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>Phone Number</TableCell>
                            <TableCell style={{ fontWeight: 'bold',backgroundColor:'#888888',color:'white' }}>More</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrationData.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Avatar>
                                        <img
                                            src={row.img ? ImageApi + row.img : icon}
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = icon;
                                            }}
                                        />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.acno}</TableCell>
                                <TableCell style={{ textTransform: 'capitalize' }}>{row.name}</TableCell>
                                <TableCell style={{ textTransform: 'capitalize' }}>{row.f_name}</TableCell>
                                <TableCell style={{ textTransform: 'capitalize' }}>{row.adhar_no}</TableCell>
                                <TableCell style={{ textTransform: 'capitalize', maxWidth: 150, overflowY: 'clip' }}>{row.vill}</TableCell>
                                <TableCell>{row.op_dte}</TableCell>
                                <TableCell>{row.c_nmbr}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleMoreClick(row.acno)}>
                                        <Button variant='outlined' color='primary' size='small'>
                                            More
                                        </Button>
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div style={{ textAlign: 'center', margin: '10px' }}>
                    <Button variant="contained" size='small' color='primary' onClick={handlePrevPage} disabled={currentPage === 1}>
                        Prev
                    </Button>
                    <Button variant="contained" size='small' color='primary' onClick={handleNextPage} style={{ marginLeft: '10px' }}>
                        Next
                    </Button>
                </div>
            </TableContainer>
        </Container>
    );
}

export default AllMembers;
