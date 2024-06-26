import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';

const style = {
  box: {
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
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

const PDFPreviewOption = ({ handleOpen }) => (
  <div className="rdw-option-wrapper" onClick={handleOpen}>
    <FontAwesomeIcon title="PDF Preview" icon="fa-regular fa-file-pdf" />
  </div>
);

const PreviewModal = ({ isOpen, onClose, pdfPreview }) => {
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={onClose} sx={style.modal}>
          <Box sx={style.box}>{pdfPreview}</Box>
        </Modal>
      )}
    </>
  );
};

export { PreviewModal, PDFPreviewOption };
