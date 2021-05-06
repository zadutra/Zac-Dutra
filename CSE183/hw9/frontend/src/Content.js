import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
// import SharedContext from './SharedContext';

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
  const fetchMail = (setMail) => {
    fetch('http://localhost:3010/v0/mail?mailbox='+'sent', {
      method: 'get',
    })
        .then((resp) => {
          if (!resp.ok) {
            throw resp;
          }
          const temp = Promise.resolve(resp.json());
          return temp;
        })
        .then((json) => {
          setMail(json);
        })
        .catch((error) => {
          console.log(error);
          setMail([]);
        });
  };
  // const {mailbox} = React.useContext(SharedContext);
  const [mail, setMail] = React.useState([]);
  React.useEffect(() => {
    fetchMail(setMail);
  }, []);
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Toolbar/>
      <Hidden smDown implementation="css">
        {mail}
      </Hidden>
      <Hidden mdUp implementation="css">
        {mail}
      </Hidden>
    </Paper>
  );
}

export default Content;
