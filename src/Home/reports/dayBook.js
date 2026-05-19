import { Container, Toolbar, makeStyles, Paper,TextField, Typography } from "@material-ui/core";
import React from "react";

export default function DayBook(){
    const classes = style();
    const today = new Date()
    const next = today.setDate(today.getDate() + 7);
    const [date, setDate]= React.useState({
        to : new Date().toLocaleDateString("en-CA"),
        from: new Date(next).toLocaleDateString("en-CA"),
        press : "profitLoss"
    })
    const handleDate = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setDate({
            ...date,
            [name] : value,
            
        })
    }

    return(
        <Container maxWidth="xxl">
            <Paper className={classes.dateBar}>
                <Typography variant="h5">Day Book</Typography>
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
                    style={{marginLeft: 10,}}
                    value={date.from}
                    onChange={handleDate}
                    
                />
                {
                    // ready ? (   
                    //     <PDFDownloadLink document={<MyDocument callback={send} />} fileName={"profitloss.pdf"}>
                    //         {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 
                    //         <Tooltip title="download this sheet">
                    //         <IconButton onClick={()=>setReady(false)}>
                    //         <GetAppIcon />
                    //         </IconButton>
                    //     </Tooltip>
                            
                    //         )}
                    //     </PDFDownloadLink>

                    // ) : (
                       
                    //       <Tooltip title="Print list">
                    //         <IconButton onClick={()=>handleDownload()}>
                    //             <PrintIcon />
                    //         </IconButton>
                    //       </Tooltip>
                    // )
                }
                </div>
               
            </Paper>
            <Paper style={{display : 'flex', justifyContent: 'center', alignItems: 'center',width : '100%', height: '80vh'}}>
                <Typography variant="h5">
                    Comming Soon
                </Typography>
            </Paper>
        </Container>
    )
}

const style  = makeStyles(()=>({
    
    dateBar : {
        padding: 5,
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 10,
    },
    leftBar : {
        maxHeight : '75vh',
        
        overflowX: 'auto',
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