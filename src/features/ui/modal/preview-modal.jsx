import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from "@mui/material/Typography";
import Modal from '@mui/material/Modal';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  width: '50%',
  height: '90%',
  overflowY: 'auto',
  p: 4,
};

const PreviewModal = ({ pdfPreview }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button className="modal-button" onClick={handleOpen}>
        <span>vista previa</span>
        <i></i>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box sx={style}>{pdfPreview}</Box>
      </Modal>
    </div>
  );
};

export default PreviewModal;
