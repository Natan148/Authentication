import React, { useState, useEffect } from 'react';
import  { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import useStyles from './styles';
import axios from 'axios';

const Login: React.FunctionComponent<RouteComponentProps> = (): any => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  const handleLogin = () => {
    axios.post("http://localhost:4000/accounts/login", {username, password})
    .then(res => setIsLoggedIn(true))
    .catch(err => {
        setError(true);
        setHelperText(err.response.data);
    })
  };

  const handleKeyPress = (e:any) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
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
                error={error}
                fullWidth
                id="username"
                type="email"
                label="Username"
                placeholder="Username"
                margin="normal"
                onChange={(e)=>setUsername(e.target.value)}
                onKeyPress={(e)=>handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                helperText={helperText}
                onChange={(e)=>setPassword(e.target.value)}
                onKeyPress={(e)=>handleKeyPress(e)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.submitBtn}
              onClick={()=>handleLogin()}
              disabled={isButtonDisabled}>
              Login
            </Button>
          </CardActions>
          <p>You don't have an account? <a href="/register">Register</a></p>
        </Card>
      </form>
      {isLoggedIn && <Redirect to='/home' />}
    </React.Fragment>
  );
}

export default withRouter(Login);