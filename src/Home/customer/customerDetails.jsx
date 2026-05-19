import React from 'react'

import {
    makeStyles,
    Container,
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Divider,
    Toolbar

} from '@material-ui/core'
import DateHandler from '../../consts/date_format';
import ImageApi from '../../api/image_api';
import DisableCustomer from './disableCustomer';
import ChangeCustomerPassword from './changeCustomerPassword';

export default function CustomerDetails(props) {

    const data = props.location.state.data;
    const [imgDisplay, setImgDisplay] = React.useState('');
    const style = useStyle()
    const persionalInfo = () => {
        return (
            <Table className={style.table}>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">Name</TableCell>
                        <TableCell>{data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >AC No</TableCell>
                        <TableCell>{data.acno}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Agent Id</TableCell>
                        <TableCell>{data.id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >C/O</TableCell>
                        <TableCell>{data.f_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Contact No</TableCell>
                        <TableCell>{data.c_nmbr}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Address</TableCell>
                        <TableCell>{data.vill}, {data.po}, {data.ps}, {data.dist}, {data.pin}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Nominee</TableCell>
                        <TableCell>{data.nmni}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Registration Date</TableCell>
                        <TableCell>{DateHandler(data.op_dte)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Refferal </TableCell>
                        <TableCell>{data.rfl_ac_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Status</TableCell>
                        <TableCell>{data.status}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Passport image</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.img === null ? alert('no data for display') : 'set')}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Id proof</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(() => setImgDisplay(data.id_prf === null ? alert('no data for display') : 'id'))}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Address Proof</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.id_prf === null ? alert('no data for display') : 'add')}>view</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }
    const loanInfo = () => {
        return (
            <Container component={Paper} style={{ padding: 0 }}>
                <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography style={{ fontWeight: 'bold',color:'#303F9F' }}>
                        Customer App Settings
                    </Typography>
                </Toolbar>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                    <Typography variant='h6' style={{ textAlign: 'center' }}>
                        User Status
                    </Typography>
                    <Typography variant='h6' style={{ textAlign: 'center' }}>
                        <DisableCustomer callback={data.ac_no} />
                    </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                    <Typography variant='h6' style={{ textAlign: 'center' }}>
                        Change Customer App Password
                    </Typography>
                    <Typography variant='h6' style={{ textAlign: 'center' }}>
                        <ChangeCustomerPassword callback={data.ac_no} />
                    </Typography>
                </div>
            </Container>
        )
    }

    const imgViewr = (images) => {
        let size = ''
        if (imgDisplay === 'set') {
            size = 150
        } else if (imgDisplay === 'id') {
            size = 250
        } else {
            size = 250
        }

        const img = Buffer.from(images).toString('base64')
        const datas = img
        const Example = () => <img style={{ width: size }} src={ImageApi + images} />
        return (
            <Example data={datas} />
        )
    }
    return (
        <Container  style={{padding:0}}>
        <Grid container spacing={1} style={{ height: '100%' }}>
            <Grid item xs={12} sm={6} >
                <Paper className={style.profdet}>
                    <Toolbar component={Paper} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography style={{ fontWeight: 'bold', textAlign: 'center', color: '#303F9F' }}>
                            Customer Details
                        </Typography>
                    </Toolbar>
                    {persionalInfo()}
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={style.profdet}>
                    {
                        imgDisplay === 'set' ? (
                            <div style={{ height: '100%', width: '100%' }}>
                                <Button onClick={() => setImgDisplay('')}>Return to loan information</Button>
                                <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                    {imgViewr(data.img)}
                                </div>
                            </div>
                        ) : imgDisplay === 'id' ? (
                            <div style={{ height: '100%', width: '100%' }}>
                                <Button onClick={() => setImgDisplay('i')}>Return to loan information</Button>
                                <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                    {imgViewr(data.id_prf)}

                                </div>
                            </div>
                        ) : imgDisplay === 'add' ? (
                            <div style={{ height: '100%', width: '100%' }}>
                                <Button onClick={() => setImgDisplay('a')}>Return to TA information</Button>
                                <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                    {imgViewr(data.add_prf)}
                                </div>

                            </div>
                        ) : (
                            <Paper variant='contained' style={{height:'84vh'}}>
                                {loanInfo()}
                            </Paper>
                        )
                    }
                </Paper>
            </Grid>
        </Grid>
        </Container>
    )
}
const useStyle = makeStyles((them) => ({
    profdet: {
        maxHeight: '84vh',
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
    table: {
    }
}))