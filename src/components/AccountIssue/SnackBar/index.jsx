import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useNotification } from './Providers/NotificationProvider';

export default function Snackbar() {
  const [open, setOpen] = React.useState(false);
  const { showNotification } = useNotification();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This Snackbar will be dismissed in 5 seconds."
      />
    </div>
  );
}