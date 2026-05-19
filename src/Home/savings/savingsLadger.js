import React from 'react'
import {
    Paper,
    Table,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    makeStyles,
    Container,
    TableFooter,
    Toolbar,
    Tooltip,
    IconButton,
    LinearProgress,
    Button

} from '@material-ui/core'
import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from 'react-to-print';
import SavingsLadgerPrint from './savingsladgerprint';
import { PDFExport } from '@progress/kendo-react-pdf';
import DateHandler from '../../consts/date_format';
import Api from '../../api/api';
import { set } from 'date-fns';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
export default function SavLadger(props) {
    const navigate = useHistory()

    const pdfExportComponent = React.useRef(null);
    const style = useStyle()
    const Data = props.location.state.data
    const [recData, setRecData] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const sendData = {
        reffer_id: Data.reffer_id,
        press: 'savLadger'
    }
    React.useEffect(() => {
        setLoading(true)

        fetch(Api + 'savLadger&reffer_id=' + Data.reffer_id)
            .then(res => res.json())
            .then(res =>{ 
                setRecData(res)
                setLoading(false)

            })
            .catch(err => {
                console.log(err)
            })

    }, [props.location.state.change])
    let sum = 0
    let dep = 0
    let withd = 0
    let int = 0
    let fine = 0
    return (
        <Container maxWidth="false" style={{padding:0}}>
            <Toolbar component={Paper} style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <IconButton onClick={() => navigate.push('/Home/SavHome')}>
                        <ArrowBack />
                    </IconButton>
                    <h2>RD Ladger</h2>
                    <Button
                    variant='contained'
                    color='primary'
                    size='small'
                        onClick={() => {
                            if (pdfExportComponent.current) {
                                pdfExportComponent.current.save();
                            }
                        }}
                    >
                        <PrintIcon />
                    </Button>
                </Toolbar>
                {
                loading ? <LinearProgress /> : ''
            }
                
                <Table component={Paper} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell style={{ background: 'green', color: '#fff' }}>Deposit</TableCell>
                            <TableCell style={{ background: 'red', color: '#fff' }}>Withdrawl</TableCell>
                            <TableCell style={{ background: 'orange', color: '#fff' }}>Interest</TableCell>
                            <TableCell style={{ background: 'red', color: '#fff' }}>Fine</TableCell>
                            <TableCell >Balance</TableCell>
                            <TableCell style={{ background: '#e4e4e4', color: '#000' }}>Remarks</TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        Array.isArray(recData) ? (
                            <TableBody >{
                                recData.map((item, index) => {
                                    sum += (Number(item.dep) + Number(item.int)) - Number(item.with)
                                    dep += Number(item.dep)
                                    withd += Number(item.with)
                                    int += Number(item.int)
                                    fine += Number(item.fine)

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{DateHandler(item.date)}</TableCell>
                                            <TableCell style={{ color: 'green' }}>{item.dep}</TableCell>
                                            <TableCell style={{ color: 'red' }}>{item.with}</TableCell>
                                            <TableCell style={{ color: 'orange' }}>{item.int}</TableCell>
                                            <TableCell style={{ color: 'red' }}>{item.fine}</TableCell>
                                            <TableCell>{sum}</TableCell>
                                            <TableCell>{item.remarks}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell >{dep}</TableCell>
                                    <TableCell>{withd}</TableCell>
                                    <TableCell>{int}</TableCell>
                                    <TableCell>{fine}</TableCell>
                                    <TableCell>{sum}</TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <div></div>
                        )
                    }


                </Table>
                <Table stickyHeader className={style.stickyFooter}>



                </Table>
                <div
                    style={{
                        position: "absolute",
                        left: "-1000px",
                        top: 0,
                    }}
                >
                    <PDFExport keepTogether='.keep' paperSize="LEGAL" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='rd_ladger.pdf' ref={pdfExportComponent}>
                        <SavingsLadgerPrint data={recData} info={{ ac_no: Data.ac_no, name: Data.name }} />
                    </PDFExport>
                </div>
               
        </Container>

    )
}

const useStyle = makeStyles(() => ({
    table: {

        maxHeight: '85vh',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },
    },
    bar: {
        marginBottom: 5,

    },
    stickyFooter: {

        bottom: 0,
        position: "sticky",
        backgroundColor: "#e4e4e4",
        zIndex: 999
    }
}))