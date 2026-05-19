import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './login/login'
import Registration from './login/registration/registration'
import { BrowserRouter as Router, Route,Switch,Redirect } from 'react-router-dom';

import MiniDrawer from './Home/home';
import NewLoanAndroid from './Home/loan_ac/new_loan_mobile';
import CreateLoanDisstructuredAndroid from './Home/loan_ac/new_loan_create_android';
import LoanSheetHomeandroid from './Home/sheets/sheets_android/loanSheetHome';
import LoanSheetAndroid from './Home/sheets/sheets_android/loanSheets';
import Newreg from './Home/newreg';
import ResgisteredMemMobile from './Home/savings/new_sav_mobile';
import CreateSavMobile from './Home/savings/create_sav_mobile';

ReactDOM.render(
  <React.StrictMode>
  <Router>
  <Switch>
      <Route exact path="/" component={App} />
      <Route path="/Login" component={Login} />
      <Route path="/Registration" component={Registration} />
      <Route path="/Home" component={MiniDrawer} />
      <Route path="/Newreg" component={Newreg} />
      <Route path="/NewLoanAndroid" component={NewLoanAndroid} />
      <Route path="/CreateLoanDisstructuredAndroid" component={CreateLoanDisstructuredAndroid} />
      <Route path="/LoanSheetHomeandroid" component={LoanSheetHomeandroid} />
      <Route path="/LoanSheetAndroid" component={LoanSheetAndroid} />
      <Route path="/ResgisteredMemMobile" component={ResgisteredMemMobile} />
      <Route path="/CreateSavMobile" component={CreateSavMobile} />
      <Route render={() => <Redirect to="/"/>}/>
      
  </Switch>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
