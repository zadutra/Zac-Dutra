import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import {LoremIpsum} from 'react-lorem-ipsum';

import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

/**
 * @return {object} JSX
 */
function Content() {
  const {mailbox} =
    React.useContext(SharedContext);

  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Toolbar/>
      <Hidden smDown implementation="css">
        <h3>Desktop {mailbox}</h3>
      </Hidden>
      <Hidden mdUp implementation="css">
        <h3>Mobile {mailbox}</h3>
      </Hidden>
      <b>Whilst you can base you Assignment 9 submission on it,
        this example solution must not be re-distrubuted,
        doing so is considered Academic Misconduct.</b>
      <p/>
        To quote the official UCSC Academic Integrity policy
        as defined by the Office of the Registrar:
      <p/>
      <i>“Violations of the Academic Integrity policy can
        result in dismissal from the university and a permanent
        notation on a student’s transcript.”</i>
      <LoremIpsum p={24}/>
    </Paper>
  );
}

export default Content;
