import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from "@material-ui/core";
import Api from '../../api/api'



export default function PaymentDialog({ open, selectedFinance, setMenu, setMssg }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = React.useState({});


  const handleAmountChange = (event) => {
    setPaymentAmount(event.target.value);
  };

  const handleDateChange = (event) => {
    setPaymentDate(event.target.value);
  };
  const validate = () => {
    let valid = true
    let err = {}

    if (!paymentAmount) {
      valid = false
      err['paymentAmount'] = true
    }
    if (!paymentDate) {
      valid = false
      err['paymentDate'] = true
    }
    setErr(err)
    return valid
  }



  const onSubmitDialog = () => {
    if (validate()) {
      const create_payment = JSON.parse(sessionStorage.getItem('auth_state'));


      setLoading(true)
      const sendData = new FormData();
      sendData.append("payment_amount", paymentAmount);
      sendData.append("payment_date", paymentDate);
      sendData.append("loan_id", selectedFinance.id);

      fetch(Api + "financePayment", {
        method: "POST",
        body: sendData,
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false)
          if (res) {
            setMenu(false)
            if (res.code === 200) {
              setMssg({
                open: true,

                massg: "Transaction Successfull",
                severity: "success"
              })
              setPaymentAmount("");
              setPaymentDate("");
            } else {
              setMssg({
                open: true,

                massg: "Something Went Wrong",
                severity: "error"
              })
            }
          } else {
            setMssg({
              open: true,

              massg: "Failed To Connect to The Server",
              severity: "error"
            })
          }
        })
        .catch((err) => {
          setLoading(false)
          setMssg({
            open: true,

            massg: "Failed To Connect to The Server",
            severity: "error"
          })
        });
    }

  };

  return (
    <Dialog open={open} onClose={() => setMenu(false)}>
      <DialogTitle>Enter Payment Details for {selectedFinance.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Payment Amount"
          fullWidth
          value={paymentAmount}
          onChange={handleAmountChange}
          style={{ marginTop: 10 }}
          error={err.paymentAmount}

        />
        <TextField
          label="Payment Date"
          type="date"
          fullWidth
          value={paymentDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: 10 }}
          error={err.paymentDate}

        />

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setMenu(false)}
          color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmitDialog} disabled={loading} color="primary">
          Submit {loading ? <CircularProgress size={18} /> : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
