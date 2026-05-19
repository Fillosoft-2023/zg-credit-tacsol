import React from 'react';
import {
    Container,
    Paper,
    makeStyles,
    Typography,
    Tooltip,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
} from '@material-ui/core';

import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { ArrowBack } from '@material-ui/icons';
import Api from '../../api/api';

const itemsPerPage = 15;

export default function LoanAcDetails() {
    const classes = use_styles();
    const { from, to, ref } = useParams();
    const [ready, setReady] = React.useState(false);
    const [send, setSendData] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const history = useHistory(); // Get the history object


    React.useEffect(() => {
        fetchData();
    }, [from, to, currentPage]);

    const fetchData = async () => {
        try {
            const response = await fetch(Api + 'loanDetails', {
                method: 'POST',
                body: JSON.stringify({
                    from: from,
                    to: to,
                    currentPage
                }),
            });
            const result = await response.json();

            console.log('API Response:', result);

            if (result.princ_details && Array.isArray(result.princ_details)) {
                setData(result.princ_details);
            } else {
                console.error('Unexpected data format:', result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filename = Math.floor(Math.random() * 10000000);

    const handleDownload = () => {
        setSendData(data);
        setReady(true);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <Container maxWidth="xxl" style={{ minHeight: '75vh' }}>

            <Toolbar component={Paper} style={{display:'flex',justifyContent:"space-between"}}>
                <IconButton onClick={() => history.goBack()} style={{ marginLeft: '10px' }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant='h5' style={{ textAlign: 'center',fontWeight:'bold' }}>Loan Account Details</Typography>
                <div></div>
            </Toolbar>
            <Paper style={{ marginTop: '20px', marginBottom: '20px' }}>

                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Account No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Loan Account No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Loan Amount</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Disburse Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(startIndex, endIndex).map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell >{item.ac_no}</TableCell>
                                    <TableCell >{item.ln_id}</TableCell>
                                    <TableCell >{item.ln_amnt}</TableCell>
                                    <TableCell >{item.opn_dte}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ textAlign: 'center', margin: '10px' }}>
                    <IconButton onClick={handlePrevPage} disabled={currentPage === 1} size='small'>
                        Prev
                    </IconButton>
                    <Typography style={{ display: 'inline-block', margin: '0 10px' }}>
                        Page {currentPage}
                    </Typography>
                    <IconButton
                        onClick={handleNextPage}
                        disabled={data.length <= endIndex}
                        size='small'
                    >
                        Next
                    </IconButton>
                </div>
            </Paper>
        </Container>
    );
}

const use_styles = makeStyles(() => ({
    dateBar: {
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginBottom: 10,
    },
    table: {
        maxHeight: '75vh',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',
            backgroundColor: 'rgba(0,0,0,0,0)',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
        },
    },
}));
