import * as React from 'react';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { entityMapper, insertBlock, insertText } from '../../../utils/editor.utils';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { useEditor } from '../../text-editor/contexts/editor-context';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const builtData = {
  blocks: [
    {
      key: '445gu',
      text: 'UNIVERSIDAD MAYOR DE SAN SIMON',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: { 'text-align': 'center' },
    },
    {
      key: 'adb92',
      text: 'FACULTAD DE ARQUITECTURA Y CIENCIAS DEL HABITAT',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 0, length: 4, style: 'color-rgb(65,168,95)' },
        { offset: 4, length: 4, style: 'color-rgb(147,101,184)' },
        { offset: 9, length: 5, style: 'color-rgb(235,107,86)' },
        { offset: 14, length: 5, style: 'color-rgb(226,80,65)' },
        { offset: 19, length: 5, style: 'color-rgb(247,218,100)' },
        { offset: 25, length: 12, style: 'color-rgb(209,72,65)' },
        { offset: 38, length: 6, style: 'color-rgb(124,112,107)' },
        { offset: 44, length: 3, style: 'color-rgb(209,213,216)' },
      ],
      entityRanges: [],
      data: { 'text-align': 'center' },
    },
    { key: 'ca2a1', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
    {
      key: 'c4s3a',
      text: 'En un rincón olvidado del universo, donde las estrellas susurran  secretos cósmicos, un gato parlante con alas de mariposa enseñaba a bailar salsa a un robot melancólico. Mientras tanto, un enjambre de  abejas filósofas debatía sobre la teoría cuántica de la miel en una colmena interdimensional.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    { key: 'b5l91', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
    {
      key: 'fifu1',
      text: 'En la ciudad flotante de Nimbus, los paraguas tenían conversaciones íntimas sobre la lluvia y los calcetines mágicos bailaban con jirafas malabaristas en la plaza central. Un científico loco inventó una máquina que convertía los sueños en burbujas de colores, y la gente paseaba por el aire atrapando sus sueños en pomposas esferas iridiscentes.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '54cjv',
      text: 'Mientras tanto, en las profundidades del océano, una sirena con gafas de buceo enseñaba a los peces a tocar la guitarra eléctrica, creando así la primera banda acuática de rock. En una isla cercana, los cocos lanzaban mensajes cifrados sobre recetas secretas de cócteles exóticos a los surfistas desprevenidos que llegaban a la playa.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '1g7dp',
      text: 'En el rincón más lejano de la galaxia, una biblioteca intergaláctica guardaba libros escritos por alienígenas políglotas sobre la poesía de las nebulosas y los haikus de los agujeros negros.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '6sdq7',
      text: 'Agua',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '4shno',
      text: 'Papa',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '6r2me',
      text: 'Azucar',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '8pq62',
      text: 'uno',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '4g31e',
      text: 'dos',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: '7451o',
      text: 'tres',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    { key: 'bvcuh', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
    {
      key: '3ooua',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 1, key: 0 }],
      data: {},
    },
    { key: 'ap589', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} },
  ],
  entityMap: {
    0: {
      type: 'TABLE',
      mutability: 'IMMUTABLE',
      data: {
        rows: 3,
        columns: 2,
        tableCells: [
          ['COL1', 'COL2'],
          ['ROW1 A', 'ROW1 B'],
          ['ROW2 A', 'ROW2 B'],
        ],
        styles: {},
        innerHTML:
          '<table><tbody><tr><td>COL1</td><td>COL2</td></tr><tr><td>ROW1 A</td><td>ROW1 B</td></tr><tr><td>ROW2 A</td><td>ROW2 B</td></tr></tbody></table>',
      },
    },
  },
};

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

const BuildState = ({ handleOpen }) => (
  <div className="rdw-option-wrapper" onClick={handleOpen}>
    <FontAwesomeIcon title="Build from state" icon="fa-solid fa-hammer" />
  </div>
);

const BuildStateModal = ({ isOpen, onClose }) => {
  const { editorState, dispatch } = useEditor();
  const [inputBlockText, setinputBlockText] = React.useState('');
  const [inputText, setinputText] = React.useState('');

  const handleTextBlockChange = (text) => {
    setinputBlockText(text);
  };

  const handleTextChange = (text) => {
    setinputText(text);
  };

  const addPredefinedContent = () => {
    const newContent = convertFromRaw(builtData);
    const updatedEditorState = EditorState.createWithContent(newContent);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: updatedEditorState,
        convertedContent: draftToHtml(
          convertToRaw(updatedEditorState.getCurrentContent()),
          null,
          false,
          entityMapper
        ),
        rawContent: convertToRaw(updatedEditorState.getCurrentContent()),
      },
    });
  };

  const addTextBlock = () => {
    const newState = insertBlock(editorState.editor.state, 'unstyled', inputBlockText);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newState,
        convertedContent: draftToHtml(convertToRaw(newState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newState.getCurrentContent()),
      },
    });
  };

  const addText = () => {
    const newState = insertText(editorState.editor.state, inputText);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newState,
        convertedContent: draftToHtml(convertToRaw(newState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newState.getCurrentContent()),
      },
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
          <Typography sx={{ textAlign: 'left', color: '#000', mb: 5 }} variant="h5">
            Build Editor State
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button size="small" color="success" variant="contained" onClick={addPredefinedContent}>
              Defined state 1
            </Button>
            <FormControl>
              <TextField
                label="Type away :)"
                type="text"
                placeholder="Enter text"
                onChange={(e) => handleTextBlockChange(e.target.value)}
                variant="outlined"
              />
              <Button size="small" color="secondary" variant="contained" onClick={addTextBlock}>
                Insert text block
              </Button>
            </FormControl>
            <FormControl>
              <TextField
                label="Type away :)"
                type="text"
                placeholder="Enter text"
                onChange={(e) => handleTextChange(e.target.value)}
                variant="outlined"
              />
              <Button size="small" color="primary" variant="contained" onClick={addText}>
                Append text
              </Button>
            </FormControl>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export { BuildState, BuildStateModal };
