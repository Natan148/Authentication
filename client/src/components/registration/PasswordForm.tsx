import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from '../styles';
import { passwordValidation, usernameValidation } from '../../validations';
import axios from 'axios';

interface IProps {
  nextStep: () => void,
  handleChange: (e: any, input: string) => any,
  prevStep: () => void,
  values: any,
};

enum passTypes {PASS, REPASS};

const PasswordForm: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState('');
  const [passHelperText, setPassHelperText] = useState('');
  const [retypedPassHelperText, setRetypedPassHelperText] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [retypedPassError, setRetypedPassError] = useState(false);
  const { values, handleChange, nextStep, prevStep } = props;

  useEffect(() => {
    if (values.password.trim() && values.retypedPass.trim() && values.username.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [values.username, values.password, values.retypedPass]);

  useEffect(() => {usernameError || setUsernameHelperText('')}, [usernameError]);
  useEffect(() => {passError || setPassHelperText('')}, [passError]);
  useEffect(() => {retypedPassError || setRetypedPassHelperText('')}, [retypedPassError]);

  const handleClickShowPassword = (passType: passTypes) => {
    if (passType === passTypes.PASS) setShowPassword(!showPassword)
    else setShowRetypedPassword(!showRetypedPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const continueTo = (e: any) => {
    let isError = false;
    let error = usernameValidation(values.username).error;
    if (error) {
      isError = true;
      setUsernameError(true);
      setUsernameHelperText(error.message);
    } else setUsernameError(false);

    error = passwordValidation(values.password).error;
    if (error) {
      isError = true;
      setPassError(true);
      setPassHelperText(error.message);
    } else setPassError(false);

    if (values.password !== values.retypedPass) {
      isError = true;
      setRetypedPassError(true);
      setRetypedPassHelperText("The passwords do not match");
    } else setRetypedPassError(false);
    
    // e.preventDefault();
    axios.get(`http://localhost:4000/accounts/isUsernameExists/${values.username}`)
    .then(() => isError || nextStep())
    .catch(err => {
        setUsernameError(true);
        setUsernameHelperText(err.response.data);
    })
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
                autoFocus
                error={usernameError}
                fullWidth
                id="username"
                type="text"
                label="Username"
                placeholder="Username"
                helperText={usernameHelperText}
                defaultValue={values.username}
                margin="normal"
                onChange={(e) => handleChange(e, 'username')}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <FormControl fullWidth>
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  error={passError}
                  fullWidth
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  defaultValue={values.password}
                  onChange={(e) => handleChange(e, 'password')}
                  onKeyPress={(e) => handleKeyPress(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword(passTypes.PASS)}
                        onMouseDown={(e) => handleMouseDownPassword(e)}
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="component-error-text" error={passError}>{passHelperText}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="standard-adornment-password">Retype Password</InputLabel>
                <Input
                  error={retypedPassError}
                  fullWidth
                  id="standard-adornment-password"
                  type={showRetypedPassword ? 'text' : 'password'}
                  placeholder="Retyped Password"
                  defaultValue={values.retypedPass}
                  onChange={(e) => handleChange(e, 'retypedPass')}
                  onKeyPress={(e) => handleKeyPress(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword(passTypes.REPASS)}
                        onMouseDown={(e) => handleMouseDownPassword(e)}
                      >
                        {values.showRetypedPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="component-error-text" error={retypedPassError}>{retypedPassHelperText}
                </FormHelperText>
              </FormControl>
            </div>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              variant="contained"
              size="large"
              className={classes.submitBtn}
              onClick={() => prevStep()}>
              Back
            </Button>
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

export default PasswordForm;