import React from 'react'
import {
    Paper,
    Container,
    TextField,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Button,
    TableHead,
    Typography,
    IconButton,
    Tooltip,
    
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';


import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withStyles } from '@material-ui/core/styles';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './emi/css/modal.css'
import GetAppIcon from '@material-ui/icons/GetApp';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer'
import MyDocument from './../pdf/DailySheetRd'
const style = {
  container : {
  height : '76vh',
        
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
tableFont : {
  fontSize: 12,
}
}

 class RdCollection extends React.Component {
    constructor() {
      super();
      this.state = {
        todayEmi : [],
        searchval : '',
        agentSearc : '',
        searchRes : [],
        conformation : false,
        appData : [],
        ready: true,
        saveBtn : true,
        mount: false,
        textErr : [],
        textErrfine : [],
        disabled : false
      };
    }
  
    modifyItem = (text, index, name)=>{
      this.setState({disabled : false})
      // const newValue = e.target.value;
      // const name = e.target.name;
      // const values = [...this.state.values];
      // values[index].name = newValue;
      this.validate()
       
        const newArray = [...this.state.todayEmi]
        if(name === 'r_fine'){
          newArray[index].r_fine = text;
          newArray[index].sttus = "done"
        }else {
          //emi amount aru total due tu calculate kori fele notun object ata assign korbya lagbu jater orginal value tu next tut assgin korbya paru
          // newArray[index].ttl_due = newArray[index].emi_amnt - text;
          this.setState({
            saveBtn : false
          })
          
          newArray[index].recv_amnt = text;
          newArray[index].sttus = "done"
        }
        
        this.setState({todayEmi : newArray})
        // console.log(this.state.todayEmi)
      
      
    }
    
     submit = ()=>{
      this.setState({disabled : true})
      this.validate()
        const Data = this.state.todayEmi;
        const send = {
          "Data" : Data,
          "press" : "rdUpdate"
        }

        for(let p in Data){
          if(Data[p].recv_amnt === ''){
            Data[p].sttus = 'not done'
          }
          Object.assign(Data[p], {...Data[p], totalDue : (Number(Data[p].ttl_due) + Number(Data[p].r_amnt))-Number(Data[p].recv_amnt)})
        }
        // sendAsync(send).then((res)=> {
        //     console.log(res)
            
        //     this.setState({todayEmi : [],conformation : false })
        // })

        console.log(Data)
        
    }

    componentDidMount(){
      this.setState({mount : true})
      if(this.state.searchval === ''){
        // sendAsync('rd').then((res)=>{
            
        //   if(this.state.mount){
        //     this.setState({todayEmi : res})
        //     console.log(res)
        //   }
            
        // })
      }
      this.setState({ ready: false });
      setTimeout(()=>{
        this.setState({ ready: true });
      }, 1);
      
    
    }
    componentWillUnmount(){
      this.setState({mount : false})
      this.setState({todayEmi : []})
      // sendAsync('').then((res)=>{console.log(res)})
    }



    

    // AssignValue = ()=>{
    //   let newArray = [...this.state.todayEmi];
    //   let entered = false;
      
    //     if(newArray.length != 0){
    //       entered = true;
    //       for(var i = 0; i<newArray.length; i++){
    //         Object.assign(newArray[i], {totalDue : Number(newArray[i].ttl_due) + Number(newArray[i].emi_amnt)})
    //       }
          
    //     }

    //     return entered;
    // }
    
    handleSearch = (ac_no)=>{
      const data = {
        "ac_no" : ac_no,
        "press" : "rdColSearch"
      }
      sendAsync(data).then((res)=>this.setState({todayEmi : res}))
      console.log(data)
    }
    handleSearchAgent = (id)=>{
      const dataAgent = {
        "agent_id" : id,
        "press" : "rdColSearchByAgent"
      }
      sendAsync(dataAgent).then((res)=>{
        this.setState({todayEmi : res})
        console.log(res)
      })
    
    }
    handleSave = ()=>{
      console.log(this.validate())
      if(!this.state.saveBtn && this.validate()){
        this.setState({conformation : true})
      }
    }

      validate = ()=>{
        const Data = this.state.todayEmi;
        const err = this.state.textErr;
        const errs = this.state.textErrfine;
        let isValidate = true
        for(let p in Data){
          
          if(isNaN(Data[p].recv_amnt)){
            err[p] = true
            isValidate = false
          }else {
            err[p] = false
            
          }
          if(isNaN(Data[p].r_fine)){
            errs[p] = true
            isValidate = false
          }else {
            errs[p] = false
            
          }
        }
  
        return isValidate
      }

    submitCo(){
        return(
          <Popup
              open={this.state.conformation}
              modal
              onClose={()=>this.setState({conformation : false})}
              
            >
              {close => (
                <div className="modal">
                  <button className="close" onClick={()=>this.setState({conformation : false})}>
                    &times;
                  </button>
                  <div className="header"> Conformation Massage </div>
                  <div className="content">
                    {' '}
                   <Typography> Are you sure to update this sheet?
                   </Typography>
                   </div>
                  <div className="actions">
                   
                    <Button
                      className="button"
                      onClick={()=>this.setState({conformation : false})}
                      variant="contained"
                      color="secondary"
                    >
                      Check again
                    </Button>
                    <Button
                      className="button"
                      onClick={this.submit}
                      variant="contained"
                      color="primary"
                      style={{marginLeft: 5}}
                      disabled={this.state.disabled}
                    >
                      Update sheet
                    </Button>
                  </div>
                </div>
              )}
            </Popup>
        )

    }
   
   
  
    render() {
    
      let mapData = this.state.todayEmi
      const filename = Math.floor(Math.random()*10000000);
      

     
       if(this.state.ready){
      return (
        <Container maxWidth="lg" >
                    {this.submitCo()}
                    <Paper style={{marginBottom: 5,marginTop: 20,padding: 5,alignItems: 'center',justifyContent: 'flex-end',display: 'flex'}}>
                      <Autocomplete
                        id="Search RD by Agent"
                        
                        options={mapData}
                        getOptionLabel={(option) => option.agent_id}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} value={this.state.agentSearc} size="small" onChange={({target : {value}})=>this.handleSearchAgent(value)} label="Search by agent ID" variant="outlined" />}
                      />
                      <Autocomplete
                        id="Search RD by ac no"
                        
                        options={mapData}
                        getOptionLabel={(option) => option.ac_no}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} value={this.state.searchval} size="small" onChange={({target : {value}})=>this.handleSearch(value)} label="Search RD by ac no" variant="outlined" />}
                      />
                        <div >
                          <Tooltip title="Save list">
                            <IconButton disabled={this.state.saveBtn} onClick={()=>this.handleSave()}>
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Refresh list">
                            <IconButton onClick={()=>this.componentDidMount()}>
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                          {/*<Tooltip title="Print list">
                            <IconButton>
                              <PrintIcon />
                            </IconButton>
                            </Tooltip>
                          
                          <Tooltip title="Add an EMI">
                            <IconButton>
                              <EditIcon />
                            </IconButton>
      </Tooltip>*/}
                          
                          <PDFDownloadLink document={<MyDocument callback={mapData} />} fileName={filename+"DailyRDsheet.pdf"}>
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                            <Tooltip title="download this sheet">
                            <IconButton>
                              <GetAppIcon />
                            </IconButton>
                          </Tooltip>
                            
                            )}
                          </PDFDownloadLink>
                        </div>
                    </Paper>
                    <TableContainer  component={Paper} style={style.container} >
                        <Table size="small">
                            <TableHead>
                            <TableRow>
                                <TableCell style={style.tableFont}>AC NO</TableCell>
                                <TableCell style={style.tableFont}>RD ID</TableCell>
                                <TableCell style={style.tableFont}>DATE</TableCell>
                                <TableCell style={style.tableFont}>RD AMOUNT</TableCell>
                                
                                <TableCell style={style.tableFont}>FINE</TableCell>
                                <TableCell style={style.tableFont}>RECEIVED AMOUNT</TableCell>
                                <TableCell style={style.tableFont}>OVERDUE </TableCell>
                                
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                              
      
                              mapData.map((item,index)=> {
                      
                                return (
                                  <TableRow key={index}>
                                      <TableCell>
                                          <Typography style={style.tableFont}>{item.ac_no}</Typography>
                                      </TableCell>
                                      <TableCell>
                                           <Typography style={style.tableFont}>{item.id}</Typography>
                                      </TableCell>
                                      <TableCell>
                                           <Typography style={style.tableFont}>{item.date}</Typography>
                                      </TableCell>
                                      <TableCell>
                                          <Typography style={style.tableFont}>{item.r_amnt}</Typography>
                                      </TableCell>
                                      {/*<TableCell>
                                          <Typography>{item.ttl_due}</Typography>
                                      </TableCell>
                                      <TableCell>
                                           <Typography>{Number(Number(item.r_amnt) + Number(item.ttl_due)).toFixed(2)}</Typography>
                                      </TableCell>*/}
                                      <TableCell>
                                          <TextField
                                            variant="standard"
                                            fullWidth
                                            value={this.state.todayEmi[index].r_fine}
                                            onChange={({target : {value}})=> this.modifyItem(value,index, 'r_fine')}
                                            size="small"
                                            error={this.state.textErrfine[index]}
                                          />
                                      </TableCell>
                                      <TableCell>
                                          <TextField
                                            variant="standard"
                                            fullWidth
                                            value={this.state.todayEmi[index].recv_amnt}
                                            onChange={({target : {value}})=> this.modifyItem(value,index, 'recv_amnt')}
                                            size="small"
                                            type="text"
                                            error={this.state.textErr[index]}
                                          />
                                      </TableCell>
                                      <TableCell>
                                          {
                                             item.ttl_due <=0 ? (
                                              <Typography>No</Typography>
                                            ) : (
                                              <Typography style={{color: 'red'}}>Yes</Typography>
                                            )
                                          }
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
    }else {
      return null
    }
    }
  }

  export default withStyles(style)(RdCollection);