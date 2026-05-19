import React from 'react'
import {
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Paper,
    makeStyles,
    IconButton,
    Container,
    TextField,
    Typography
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteRd from './deleteRd'
export default function RdTrans(props) {
    const [Data, setData] = React.useState([])
    const style = useStyle()
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate] = React.useState({
        to: new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press: "rdtrans",
    })
    React.useEffect(() => {

        // sendAsync(date).then((res)=>{
        //     setData(res)
        //     console.log(res)
        // })
    }, [props.callback, date])
    const handleDate = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name]: value,

        })
    }
    return (
        <Container component={Paper} style={{ padding: 10, margin: 0 }}>
            <Paper style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography style={{ margin: 5, marginRight: 20, textAlign: 'center' }}>RD A/C transaction</Typography>
                </div>
                <div>
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="to"
                        value={date.to}
                        onChange={handleDate}
                    />
                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        name="from"
                        style={{ marginLeft: 10, }}
                        value={date.from}
                        onChange={handleDate}
                    />
                    </div>
            </Paper>

            <TableContainer component={Paper} className={style.list}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Received Date</TableCell>
                            <TableCell>Sav A/C id</TableCell>
                            <TableCell>Ac No</TableCell>
                            <TableCell>Sav A/C Amount</TableCell>
                            <TableCell>Received Amount</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Data.map((item, index) => {
                                return (
                                    <TableRow>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.recived_date}</TableCell>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.ac_no}</TableCell>
                                        <TableCell>{item.r_amnt}</TableCell>
                                        <TableCell>{item.recv_amnt}</TableCell>
                                        <TableCell>
                                            <DeleteRd callback={item} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        </Container>
    )
}

const useStyle = makeStyles(() => ({
    list: {
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
    dateBar: {
        padding: 5,
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginBottom: 10,
    },
}))