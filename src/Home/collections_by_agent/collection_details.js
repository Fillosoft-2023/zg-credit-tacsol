import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Button, IconButton, CircularProgress, LinearProgress } from "@material-ui/core";
import React from "react";
import Api from "../../api/api";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SnakBar from "../../consts/message";
import { Delete } from "@material-ui/icons";
export default function CollectionDetailsByAgent(props){
    // console.log(props.location.state)
    const navigate = useHistory()
    const [data, setData] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const [massg,setMassg] = React.useState({})
    const [refresh, setRefresh] = React.useState(Math.random())
    const [disabled, setDisabled] = React.useState(false)

    React.useEffect(()=>{
        fetch(Api+'CollectionDetailsByAgent',{
            method : 'POST',
            body : JSON.stringify({
                date : props.location.state.up_date,
                agent : props.location.state.agent_reffer,
                branch_id : localStorage.getItem('branc_code')
            })
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            console.log(res)
        })
        .catch(err=>{
           console.log(err)
        })
    },[refresh])

    const onApprove = ()=>{
        setDisabled(true)
        setLoading(true)
                fetch(Api+'onApproved',{
                  method : 'POST',
                  body : JSON.stringify({
                    date : props.location.state.up_date,
                    agent : props.location.state.agent_reffer
                  })
                })
                .then(res=>res.json())
                .then(res=>{
                  setLoading(false)
                  setRefresh(Math.random())
                  if(res.code === 200){
                    setMassg({
                      open : true,
                      severity : 'success',
                      massg : res.massg
                    })
                  }else{
                    setMassg({
                      open : true,
                      severity : 'error',
                      massg : res.massg
                    })
                  }
                })
                .catch(err=>{
                 console.log(err)
                  setLoading(false)
                  setMassg({
                    open : true,
                    severity : 'error',
                    massg : 'Faild to connect to the server'
                  })
                })
    }

    const onDeleteEmi = (id)=>{
        setLoading(true)
        fetch(Api+'deleteAgentCollectionEmi',{
            method : 'POST',
            body : JSON.stringify({
                id : id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            setRefresh(Math.random())
            setLoading(false)
            setMassg({
                open : true,
                severity : res.code === 200 ? 'success' : 'error',
                massg : res.massg
            })
        })
        .catch(err=>{
           setLoading(false)
           setMassg({
               open : true,
               severity : 'error',
               massg : 'Faild to connect to the server'
           })
        })
    }


    return(
        <Container>
            <Toolbar component={Paper} style={{padding: 5,marginBottom: 5, justifyContent :'space-between'}}>
                <Toolbar>
                <IconButton onClick={()=>navigate.push('/Home/EmployHome/CollectionsByAgent')}>
                    <ArrowBackIcon />
                </IconButton>
                <h2>Collection details</h2>
                </Toolbar>

                <Button onClick={onApprove} disabled={disabled}  variant="contained" color="primary">
                    Approve
                    
                </Button> 
            </Toolbar>
            <TableContainer component={Paper}>
            {
                loading ? <LinearProgress /> : ''
            }
                <Table>
                    <TableHead>
                        <TableCell>Loan A/C No</TableCell>
                        <TableCell>NAME</TableCell>
                        <TableCell>DATE</TableCell>
                        <TableCell>FINE</TableCell>
                        <TableCell>PRINCIPLE</TableCell>
                        <TableCell>INTEREST</TableCell>
                        <TableCell>EMI</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>More</TableCell>
                        
                    </TableHead>
                    <TableBody>
                    {
                        data.map((item,index)=>
                            <TableRow key={index}>
                                <TableCell>{item.ln_id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.recived_date}</TableCell>
                                <TableCell>{item.fine}</TableCell>
                                <TableCell>{item.prncpl}</TableCell>
                                <TableCell>{item.interest}</TableCell>
                                
                                <TableCell>{item.ttl}</TableCell>
                                <TableCell>{item.aproved_status}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={()=>onDeleteEmi(item.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <SnakBar massg={massg} setMassg={setMassg} />
        </Container>
    )
}