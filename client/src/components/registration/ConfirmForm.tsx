import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import useEventListener from '../../useEventListener.hook';
import useStyles from '../styles';
import  { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import axios from 'axios';

interface IProps {
    prevStep: () => void,
    values: any,
};

const ConfirmForm: React.FunctionComponent<IProps & RouteComponentProps> = (props): JSX.Element => {
    const classes = useStyles();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { values, prevStep } = props;

    const register = () => {
        let account = values;
        delete account['retypedPass'];
        axios.post('http://localhost:4000/accounts/register', account)
        .then(() => setIsConfirmed(true))
        .catch(err => alert(err));
    }

    const handler = useCallback(
        (e: any) => {
            if (e.keyCode === 13 || e.which === 13) {
                register();
            }
        },
        []
    );
      
    useEventListener('keypress', handler);

    return (
        <React.Fragment>
        <form className={classes.container} noValidate autoComplete="off">
          <Card className={classes.card}>
            <CardHeader className={classes.header} title="Natan's Bank" />
            <CardContent>
                <h2>Confirm</h2>
                <TableContainer className={classes.table} component={Paper}>
                    <Table aria-label="customized table">
                        <TableBody>
                            <TableRow>
                                <TableCell><b>First Name</b></TableCell>
                                <TableCell>{values.firstName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Last Name</b></TableCell>
                                <TableCell>{values.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell>{values.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Balance</b></TableCell>
                                <TableCell>{values.balance} ILS</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Username</b></TableCell>
                                <TableCell>{values.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><b>Password</b></TableCell>
                                <TableCell>{'*'.repeat(values.password.length)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
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
                onClick={() => register()}
                disabled={false}>
                Register
              </Button>
             
            </CardActions>
          </Card>
        </form>
       {isConfirmed && <Redirect to='/home' />}
      </React.Fragment>
    )
}

export default withRouter(ConfirmForm);