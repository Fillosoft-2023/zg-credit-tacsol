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
    Toolbar,
    IconButton

} from '@material-ui/core'
import ProfileModify from './profileModify'
import { useHistory } from 'react-router-dom'
import DeleteShare from './delShare'
import DateHandler from '../../consts/date_format'
import { ArrowBack } from '@material-ui/icons'
export default function ShareHolDet(props) {
    const data = props.location.state.data;
    const [imgDisplay, setImgDisplay] = React.useState('');
    const style = useStyle()
    const history = useHistory()
    const handleRoute = () => {
        history.push('/Home/Share_reg/ProfileModify', { data: data })
    }
    const routeShare = () => {
        history.push('/Home/Share_reg/ShareModify', { data: data })
    }
    const navigate = useHistory()






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
                        <TableCell >Open Date</TableCell>
                        <TableCell>{DateHandler(data.op_dte)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Referral ac no</TableCell>
                        <TableCell>{data.rfl_ac_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Other Info</TableCell>
                        <TableCell>{data.other_info}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Educational qualification</TableCell>
                        <TableCell>{data.edu_qualific}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Occupation</TableCell>
                        <TableCell>{data.occupation}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Bank Ac No</TableCell>
                        <TableCell>{data.bank_ac}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Bank Detials</TableCell>
                        <TableCell>{data.bank_det}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Nominee Address</TableCell>
                        <TableCell>{data.nominee_add}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Relation with Nominee</TableCell>
                        <TableCell>{data.relation_with_nom}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell >Passport image</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.img === null ? alert('no data for display') : 'set')}>view</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Signature</TableCell>
                        <TableCell>
                            <Button color="primary" onClick={() => setImgDisplay(data.id_prf === null ? alert('no data for display') : 'id')}>view</Button>
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
            <Table className={style.table}>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">Share ID</TableCell>
                        <TableCell>{data.id}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell >Open Date</TableCell>
                        <TableCell>{DateHandler(data.opn_dt)}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell >Addmmisson Fees</TableCell>
                        <TableCell>
                            {data.adm_fee}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Share Class</TableCell>
                        <TableCell>
                            {data.class}
                        </TableCell>
                    </TableRow>





                </TableBody>

            </Table>
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
        const Example = ({ data }) => <img style={{ width: size }} src={`data:image/jpeg;base64,${data}`} />

        return (
            <Example data={datas} />
        )
    }



    return (
        <>
            <Toolbar component={Paper}>
                <IconButton onClick={() => navigate.push('/Home/Share_reg')}>
                    <ArrowBack />
                </IconButton>
                <h2>Profile</h2>
            </Toolbar>


            <Grid container spacing={1} style={{ height: '100%' }}>

                <Grid item xs={12} sm={6} >
                    <Paper className={style.profdet}>
                        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                            <Typography style={{ padding: 10 }}>Profile Information</Typography>
                            {/* <Button variant="contained" onClick={()=>handleRoute()} color="primary" style={{marginLeft: 50,height: 30}} >
                            Edit
                        </Button> */}

                        </div>
                        <Divider />
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
                                    <Button onClick={() => setImgDisplay('a')}>Return to Share information</Button>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                        {imgViewr(data.add_prf)}

                                    </div>

                                </div>
                            ) : (
                                <div>
                                    <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ padding: 10 }}>Edit Share Information</Typography>
                                        <Button variant="contained" onClick={() => routeShare()} color="primary" style={{ marginLeft: 50, height: 30 }} >
                                            Edit
                                        </Button>
                                        <DeleteShare callback={data} />
                                    </div><Divider />
                                    {loanInfo()}
                                </div>
                            )
                        }

                    </Paper>
                </Grid>
            </Grid>


        </>
    )
}

const useStyle = makeStyles((them) => ({
    profdet: {

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
    table: {

    }
}))