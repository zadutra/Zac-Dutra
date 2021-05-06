import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
import {useEffect} from 'react';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

/**
 *
 *
 * @param {function} setMail set the mail state
 */
export function getMail(setMail) {
  useEffect(() => {
    axios.get('http://localhost:3010/v0/mail')
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setMail(json.message);
        })
        .catch((error) => {
          setMail(error.toString());
        });
  }, []);
}


/**
 * @return {object} JSX
 */
function App() {
  const [mailbox, setMailbox] = React.useState('Inbox');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mail, setMail] = React.useState('');

  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        toggleDrawerOpen, setMail, mail, getMail,
      }}
      >
        <MailboxDrawer/>
        <TitleBar/>
        <Content/>
      </SharedContext.Provider>
    </div>
  );
}

export default App;
