import React from 'react'
import {
    Container, TextField, Toolbar, Menu, MenuItem, Tooltip, Paper, IconButton, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import FilterListIcon from '@material-ui/icons/FilterList';
import { PDFExport } from '@progress/kendo-react-pdf';
import PrintIcon from '@material-ui/icons/Print';
import AllSavingsPrint from './print_pge';
import Api from '../../../api/api';
import SnakBar from '../../../consts/message';

export default function AllSavAccountInfo() {
    const pdfExportComponent = React.useRef(null);
    const history = useHistory()
    const [data, setData] = React.useState([])
    const [massg, setMassg] = React.useState({})
    const [sliceData, setSliceData] = React.useState([])
    const [allAgent, setAllAgent] = React.useState([])
    const [anchorE1, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorE1)
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        from: new Date().toLocaleDateString("en-CA"),
        to: new Date(next).toLocaleDateString("en-CA"),
    })
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    // React.useEffect(() => {

    //     fetch(Api + 'allSavDisplay', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             agent: null,
    //             to: date.to,
    //             from: date.from,
    //             scheme : 'RD'
    //         })
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             setData(res)
    //             setSliceData(sliceIntoChunks(res, 18))
    //         })
    //         .catch(err => {
    //             setMassg({
    //                 open: true,
    //                 severity: 'error',
    //                 massg: 'Faild to connect to the server'
    //             })
    //         })
    // }, [date])
     const searchData = () => {
        fetch(Api + 'allSavDisplay', {
            method: 'POST',
            body: JSON.stringify({
                agent: null,
                to: date.to,
                from: date.from,
                scheme: 'RD'
            })
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                setSliceData(sliceIntoChunks(res, 18))
            })
            .catch(err => {
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
    const collectAgent = (e) => {
        fetch(Api + 'agent')
            .then(res => res.json())
            .then(res => setAllAgent(res))

        setAnchorEl(e.currentTarget)
    }

    const handleAgent = (id) => {
        setAnchorEl(null)
        fetch(Api + 'allSavDisplay', {
            method: 'POST',
            body: JSON.stringify({
                agent: id,
                to: date.to,
                from: date.from,
                scheme : 'RD'
            })
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                setSliceData(sliceIntoChunks(res, 18))
            })
            .catch(err => {

                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }

    function account_bal(){
        let bal = 0;
        data.map(item=>{bal += item.dep_bal})

        return bal
    }
    return ( 
        <Container component={Paper} maxWidth="false" style={{ padding: 0 }}>
            <Toolbar  style={{ display:'flex', justifyContent: 'space-between' ,marginBottom:5}}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => history.push('/Home/SavHome/')} >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant='h6' style={{fontWeight:'bold'}}>All RD Accounts</Typography>
                </div>
                <Typography style={{fontWeight : 'bold',color : 'red'}}>Total Balance: {account_bal()}</Typography>
                <div>
                
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginRight: 10, }}
                        value={date.from}
                        onChange={handleDate}

                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="to"
                        value={date.to}
                        onChange={handleDate}

                    />
  <Button
                    variant='outlined'
                    color='primary'
                      onClick={searchData}
                      style={{marginLeft:5,marginRight:5}} 

                    >
                        Search
                    </Button>
                    <IconButton onClick={collectAgent}>
                        <Tooltip title="Sort by ">
                            <FilterListIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <PrintIcon />
                    </IconButton>
                </div>
            </Toolbar>
            <Menu
                anchorEl={anchorE1}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {
                    allAgent.map((item, index) => <MenuItem key={index} onClick={() => handleAgent(item.id)} >{item.ag_name}</MenuItem>)
                }
            </Menu>
            <TableContainer style={{ maxWidth: '95%', height: '80vh' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Reg No</TableCell>
                            <TableCell>A/C NO</TableCell>
                            <TableCell>Contact No</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Opening Date</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Interest Rate</TableCell>
                            <TableCell>Dep Amt</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Agent Name</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((item, index) =>
                                <TableRow key={index} style={{backgroundColor : item.status === 'closed' ? '#7dfa9a' : '#fff'}}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.acno}</TableCell>
                                    <TableCell>{item.rd_no}</TableCell>
                                    <TableCell>{item.c_nmbr}</TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>{item.vill}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.tenure}</TableCell>
                                    <TableCell>{item.intrest}</TableCell>
                                    <TableCell>{item.dep_amount}</TableCell>
                                    <TableCell>{item.dep_bal}</TableCell>
                                    <TableCell>{item.frquency}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.ag_name}</TableCell>


                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{marginLeft:'-100000px'}}>

          
            <PDFExport forcePageBreak='.keep' paperSize="LEGAL" margin={{ top: 5, right: 5, bottom: 5, left: 60 }} fileName='all_rd_details.pdf' landscape ref={pdfExportComponent}>
                <AllSavingsPrint data={sliceData} />
            </PDFExport>
            </div>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}