import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
    table: {
      display: 'inline-block',
      maxWidth: 350,
    },
    submitBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    cardActions: {
      alignItems: 'baseline',
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10),
      minWidth: '400px',
    }

  }),
);

export default useStyles;