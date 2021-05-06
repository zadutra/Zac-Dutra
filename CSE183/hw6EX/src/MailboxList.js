import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';

import SharedContext from './SharedContext';

const boxes = [
  {name: 'Inbox', icon: <MailIcon/>},
  {name: 'Trash', icon: <DeleteIcon/>},
];

/**
 * @return {object} JSX
 */
function MailboxList() {
  const {mailbox, selectMailbox} = React.useContext(SharedContext);

  return (
    <div>
      <Toolbar />
      <List>
        {boxes.map((box) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            onClick={() => selectMailbox(box.name)}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MailboxList;
