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
import MyDocument from './../pdf/DailySheet'
import InfoIcon from '@material-ui/icons/Info';
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

 class Collection extends React.Component {
    constructor() {
      super();
      this.state = {
        todayEmi : [],
        searchval : '',
        agentSearch: '',
        searchRes : [],
        conformation : false,
        appData : [],
        ready: true,
        saveBtn : true,
        mount: false,
        textErr : [],
        textErrfine : [],
        textErrDate : [],
        disabled : false,
        
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
        if(name === 'fine'){
          newArray[index].fine = text;
          newArray[index].stus = "done"
        }else if(name === "date"){
          newArray[index].date = text;
          newArray[index].stus = "done"
        }else {
          if(newArray[index].date === undefined){
            newArray[index].date = new Date().toLocaleDateString("en-CA")
          }
          
          //emi amount aru total due tu calculate kori fele notun object ata assign korbya lagbu jater orginal value tu next tut assgin korbya paru
          // newArray[index].ttl_due = newArray[index].emi_amnt - text;
          this.setState({
            saveBtn : false
          })
          // let totalDue = Number(newArray[index].ttl_due) + Number(newArray[index].emi_amnt) - text
          
          
          
          newArray[index].ttl = text;
          newArray[index].stus = "done"


          let int = Number(newArray[index].intrst_amnt)  / Number(Number(newArray[index].ln_amnt) + Number(newArray[index].intrst_amnt))
          let actAmt = int * text
          console.log(Number(Number(newArray[index].ln_amnt) + Number(newArray[index].intrst_amnt)))
          let actPrinc = text - actAmt
          Object.assign(newArray[index], {...newArray[index], principle : actPrinc.toFixed(2)})
          Object.assign(newArray[index], {...newArray[index], intrest : actAmt.toFixed(2)})
          this.setState({todayEmi : newArray})
            
          }
        

        //calculation for principle and intrest
        
        // let princiFoneE = newArray[index].ln_amnt / newArray[index].no_emi;
        // let princFone = princiFoneE / newArray[index].emi_amnt;
        // let actualPrinc = princFone * text;
        // Object.assign(newArray[index], {...newArray[index], principle : actualPrinc})

        // let intFoneE = newArray[index].intrst_amnt / newArray[index].no_emi;
        // let intFone = intFoneE / newArray[index].emi_amnt;
        // let actualInt = intFone * text;
        // Object.assign(newArray[index], {...newArray[index], intrest : actualInt})

        
        
     
      
    }
    // AssignValue = ()=>{
    //   let newArray = [...this.state.todayEmi];
    //   let entered = false;
      
    //     if(newArray.length != 0){
    //       entered = true;
    //       for(var i = 0; i<newArray.length; i++){
    //         Object.assign(newArray[i], {...newArray, totalDue : Number(newArray[i].ttl_due) + Number(newArray[i].emi_amnt)})
    //       }
          
    //     }

    //     return entered;
    // }
    
     submit = ()=>{
        this.setState({disabled : true})
        this.validate()
        const Data = this.state.todayEmi;
        // this.setState({todayEmi : [],conformation : false })
        for(let p in Data){
          
            Object.assign(Data[p], {...Data[p], totalDue : ((Number(Data[p].ttl_due) + Number(Data[p].emi_amnt))-Number(Data[p].ttl)).toFixed(2)})
            if(Data[p].princ_bal == null && Data[p].intr_bal == null){
              Object.assign(Data[p],{...Data[p],
                newPrincBal : (Number(Data[p].ln_amnt) - Number(Data[p].principle)).toFixed(2),
                newIntrBal : (Number(Data[p].intrst_amnt) - Number(Data[p].intrest)).toFixed(2)
              })
            }else if(Data[p].principle == null){
              Object.assign(Data[p],{...Data[p],
                newPrincBal : Number(Data[p].princ_bal).toFixed(2),
                newIntrBal : Number(Data[p].intr_bal).toFixed(2),
              })
            }
            else {
              Object.assign(Data[p],{...Data[p],
                newPrincBal : (Number(Data[p].princ_bal) - Number(Data[p].principle)).toFixed(2),
                newIntrBal : (Number(Data[p].intr_bal) - Number(Data[p].intrest)).toFixed(2)
              })
            }
            if(Number(Data[p].princ_bal)+ Number(Data[p].intr_bal) <= Number(Data[p].ttl) && Data[p].princ_bal != null ){
              Data[p].stus = "completed";
              Data[p].newStatus = "completed"
              Data[p].submitStatus = "completed";
            }else if(Number(Data[p].ln_amnt)+Number(Data[p].intrst_amnt) <= Number(Data[p].ttl) ){
              Data[p].stus = "completed";
              Data[p].newStatus = "completed"
              Data[p].submitStatus = "completed";
            }
            else if(Data[p].ttl === ''){
              Data[p].stus = "not done";
              Data[p].newStatus = "not done"
              Data[p].submitStatus = "not submited";
            }else {
              Data[p].newStatus = "not done"
              Data[p].submitStatus = "not submited";
            }
            
         
          
        }
        const send = {
          "Data" : Data,
          "press" : "emiUpdate"
        }
        
        console.log(send)
        // sendAsync(send).then((res)=> {
        //     console.log(res)
        //     this.setState({todayEmi : [],conformation : false })
        // })

       
    }
    controller = new AbortController();
    componentDidMount(){
      this.setState({mount : true})
      if(this.state.searchval === ''){
        // sendAsync('emi',{signal: this.controller.signal}).then((res)=>{
        //     if(this.state.mount){
        //       this.setState({todayEmi : res})
        //       console.log(res)
        //     }
            
            
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
      this.controller.abort();
      // sendAsync('').then((res)=>{console.log(res)})
    }



    

    
    
    handleSearch = (ac_no)=>{
      const data = {
        "id" : ac_no,
        "ac_no" : ac_no,
        "press" : "emiSearch"
      }
      // sendAsync(data).then((res)=>{
      //   this.setState({todayEmi : res})
      //   console.log(res)
      // })
     
    }

    handleAgent = (agent_reffer)=>{
      const data = {
        agent_reffer : agent_reffer,
        "press" : "serLoanByAgent"
      }
      // sendAsync(data).then((res)=>{
      //   this.setState({todayEmi : res})
      //   console.log(res)
      // })
     
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
        
        if(isNaN(Data[p].ttl)){
          err[p] = true
          isValidate = false
        }else {
          err[p] = false
          
        }
        if(isNaN(Data[p].fine)){
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
                   <Typography>  Are you sure to update this sheet?
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
                        id="Select Agent Id"
                        
                        options={mapData}
                        getOptionLabel={(option) => option.agent_reffer}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} value={this.state.agentSearch} size="small" onChange={({target : {value}})=>this.handleAgent(value)} label="Search by agent id" variant="outlined" />}
                      />
                      <Autocomplete
                        id="Search EMI by ac no"
                        
                        options={mapData}
                        getOptionLabel={(option) => option.ac_no}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} value={this.state.searchval} size="small" onChange={({target : {value}})=>this.handleSearch(value)} label="Search EMI by ac no" variant="outlined" />}
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
                          
                          <PDFDownloadLink document={<MyDocument callback={mapData} />} fileName={filename+"DailyEMIsheet.pdf"}>
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
                                <TableCell><Typography style={style.tableFont}>AC NO</Typography></TableCell>
                                <TableCell style={style.tableFont}>LOAN ID</TableCell>
                                <TableCell style={style.tableFont}>DATE</TableCell>
                                <TableCell style={style.tableFont}>EMI AMOUNT</TableCell>
                                {/*<TableCell style={style.tableFont}>OVERDUE AMOUNT</TableCell>*/}
                                <TableCell style={style.tableFont}>BALANCE</TableCell>
                                <TableCell style={style.tableFont}>RECEIVED DATE</TableCell>
                                <TableCell style={style.tableFont}>FINE</TableCell>
                                <TableCell style={style.tableFont}>RECEIVED AMOUNT</TableCell>
                                <TableCell style={style.tableFont}>OVERDUE </TableCell>
                                
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                              
      
                              mapData.map((item,index)=> {
                                if( 0 < Number(item.princ_bal)+Number(item.intr_bal) && Number(item.princ_bal)+Number(item.intr_bal) <= item.emi_amnt && item.princ_bal != null){
                                  return (
                                   
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Typography style={style.tableFont}>{item.ac_no}</Typography>
                                        </TableCell>
                                        <TableCell>
                                             <Typography style={style.tableFont}>{item.id}</Typography>
                                        </TableCell>
                                        <TableCell >
                                             <Typography style={style.tableFont}>{item.dte}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography style={style.tableFont}>{item.emi_amnt}</Typography>
                                        </TableCell>
                                       {/* <TableCell >
                                             <Typography style={style.tableFont}>{item.ttl_due}</Typography>
                                       </TableCell> */}
                                        <TableCell>
                                             <div style={{flexDirection: 'row', display: 'flex',alignItems: 'center'}}>
                                             {
                                              Number(Number(item.princ_bal) + Number(item.intr_bal)).toFixed(2) > 0 ? (
                                                <Typography style={style.tableFont}>{Number(Number(item.princ_bal) + Number(item.intr_bal)).toFixed(2)}</Typography>
                                             
                                              ) : (
                                                <Typography style={style.tableFont}>{Number(Number(item.ln_amnt) + Number(item.intrst_amnt)).toFixed(2)}</Typography>
                                             
                                              )
                                             }
                                            
                                             <Tooltip title="This is the last emi for this account please recive all recivable amount">
                                                <IconButton color="secondary" size="small">
                                                  <InfoIcon />
                                                </IconButton>
                                             </Tooltip>
                                             </div>
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].date}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'date')}
                                              size="small"
                                              type="date"
                                              error={this.state.textErrDate[index]}
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].fine}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'fine')}
                                              size="small"
                                              type="text"
                                              error={this.state.textErrfine[index]}
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].ttl}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'ttl')}
                                              size="small"
                                              type="text"
                                              error={this.state.textErr[index]}
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            {
                                               item.ttl_due <= 0 ? (
                                                <Typography style={style.tableFont}>No</Typography>
                                              ) : (
                                                <Typography style={{fontSize: 12,color : 'red'}}>Yes</Typography>
                                              )
                                            }
                                        </TableCell>
                                    </TableRow>
                                    
                                  )
                                }else if(0 < Number(item.princ_bal) || item.princ_bal === null) {
                                  return (
                                    <TableRow key={index}>
                                        <TableCell style={style.tableFont}>
                                            <Typography style={style.tableFont}>{item.ac_no}</Typography>
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                             <Typography style={style.tableFont}>{item.id}</Typography>
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                             <Typography style={style.tableFont}>{item.dte}</Typography>
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <Typography style={style.tableFont}>{item.emi_amnt}</Typography>
                                        </TableCell>
                                        
                                        <TableCell style={style.tableFont}>
                                        {
                                        Number(Number(item.princ_bal) + Number(item.intr_bal)).toFixed(2) > 0 ? (
                                          <Typography style={style.tableFont}>{Number(Number(item.princ_bal) + Number(item.intr_bal)).toFixed(2)}</Typography>
                                       
                                        ) : (
                                          <Typography style={style.tableFont}>{Number(Number(item.ln_amnt) + Number(item.intrst_amnt)).toFixed(2)}</Typography>
                                       
                                        )
                                       }
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].date}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'date')}
                                              size="small"
                                              type="date"
                                              error={this.state.textErrDate[index]}
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].fine}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'fine')}
                                              size="small"
                                              type="text"
                                              error={this.state.textErrfine[index]}
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={this.state.todayEmi[index].ttl}
                                              onChange={({target : {value}})=> this.modifyItem(value,index, 'ttl')}
                                              size="small"
                                              type="text"
                                              error={this.state.textErr[index]}
                        
                                            />
                                        </TableCell>
                                        <TableCell style={style.tableFont}>
                                            {
                                               item.ttl_due <= 0 ? (
                                                <Typography style={style.tableFont}>No</Typography>
                                              ) : (
                                                <Typography style={{fontSize: 12,color: 'red'}}>Yes</Typography>
                                              )
                                            }
                                        </TableCell>
                                    </TableRow>
                                  )
                                }
                               
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

  export default withStyles(style)(Collection);