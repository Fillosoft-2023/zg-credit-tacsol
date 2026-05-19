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
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from './../../pdf/juornal/shareadmissionColRecord';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { ArrowBack } from '@material-ui/icons';

const itemsPerPage = 15;

export default function MembershipFeeDetails() {
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
      const response = await fetch(Api + 'membershipFeeDetails', {
        method: 'POST',
        body: JSON.stringify({
          from: from,
          to: to,
        }),
      });
      const result = await response.json();

      console.log('API Response:', result);

      if (result.member_fee && Array.isArray(result.member_fee)) {
        setData(result.member_fee);
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
    <Container maxWidth="xxl" style={{ minHeight: '75vh', padding: 0 }}>

      <Paper style={{ marginBottom: '20px' }}>
        <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={() => history.goBack()} style={{ marginLeft: '10px' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant='h5' style={{ textAlign: 'center', margin: '10px', marginTop: '20px', fontWeight: 'bold' }}>
            Membership Fee Details
          </Typography>
          <div></div>
        </Toolbar>
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Sl No.</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Account No.</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}> Amount</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Deposit Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(startIndex, endIndex).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}.</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell >{item.acno}</TableCell>
                  <TableCell >Rs.{Number(item.member_fee).toFixed(2)}</TableCell>
                  <TableCell >{item.op_dte}</TableCell>
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
