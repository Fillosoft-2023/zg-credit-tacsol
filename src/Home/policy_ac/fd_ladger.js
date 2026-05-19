import React, { useEffect, useState } from 'react'
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Container,
    IconButton,
    Tooltip,
    Toolbar,
    LinearProgress,
    Button
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PrintIcon from '@material-ui/icons/Print';
import { PDFExport } from '@progress/kendo-react-pdf';
import TaLadgerPrint from './taladgerprint';
import DateHandler from '../../consts/date_format';
import SnakBar from '../../consts/message';
import Api from '../../api/api';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FdLadgerBook(props) {
    const classes = useStyles()
    const pdfExportComponent = React.useRef(null);
    const [data, setData] = useState([])
    const Data = props.location.state.data;
    const [open, setOpen] = React.useState(false);
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)



    useEffect(() => {
        setLoading(true)


        fetch(Api + 'ploicyLadger', {
            method: 'POST',
            body: JSON.stringify({ reffer_id: Data.reffer_id })
        })
            .then(res => res.json())
            .then(res => {
                setData(res)
                setLoading(false)

            })
            .catch(err => {
                setMassg({
                    severity: 'error',
                    open: true,
                    massg: 'Faild to connect to the server'
                })
            })
    }, [Data.reffer_id])





    let dep = 0
    let int_dep = 0
    let withd = 0


    return (
        <Container maxWidth="lg" style={{ width: '100%', padding: 0 }}>
            <Toolbar component={Paper} style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <Typography variant='h6' style={{fontWeight:'bold'}}>
                    Policy Account Ladger
                </Typography>
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

            <TableContainer component={Paper} className={classes.container}>
                <Table size="small">
                    <TableHead>
                        <TableRow>

                            <TableCell>SL NO</TableCell>
                            <TableCell>DATE</TableCell>
                            <TableCell>AMOUNT</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell>BALANCE</TableCell>

                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {Array.isArray(data) ? (
                            data.map((item, index) => {
                                if (item.type === 'dep') {
                                    dep += Number(item.amount)
                                } else if (item.type === 'intr') {
                                    int_dep += Number(item.amount)
                                } else if (item.type === 'with') {
                                    withd += Number(item.amount)
                                }





                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{DateHandler(item.date)}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>{item.type === 'dep' ? 'deposit' : item.type === 'with' ? 'withdrwal' : 'intrest'}</TableCell>
                                        <TableCell>{(dep + int_dep) - withd}</TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <div></div>
                        )



                        }


                    </TableBody>
                </Table>
            </TableContainer>



            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Narration"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">

                        {
                            Data.remarks != null ? (
                                Data.remarks
                            ) : (
                                'No remarks found'
                            )
                        }
                    </DialogContentText>
                </DialogContent>

            </Dialog>
            <div
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: 0,
                }}
            >
                <PDFExport keepTogether='.keep' paperSize="LEGAL" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} fileName='tl_ladger.pdf' ref={pdfExportComponent}>
                    <TaLadgerPrint data={data} info={{ ac_no: Data.ac_no, name: Data.name }} />
                </PDFExport>
            </div>
            {/* <div style={{display : 'none'}}>
                <TaLadgerPrint ref={componentRef}  data={data} info={{ac_no : Data.ac_no,name: Data.name}} />
            </div> */}
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        padding: 0,
        maxHeight: '85vh',

        overflowX: 'auto',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '0.4em',

            backgroundColor: 'rgba(0,0,0,0,0)'
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',

            borderRadius: 4,

        },

    }
})) 