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
    CircularProgress,
    Toolbar,
    IconButton

} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import DateHandler from '../../consts/date_format'
import SnakBar from '../../consts/message'
import Api from '../../api/api'
import { ArrowBack } from '@material-ui/icons'
import DeleteSavings from './delSavings'
export default function SavingsHolDetails(props) {
    const data = props.location.state.data;
    const [imgDisplay, setImgDisplay] = React.useState('');
    const style = useStyle()
    const history = useHistory()
    const [massg, setMassg] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [agentId, setAgentId] = React.useState({ag_name:''}); 

    React.useEffect(() => {
        fetch(Api + 'agentDetails', {
            method: 'POST',
            body: JSON.stringify({ agentId: data.agent_id })
        })
        .then(res => res.json())
        .then(res => setAgentId(res))
        .catch(err => {
            console.log(err);
        });
    }, [data.agent_id]);
  
    const routeToSav = () => {
        history.push('/Home/SavMainHome/SavingsModify', { data: data })
    }

    const handleStatus = (prop) => {
        setLoading(true)
        fetch(Api + 'changeSavStatus', {
            method: 'POST',
            body: JSON.stringify({ value: prop, reffer_id: data.reffer_id })
        })
            .then(res => res.json())
            .then(res => {
                setLoading(false)
                if (res.code === 200) {
                    setMassg({
                        open: true,
                        severity: 'success',
                        massg: res.massg
                    })
                } else {
                    setMassg({
                        open: true,
                        severity: 'error',
                        massg: res.massg
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                setMassg({
                    open: true,
                    severity: 'error',
                    massg: 'Faild to connect to the server'
                })
            })
    }





    const persionalInfo = () => {

        return (
            <Table className={style.table}>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row">Name</TableCell>
                        <TableCell>{data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Registration No</TableCell>
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
                        <TableCell >Created/Modified By</TableCell>
                        <TableCell>
                            {data.r_user}
                        </TableCell>
                    </TableRow>

                </TableBody>

            </Table>
        )
    }

    const loanInfo = () => {

        return (
            <Table style={{height:710}}>
                <TableBody>
                    {/* <TableRow>
                        <TableCell component="th" scope="row">Savings NO</TableCell>
                        <TableCell>{data.id}</TableCell>
                    </TableRow> */}
                    <TableRow>
                        <TableCell component="th" scope="row">Savings A/C NO</TableCell>
                        <TableCell>{data.sav_no}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Open Date</TableCell>
                        <TableCell>{DateHandler(data.date)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Agent Id</TableCell>
                        <TableCell>{data.agent_id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Agent Name</TableCell>
                        <TableCell>{agentId.res_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Interest Rate</TableCell>
                        <TableCell>Rs.{data.intrest}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Processing Fees</TableCell>
                        <TableCell>
                            Rs.{data.proc_chrg}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Insurance Fees</TableCell>
                        <TableCell>
                            Rs.{data.insur}
                        </TableCell>
                    </TableRow>
                   
                    <TableRow>
                        <TableCell >Deposit Amount</TableCell>
                        <TableCell>Rs.{data.dep_amount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Account Status</TableCell>
                        <TableCell>{data.status}</TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell >Created/Modified By</TableCell>
                        <TableCell>
                            {data.s_user}
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
                <IconButton onClick={() => history.push('/Home/SavMainHome')}>
                    <ArrowBack />
                </IconButton>
                <h2>Account Profile</h2>
            </Toolbar>
            <Grid container spacing={1} style={{ minHeight: '75vh' }}>

                <Grid item xs={12} sm={6} >
                    <Paper className={style.profdet}>
                        <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                            <Typography style={{ padding: 10 }}>Profile Information</Typography>
                            {/* <Button variant="contained" onClick={() => handleRoute()} color="primary" style={{ marginLeft: 50, height: 30 }} >
                                Edita
                            </Button> */}

                            {
                                data.status != 'closed' ? (
                                    <Button variant="contained" onClick={() => handleStatus('closed')} color="secondary" style={{ marginLeft: 50, height: 30 }} >
                                        Close
                                        {
                                            loading ? <CircularProgress color='#fff' size={25} /> : ''
                                        }
                                    </Button>
                                ) : (
                                    <Button variant="contained" onClick={() => handleStatus('active')} color="secondary" style={{ marginLeft: 50, height: 30 }} >
                                        Open
                                    </Button>
                                )
                            }
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
                                    <Button onClick={() => setImgDisplay('a')}>Return to Savings A/C information</Button>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%', display: 'flex' }}>
                                        {imgViewr(data.add_prf)}

                                    </div>

                                </div>
                            ) : (
                                <div>
                                    <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ padding: 10 }}>Savings A/C Information</Typography>
                                        <Button variant="contained" onClick={() => routeToSav()} color="primary" style={{ marginLeft: 50, height: 30 }} >
                                            Edit
                                        </Button>
                                        <DeleteSavings callback={data} />
                                    </div>
                                    <Divider />
                                    {loanInfo()}
                                </div>
                            )
                        }

                    </Paper>
                </Grid>
                <SnakBar massg={massg} setMassg={setMassg} />
            </Grid>
        </>


    )
}

const useStyle = makeStyles((them) => ({
    profdet: {

        maxHeight: 705,

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