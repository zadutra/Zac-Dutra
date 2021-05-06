import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import emails from './data/emails.json';
// import {trimSeconds} from './index.js';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/**
 * @return {object}
 */
export default function basicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">From</TableCell>
            <TableCell align="left">Subject</TableCell>
            <TableCell align="left">Recieved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.from} onClick = {() => email.content}>
              <TableCell align="left">{email.from}</TableCell>
              <TableCell align="left">{email.subject}</TableCell>
              <TableCell align="left">{email.received}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
