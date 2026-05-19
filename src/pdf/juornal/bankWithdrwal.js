import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import json from './../../appInfo.json'



  // Create Document Component



  

  export default function MyDocument(props){
      
    const appDet = json.Appinfo
    const[rows,setRows] = React.useState(props.callback)
    const date = props.DateDiffer;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 

    // function sum(obj) {
    //     return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
    //   }

      let sum = 0
      return(
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                <View style={styles.head}>
                    {/* <Text style={{fontSize: 10,textAlign: 'center'}}>GOVT. OF ASSAM</Text> */}
                    <Text style={styles.headText}>{appDet.name}</Text>
                    <Text style={styles.secText}>{appDet.Reg_no}</Text>
                    <Text style={{fontSize: 10,textAlign: 'center'}}>{appDet.Place}</Text>
                    <View style={styles.headDet}>
                    <Text style={{fontSize: 10,textAlign: 'center'}}>Bank Withdrawal Record</Text>
                    </View>
                </View>
                    <View style={styles.body}>
                    <Text style={styles.bodyText}>Date: {new Date(date.to).toLocaleDateString('en-US',options)} to {new Date(date.from).toLocaleDateString('en-US',options)}</Text>
                    
                        <View style={styles.container}>
                           <View style={styles.Table}>
                                <View style={styles.TableRow}>
                                    <View style={styles.TableColumn}><Text>Date</Text></View>
                                    <View style={styles.TableColumnLg}><Text>Bank Name</Text></View>
                                    <View style={styles.TableColumn}><Text>Amount</Text></View>
                                    <View style={styles.TableColumn}><Text>Type</Text></View>
                                    <View style={styles.TableColumn}><Text>Balance</Text></View>
                                </View>

                                {
                                    rows.map((item,index)=>{
                                        sum += Number(item.amount)
                                    
                                        return (
                                            <View>
                                            {
                                                item.amount !=0 ? (
                                                <View style={styles.TableRow}>
                                                <View style={styles.TableColumn}><Text>{item.date}</Text></View>
                                                <View style={styles.TableColumnLg}><Text> {item.bank_name}</Text></View>
                                                
                                               
                                                
                                                  
                                                        <View style={styles.TableColumn}><Text>{item.amount}</Text></View>
                                                    
                                                
                                                <View style={styles.TableColumn}><Text>Deposit</Text></View>
                                                <View style={styles.TableColumn}><Text>{sum}</Text></View>
                                            </View>
                                                ) : (
                                                    <View></View>
                                                )
                                            }
                                            </View>
                                        )
                                    })
                                }
                           </View>  
                        </View>
                        
                    
                
                
                            <View style={styles.footer}>
                                <Text style={{textAlign: 'left',fontSize: 10}}>President Signature</Text>
                                <Text style={{textAlign: 'right', fontSize: 10}}>Secretary Signature</Text>
                            </View>
                    </View>
                    
                  
                
                </View>
            </Page>
        </Document>
      )
  };

  const styles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: '#fff'
    },
    head : {
        justifyContent: 'center',
        
        borderBottom: '1 solid #000',
        padding: 20,
        width: '100%'
    },
    headText : {
        fontSize: 12,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    secText : {
        fontSize: 9,
        textAlign: 'center'
    },
    
    bodyText: {
        fontSize: 10,
        textAlign: 'right',
    },
    body : {
        padding: 10,
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30
    },
   
    
    footer: {
        display: 'flex',
         width: '100%',
         marginTop: 30,
         padding: 20,
 
     },
     footerText:{
         fontSize: 10,
         
     },
     mainHead: {
         width: '100%',
         borderBottom: '1 solid #000',
         padding: 10,
     },
     Table : {
         width: '100%',
         
         marginTop: 30,
        border : '1 solid #0000'
     },
     TableRow: {
         width: '100%',
         flexDirection: 'row',
         padding: 5,
         borderBottom: '1 solid #000'
     },
     TableColumn: {
         width: '17%',
         fontSize: 10,
     },
     TableColumnLg: {
         width: '32%',
         fontSize: 10
     }
     
})