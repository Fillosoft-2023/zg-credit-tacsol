import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import json from './../appInfo.json'

  // Create Document Component



  

  export default function MyDocument(props){
      
    const appDet = json.Appinfo
    const[rows,setRows] = React.useState(props.callback)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 
    function sum(obj) {
        return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
      }
      

      
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
                    <Text style={{fontSize: 10,textAlign: 'center'}}>Cash Book</Text>
                    </View>
                </View>
                {
                    props.callback.recipts != null ? (
                        <View style={styles.body}>
                            <Text style={styles.bodyText}>Date: {new Date(rows.date.to).toLocaleDateString('en-US',options)} to {new Date(rows.date.from).toLocaleDateString('en-US',options)}</Text>
                            <View style={styles.TableConatin}>
                                <View style={styles.sides}>
                                <View style={styles.mainHead}><Text style={styles.tableHead}>Receipts</Text></View>
                                
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                    <View style={styles.particulars}>
                                        <Text style={styles.tableText}>Particulars</Text>
                                    </View>
                                    <View style={styles.amount}>
                                         <Text style={styles.tableText}>Amount</Text>
                                    </View>
                                    </View>
                                    {
                                        Object.keys(rows.recipts).map((item,key)=> {
                                            return (
                                                <View style={styles.tableRow} key={key}>
                                                    <View style={styles.particulars}>
                                                        <Text style={styles.tableText}>{item}</Text>
                                                    </View>
                                                    <View style={styles.amount}>
                                                        <Text style={styles.tableText}>{Number(rows.recipts[item]).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                    
                                </View>
                                </View>
                                <View style={styles.sides}>
                                <View style={styles.mainHead}><Text style={styles.tableHead}>Payments</Text></View>
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                    <View style={styles.particulars}>
                                        <Text style={styles.tableText}>Particulars</Text>
                                    </View>
                                    <View style={styles.amount}>
                                         <Text style={styles.tableText}>Amount</Text>
                                    </View>
                                    </View>
                                    {
                                        Object.keys(rows.payments).map((item,key)=> {
                                            return (
                                                <View style={styles.tableRow} key={key}>
                                                    <View style={styles.particulars}>
                                                        <Text style={styles.tableText}>{item}</Text>
                                                    </View>
                                                    <View style={styles.amount}>
                                                        <Text style={styles.tableText}>{Number(rows.payments[item]).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                    
                                </View>
                                <View style={styles.result}>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Opening balence</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{(Number(rows.recipts_close) - Number(rows.payments_close)).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Total Receipts</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{sum(rows.recipts)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Total Payments</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{sum(rows.payments)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Closing Balance</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{((Number(rows.recipts_close) - Number(rows.payments_close) + Number(rows.recAmount)).toFixed(2) - Number(rows.payAmount).toFixed(2)).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Cash in bank</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{rows.bankAmount}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow} >
                                        <View style={styles.particulars}>
                                            <Text style={styles.tableText}>Cash in hand</Text>
                                        </View>
                                        <View style={styles.amount}>
                                            <Text style={styles.tableText}>{(Number(rows.recipts_close) - Number(rows.payments_close) + Number(rows.recAmount)).toFixed(2) - Number(rows.payAmount).toFixed(2) - Number(rows.bankAmount).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                </View>
                                
                                </View>
                                
                            </View>
                            <View style={styles.footer}>
                                <Text style={{textAlign: 'left',fontSize: 10}}>President Signature</Text>
                                <Text style={{textAlign: 'right', fontSize: 10}}>Secretary Signature</Text>
                            </View>
                        </View>
                    ) : (
                        <div></div>
                    )
                }
                    
                  
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
    TableConatin: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },
    sides:{
        width: '48%',
        
        border: '1 solid #000',
        marginLeft: '1%',
        marginTop: 20
    },
    tableHead: {
        fontSize: 12,
        textAlign: 'center',

    },
    table: {
        width: '100%',
       
    },
    tableRow: {
        width: '100%',
        flexDirection: 'row'
    },
    particulars: {
        width: '70%',
        borderBottom: '1 solid #000',
        padding: 5,
    },
    amount : {
        width: '30%',
        borderBottom: '1 solid #000',
        padding: 5,
    },
    tableText: {
        fontSize: 10,
    },
    result: {
        fontSize: 10,
        width: '50%',
        marginTop: 30,
        marginLeft: '40%'
        
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
     }
})