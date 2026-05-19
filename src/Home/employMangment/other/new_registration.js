import { useEffect, useState } from "react"
import Api from "../../../api/api"
import { Button, Container, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@material-ui/core"
import SnakBar from "../../../consts/message"
import { Refresh } from "@material-ui/icons"




export default function NewRegistrations(params) {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [massg,setMassg] = useState({})
    const [refresh, setRefresh] = useState(Math.random())

    useEffect(()=>{
        setLoading(true)
        fetch(Api+'newRequests')
        .then(res=>res.json())
        .then(res=>{
            setData(res)
            setLoading(false)
        })
        .catch(err=>{
            setLoading(false)
           console.log(err)
        })
    },[refresh])

    const onApproved = (id)=>{

        setLoading(true)
                fetch(Api+'approveRstrsn',{
                  method : 'POST',
                  body : JSON.stringify({
                    id : id
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
                  setLoading(false)
                  setMassg({
                    open : true,
                    severity : 'error',
                    massg : 'Faild to connect to the server'
                  })
                })
    }

    return (
        <Container>
        <Toolbar component={Paper} variant='outlined' style={{justifyContent : 'space-between'}}>
            <Typography>Registration Request By Agent</Typography>
            <IconButton onClick={()=>setRefresh(Math.random())}>
                <Refresh />
            </IconButton>
        </Toolbar>
        {
                    loading ? <LinearProgress /> : ''
                }
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableCell>Name</TableCell>
                    <TableCell>Registration No</TableCell>
                    <TableCell>Contact No</TableCell>
                    <TableCell>Approve</TableCell>
                </TableHead>
                
                <TableBody>
                {
                    data.map((item,index)=>
                        <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.acno}</TableCell>
                            <TableCell>{item.c_nmbr}</TableCell>
                            <TableCell>
                                <Button onClick={()=>onApproved(item.id_rstrsn)} variant="contained" size="small" color="primary">Approve</Button>
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