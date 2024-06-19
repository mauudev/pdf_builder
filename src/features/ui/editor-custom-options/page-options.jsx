import * as React from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { useEditor } from '../../text-editor/contexts/editor-context';
import { parsePointValue, toTitleCase } from '../../../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'left',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PageOptions = ({ handleOpen }) => (
  <div className="rdw-option-wrapper" onClick={handleOpen}>
    <FontAwesomeIcon title="Page Options" icon="fa-solid fa-paperclip" />
  </div>
);

const PageOptionsModal = ({ isOpen, onClose }) => {
  const { editorState, dispatch } = useEditor();

  const handleChangePageSize = (size) => {
    dispatch({ type: 'CHANGE_PAGE_SIZE', payload: size });
  };

  const handleChangeLineHeight = (spacing) => {
    dispatch({
      type: 'CHANGE_LINE_HEIGHT',
      payload: spacing,
    });
  };

  const handleChangeMargin = (margin, value) => {
    dispatch({
      type: 'CHANGE_MARGIN',
      payload: { margin, value },
    });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <Typography sx={{ mb: 2 }} id="transition-modal-title" variant="h6" component="h2">
            Page options
          </Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid key={uuidv4()} item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="page-size-label">Page Size</InputLabel>
                <Select
                  value={editorState.pageStyles.pageSize}
                  labelId="page-size-label"
                  id="page-size-select"
                  label="Page Size"
                  onChange={(e) => handleChangePageSize(e.target.value)}
                >
                  <MenuItem value="LETTER">Letter</MenuItem>
                  <MenuItem value="A4">A4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {['marginTop', 'marginLeft', 'marginRight', 'marginBottom'].map((marginKey) => (
              <Grid key={uuidv4()} item xs={12} md={2}>
                <FormControl fullWidth>
                  <TextField
                    label={toTitleCase(marginKey)}
                    type="number"
                    step="0.1"
                    min="0"
                    value={parsePointValue(editorState.pageStyles.margin[marginKey])}
                    onChange={(e) => handleChangeMargin(marginKey, e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            ))}
            <Grid key={uuidv4()} item xs={12} md={2}>
              <FormControl fullWidth>
                <TextField
                  label="Line Height"
                  type="number"
                  step="0.1"
                  min="0"
                  max="0"
                  value={parsePointValue(editorState.pageStyles.lineHeight)}
                  onChange={(e) => handleChangeLineHeight(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export { PageOptions, PageOptionsModal };
