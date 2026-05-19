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
                    <Text style={{fontSize: 10,textAlign: 'center'}}>Balance Sheet</Text>
                    </View>
                </View>
                    <View style={styles.body}>
                    <Text style={styles.bodyText}>Date: {new Date(rows.date.to).toLocaleDateString('en-US',options)} to {new Date(rows.date.from).toLocaleDateString('en-US',options)}</Text>
                        <View style={styles.container}>
                            <View style={styles.sides}>
                                <View style={styles.tableRow} >
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableText}>Liabilities</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableTextAm}></Text>
                                    </View>
                                </View>
                                <View style={styles.tableRow} >
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableText}>Particulars</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableTextAm}>Amount</Text>
                                    </View>
                                </View>
                                {
                                    Object.keys(rows.liablity).map((item,keys)=>{
                                        return (
                                            <View style={styles.tableRow} key={keys} >
                                                <View style={styles.tableCol}>
                                                    <Text style={styles.TableText}>{item}</Text>
                                                </View>
                                                <View style={styles.tableCol}>
                                                    <Text style={styles.TableTextAm}>{rows.liablity[item]}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                
                            </View>
                            <View style={styles.sides}>
                                <View style={styles.tableRow} >
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableText}>Assets</Text>
                                        
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableTextAm}></Text>
                                    </View>
                                </View>
                                <View style={styles.tableRow} >
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableText}>Particulars</Text>
                                        
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.TableTextAm}>Amount</Text>
                                    </View>
                                </View>
                                <View style={styles.tableRow} >
                                        <View style={styles.tableCol}>
                                                <Text style={styles.TableText}>Asset purchased</Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                                <Text style={styles.TableTextAm}>{rows.assets.total.Asset}</Text>
                                        </View>
                                </View>
                                <View style={styles.tableRowf} >
                                        <View style={styles.tableColSubF}>
                                                <Text style={styles.TableTextSub}>Initial Asset Value</Text>
                                        </View>
                                        <View style={styles.tableColSub}>
                                                <Text style={styles.TableTextSub}>{rows.assets.total.ip}</Text>
                                        </View>
                                </View>
                                <View style={styles.tableRowff} >
                                        <View style={styles.tableColSubF}>
                                                <Text style={styles.TableTextSub}> Depreciation</Text>
                                        </View>
                                        <View style={styles.tableColSub}>
                                                <Text style={styles.TableTextSub}>{rows.assets.total.rp}</Text>
                                        </View>
                                </View>
                                {
                                    Object.keys(rows.assets).map((item,keys)=>{
                                        return (
                                            <View>
                                            {
                                                keys === 0 ? (
                                                    <View></View>
                                                ) : (
                                                    <View style={styles.tableRow} key={keys} >
                                                        <View style={styles.tableCol}>
                                                            <Text style={styles.TableText}>{item}</Text>
                                                        </View>
                                                        <View style={styles.tableCol}>
                                                            <Text style={styles.TableTextAm}>{rows.assets[item]}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            </View>
                                        )
                                    })
                                }
                                
                            </View>
                        
                        </View>
                    
                    </View>
                
                
                            <View style={styles.footer}>
                                <Text style={{textAlign: 'left',fontSize: 10}}>President Signature</Text>
                                <Text style={{textAlign: 'right', fontSize: 10}}>Secretary Signature</Text>
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
    sides: {
        width: '48%',
        marginLeft: '1%',
        border: '1 solid #000'
        
    },
    tableRow: {
        flexDirection: 'row',
        width: '100%',
        borderBottom: '1 solid #000',
        padding: 5,
    },
    tableRowf: {
        flexDirection: 'row',
        width: '100%',
        
        padding: 5,
    },
    tableRowff: {
        flexDirection: 'row',
        width: '100%',
        borderBottom: '1 solid #000',
        padding: 5,
    },
    tableCol: {
        flexDirection: 'row',
        width: '50%',

    },
    tableColSub: {
        flexDirection: 'row',
        width: '35%',
        

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
     TableText: {
         fontSize: 10,
     },
     TableTextSub: {
        fontSize: 9,
        marginLeft: 15
    },
     TableTextAm: {
        fontSize: 10,
        textAlign: 'right',
        marginRight: 15,
    }
})