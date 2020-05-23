import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import useStyles from '../styles';
import { balanceValidation } from '../../validations';

interface IProps {
  nextStep: () => void,
  handleChange: (e: any, input: string) => any,
  prevStep: () => void,
  values: any,
};

const UserNameForm: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [balanceHelperText, setBalanceHelperText] = useState('');
  const [balanceError, setBalanceError] = useState(false);
  const { values, handleChange, nextStep, prevStep } = props;

  useEffect(() => {
    if (values.balance.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [values.balance]);

  useEffect(() => {balanceError || setBalanceHelperText('')}, [balanceError]);

  const continueTo = (e: any) => {
    e.preventDefault();
    let isError = false;
    let error = balanceValidation(values.balance);
    if (error) {
      isError = true;
      setBalanceError(true);
      setBalanceHelperText(error);
    } else setBalanceError(false);

    isError || nextStep();
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
                error={balanceError}
                fullWidth
                id="balance"
                type="text"
                label="Balance"
                placeholder="Balance"
                defaultValue={values.balance}
                margin="normal"
                helperText={balanceHelperText}
                onChange={(e) => handleChange(e, 'balance')}
                onKeyPress={(e) => handleKeyPress(e)}
              />
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

export default UserNameForm;