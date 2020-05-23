import React, { useState, useEffect } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import PasswordForm from './PasswordForm';
import BalanceForm from './BalanceForm'
import ConfirmForm from './ConfirmForm';
import axios from 'axios';
import  { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import { stat } from 'fs';
// import Success from './Success';

const Register: React.FunctionComponent<RouteComponentProps> = (): any => {
  const [state, setState] = useState({
    step: 1,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    retypedPass: '',
    balance: '0',
    username: ''
  })

  // Proceed to next step
  const nextStep = () => {
    const { step } = state;
    console.log('step', state.step)
    setState({
      ...state,
      step: step + 1
    });
    console.log('step', state.step)
  };

  // Go back to prev step
  const prevStep = () => {
    const { step } = state;
    setState({
      ...state,
      step: step - 1
    });
  };

  // Handle fields change
  const handleChange = (e: any, input: string) => {
    setState({ ...state, [input]: e.target.value });
  };

  const autoUsername = (content: string, counter: number = 0) => {
    //TODO check why the step going wrong
    let username: string;
    if (counter !== 0) username = content + counter.toString();
    else username = content;
    axios.get(`http://localhost:4000/accounts/isUsernameExists/${username}`)
    .then(() => setState({ ...state, username: username, step: state.step + 1 }))
    .catch(err => {
      if (err.response.status === 400) {
        autoUsername(content, ++counter)
      } else alert(err);
    });
  }
  
  const { step } = state;
  const { firstName, lastName, email, username, balance, password, retypedPass } = state;
  const values = { firstName, lastName, email, username, balance, password, retypedPass };

  switch (step) {
    case 1:
      return (
        <PersonalDetailsForm
          nextStep={nextStep}
          handleChange={handleChange}
          autoUsername={autoUsername}
          values={values}
        />
      );
    case 2:
      return (
        <PasswordForm
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          values={values}
        />
      );
    case 3:
      return (
        <BalanceForm
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          values={values}
        />
      );
    case 4:
      return (
        <ConfirmForm
          prevStep={prevStep}
          values={values}
        />
      );
  }
}

export default withRouter(Register);