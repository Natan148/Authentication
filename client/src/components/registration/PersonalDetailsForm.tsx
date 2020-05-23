import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import useStyles from '../styles';
import { namesValidation, emailValidation } from '../../validations';

interface IProps {
  nextStep: () => void,
  handleChange: (e: any, input: string) => any,
  autoUsername: (content: string, counter?: number) => void,
  values: any,
};

const PersonalDetailsForm: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameHelperText, setLastNameHelperText] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { values, handleChange, nextStep, autoUsername } = props;

  useEffect(() => {
    if (values.firstName.trim() && values.lastName.trim() && values.email.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [values.firstName, values.lastName, values.email]);

  useEffect(() => {firstNameError || setFirstNameHelperText('')}, [firstNameError]);
  useEffect(() => {lastNameError || setLastNameHelperText('')}, [lastNameError]);
  useEffect(() => {emailError || setEmailHelperText('')}, [emailError]);

  const continueTo = (e: any) => {
    let isError = false;
    let error = namesValidation(values.firstName).error;
    if (error) {
      isError = true;
      setFirstNameError(true);
      setFirstNameHelperText(error.message);
    } else setFirstNameError(false);

    error = namesValidation(values.lastName).error;
    if (error) {
      isError = true;
      setLastNameError(true);
      setLastNameHelperText(error.message);
    } else setLastNameError(false);

    error = emailValidation(values.email).error;
    if (error) {
      isError = true;
      setEmailError(true);
      setEmailHelperText(error.message);
    } else setEmailError(false);
 
    if (!isError) {
      autoUsername(values.firstName + values.lastName);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || continueTo(e);
    }
  };

  return (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Natan's Bank" />
          <CardContent>
            <div>
              <TextField
                error={firstNameError}
                fullWidth
                id="first-name"
                type="string"
                label="First Name"
                autoFocus
                placeholder="First Name"
                helperText={firstNameHelperText}
                defaultValue={values.firstName}
                margin="normal"
                onChange={(e) => handleChange(e, 'firstName')}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={lastNameError}
                fullWidth
                id="last-name"
                type="string"
                label="Last Name"
                placeholder="Last Name"
                margin="normal"
                helperText={lastNameHelperText}
                defaultValue={values.lastName}
                onChange={(e) => handleChange(e, 'lastName')}
                onKeyPress={(e)=>handleKeyPress(e)}
              />
              <TextField
                error={emailError}
                fullWidth
                id="email"
                type="email"
                label="Email"
                placeholder="Email"
                margin="normal"
                helperText={emailHelperText}
                defaultValue={values.email}
                onChange={(e) => handleChange(e, 'email')}
                onKeyPress={(e) => handleKeyPress(e)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.submitBtn}
              onClick={(e) => continueTo(e)}
              disabled={isButtonDisabled}>
              Continue
            </Button>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default PersonalDetailsForm;