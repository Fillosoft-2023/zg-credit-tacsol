import React from 'react'

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import json from './../appInfo.json'

  // Create Document Component


  const columns = [
      "AC_NO","DATE","RD AMOUNT","RECEIVABLE AMOUNT","FINE","RECEIVED AMOUNT","OVERDUE"
  ]

  

  export default function MyDocument(props){
      
      
      const appDet = json.Appinfo
      const date = new Date().toLocaleDateString();
     
      const Rows = props.callback

      

      
      return(
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <View style={styles.head}>
                       <Text style={{fontSize: 10,textAlign: 'center'}}>GOVT. OF ASSAM</Text>
                        <Text style={styles.headText}>{appDet.name}</Text>
                        <Text style={styles.secText}>{appDet.Reg_no}</Text>
                        <Text style={{fontSize: 10,textAlign: 'center'}}>{appDet.Place}</Text>
                        <View style={styles.headDet}>
                        <Text style={{fontSize: 10,textAlign: 'center'}}>Daily Receipt Voucer</Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Text style={styles.bodyText}>Date : {date}</Text>

                    <View style={styles.Table}>
                        <View style={styles.TableHead}>
                            {
                                columns.map(item =>{
                                    return (
                                        <View style={styles.TableCol}>
                                        <Text style={styles.secText}>{item}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        
                         {
                            Rows.map((item,index) => {
                                return (
                                    <View style={styles.TableHead} key={index}>
                                    <View style={styles.TableCol}>
                                        <Text style={styles.secText}>{item.ac_no}</Text>
                                    </View>
                                    
                                    <View style={styles.TableCol}>
                                        <Text style={styles.secText}>{item.date}</Text>
                                    </View>
                                    <View style={styles.TableCol}>
                                        <Text style={styles.secText}>{item.r_amnt}</Text>
                                    </View>
                                    <View style={styles.TableCol}>
                                        <Text style={styles.secText}>{Number(Number(item.r_amnt) + Number(item.ttl_due)).toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.TableCol}>
                                        
                                    </View>
                                    <View style={styles.TableCol}>
                                        
                                    </View>
                                    <View style={styles.TableCol}>
                                    {
                                        item.ttl_due <=0 ? (
                                            <Text style={styles.secText}>No</Text>
                                        ) : (
                                            <Text style={styles.secText}>Yes</Text>
                                        )
                                      }
                                    </View>
                                    </View>
                                )
                            })
                         }
                       
                         <View style={styles.TableHead} >
                         <View style={styles.TableCol}>
                             <Text style={styles.secText}>TOTAL</Text>
                         </View>
                         
                         <View style={styles.TableCol}>
                             
                         </View>
                         <View style={styles.TableCol}>
                            
                         </View>
                         <View style={styles.TableCol}>
                             
                         </View>
                         <View style={styles.TableCol}>
                             
                         </View>
                         <View style={styles.TableCol}>
                             
                         </View>
                         <View style={styles.TableCol}>
                         
                         </View>
                         </View>
                    </View>
                    <View style={styles.footer}>
                         <Text style={{textAlign: 'left',fontSize: 10}}>Agent Signature</Text>
                         <Text style={{textAlign: 'right', fontSize: 10}}>Receiver signature</Text>
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
    logo : {
        width: 100,
        height: 100,
    },
    bodyText: {
        fontSize: 10,
        textAlign: 'right',
    },
    body : {
        padding: 10,
    },
    Table: {
        width: '100%',
        marginTop: 15,
    },
    TableHead : {
        width: '100%',
        flexDirection: 'row'
    },
    TableCol: {
        width: '14.29%',
        border: '1 solid #000',
        padding: 5,
    },
    footer: {
       display: 'flex',
        width: '100%',
        marginTop: 30,
        padding: 20,

    },
    footerText:{
        fontSize: 10,
        
    }
})