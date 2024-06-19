import * as React from 'react';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { entityMapper, insertText, insertBlockList, insertList } from '../../../utils/editor.utils';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { useEditor } from '../../text-editor/contexts/editor-context';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useEffect } from 'react';

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

const pkFetch = {
  biograficos: `codigo`,
  docentes: `codigo`,
  materias: `codigo`,
  grupos: `id`,
};

const pkMap = (item) => {
  return {
    biograficos: `${item.nombres} ${item.apellidos}`,
    docentes: `${item.titulo}. ${item.nombres} ${item.apellidos}`,
    materias: `${item.nombre}`,
    grupos: `${item.grupo}`,
  };
};

const CustomSearch = ({ handleOpen }) => (
  <div className="rdw-option-wrapper" onClick={handleOpen}>
    <FontAwesomeIcon title="Custom search data" icon="fa-solid fa-magnifying-glass" />
  </div>
);

const CustomSearchModal = ({ isOpen, onClose }) => {
  const { editorState, dispatch } = useEditor();
  const [multipleValues, setMultipleValues] = useState([]);
  const [capitalList, setCapitalList] = useState(false);
  const [state, setState] = useState({
    inputBlockType: 'text',
    textPayload: {
      search: '',
      entity: 'biograficos',
    },
    searchResult: [],
    capitalText: false,
    entityProps: {
      selected: '',
      value: {},
      options: [],
    },
    selectedOption: '',
  });

  const setEntity = (e) => {
    setState((prevState) => ({
      ...prevState,
      textPayload: {
        ...prevState.textPayload,
        entity: e.target.value,
      },
    }));
  };

  const setSearch = (e, newValue) => {
    setState((prevState) => ({
      ...prevState,
      textPayload: {
        ...prevState.textPayload,
        search: newValue,
      },
    }));
    searchFetch(newValue);
  };

  const handleSearch = (e, newValue) => {
    // let aux;
    setState((prevState) => {
      const selectedObject = prevState.searchResult.find(
        (result) => pkMap(result)[state.textPayload.entity] === newValue
      );
      // selectedObject[state.textPayload.search] = state.textPayload.search;
      return {
        ...prevState,
        textPayload: {
          ...prevState.textPayload,
          search: newValue,
        },
        entityProps: {
          ...prevState.entityProps,
          value: selectedObject,
          options: selectedObject ? Object.keys(selectedObject) : [],
        },
      };
    });
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setState((prevState) => {
      const newValue = { ...prevState.entityProps.value };
      if (prevState.selectedOption in newValue) {
        newValue[prevState.selectedOption] = isChecked
          ? newValue[prevState.selectedOption].toUpperCase()
          : newValue[prevState.selectedOption].toLowerCase();
      }
      return {
        ...prevState,
        capitalText: isChecked,
        entityProps: {
          ...prevState.entityProps,
          value: newValue,
        },
      };
    });
  };

  const handleCheckboxChangeList = (event) => {
    const isChecked = event.target.checked;
    setCapitalList(isChecked);

    setMultipleValues((prevValues) => {
      if (isChecked) {
        return prevValues.map((value) => value.toUpperCase());
      } else {
        return prevValues.map((value) => value.toLowerCase());
      }
    });
  };

  const addText = () => {
    const newState = insertText(editorState.editor.state, state.entityProps?.value[state.selectedOption]);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newState,
        convertedContent: draftToHtml(convertToRaw(newState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newState.getCurrentContent()),
      },
    });
  };

  const addListBlock = () => {
    const ordered = state.inputBlockType === 'li-list' ? true : false;
    const newState = insertBlockList(editorState.editor.state, multipleValues, ordered);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newState,
        convertedContent: draftToHtml(convertToRaw(newState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newState.getCurrentContent()),
      },
    });
  };

  const addList = () => {
    const ordered = state.inputBlockType === 'li-list' ? true : false;
    const newState = insertList(editorState.editor.state, multipleValues, ordered);
    dispatch({
      type: 'SET_EDITOR_STATE',
      payload: {
        editorState: newState,
        convertedContent: draftToHtml(convertToRaw(newState.getCurrentContent()), null, false, entityMapper),
        rawContent: convertToRaw(newState.getCurrentContent()),
      },
    });
  };

  const searchFetch = async (searchText) => {
    const url = new URL(`http://localhost:8000/api/v1/fach/${state.textPayload.entity}/`);
    const params = {
      filters: JSON.stringify({ q: searchText }),
      page: 1,
      size: 20,
      sort: JSON.stringify({ field: pkFetch[state.textPayload.entity], order: 'ASC' }),
    };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const response = await fetch(url);
    const data = await response.json();
    setState((prevState) => ({
      ...prevState,
      searchResult: data.items,
    }));
  };

  useEffect(() => {
    console.log(multipleValues);
  }, [multipleValues]);

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
        <Box sx={{ ...style }}>
          <Typography sx={{ textAlign: 'left', color: '#000', mb: 2 }} variant="h5">
            Busqueda de información
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputLabel id="entity-select-label">Entidad</InputLabel>
              <Select
                labelId="entity-select-label"
                id="entity-select"
                value={state.textPayload.entity}
                label="entity"
                size="small"
                onChange={setEntity}
              >
                <MenuItem value="biograficos">Biográficos</MenuItem>
                <MenuItem value="docentes">Docentes</MenuItem>
                <MenuItem value="materias">Materias</MenuItem>
                <MenuItem value="grupos">Grupos</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <InputLabel id="block-type-select-label">Tipo de bloque</InputLabel>
              <Select
                labelId="block-type-select-label"
                id="block-type-select"
                value={state.inputBlockType}
                label="block-type"
                size="small"
                onChange={(e) => setState({ ...state, inputBlockType: e.target.value })}
              >
                <MenuItem value="text">Texto</MenuItem>
                <MenuItem value="li-list">Lista ordenada</MenuItem>
                <MenuItem value="ul-list">Lista desordenada</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <InputLabel id="search-combo-box-label">Buscar</InputLabel>
              {state.inputBlockType === 'text' ? (
                <Autocomplete
                  disablePortal
                  id="search-combo-box"
                  value={state.textPayload.search}
                  onInputChange={setSearch}
                  onChange={handleSearch}
                  options={state.searchResult.map((result) => pkMap(result)[state.textPayload.entity])}
                  sx={{ width: 300 }}
                  disableClearOnEscape
                  renderInput={(params) => <TextField {...params} label="items" />}
                />
              ) : (
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={state.searchResult.map((result) => pkMap(result)[state.textPayload.entity])}
                  getOptionLabel={(option) => option}
                  filterSelectedOptions
                  value={multipleValues}
                  onInputChange={setSearch}
                  onChange={(event, newValue) => setMultipleValues(newValue)}
                  renderInput={(params) => <TextField {...params} placeholder="Favorites" />}
                />
              )}
            </Grid>

            {state.inputBlockType === 'text' ? (
              <>
                <Grid item xs={6}>
                  <InputLabel id="property-select-label">Propiedad</InputLabel>
                  <Select
                    labelId="property-select-label"
                    id="property-select"
                    value={state.selectedOption}
                    label="property"
                    size="small"
                    onChange={(e) => setState({ ...state, selectedOption: e.target.value })}
                  >
                    {state.entityProps?.options.map((option) => (
                      <MenuItem value={option} key={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    sx={{ textAlign: 'left', color: '#000', display: 'flex', alignItems: 'center' }}
                    variant="h5"
                  >
                    Preview: {state.entityProps.value ? state.entityProps.value[state.selectedOption] : ''}
                  </Typography>
                </Grid>

                <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ textAlign: 'left', color: '#000' }} variant="h5">
                    Texto en mayuscula
                  </Typography>
                  <Checkbox
                    inputProps={{ 'aria-label': 'Checkbox demo' }}
                    checked={state.capitalText}
                    onChange={handleCheckboxChange}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ textAlign: 'left', color: '#000' }} variant="h5">
                    Texto en mayuscula
                  </Typography>
                  <Checkbox
                    inputProps={{ 'aria-label': 'Checkbox demo' }}
                    checked={capitalList}
                    onChange={handleCheckboxChangeList}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      color: '#000',
                    }}
                    variant="h5"
                  >
                    Preview:
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                    variant="h5"
                  >
                    {state.inputBlockType === 'li-list' ? (
                      <ol>
                        {multipleValues.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul>
                        {multipleValues.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </Typography>
                </Grid>
              </>
            )}

            <Grid item xs={6} style={{ display: 'flex', gap: '8px' }}>
              <Button
                size="small"
                style={{ padding: '8px 28px' }}
                color="success"
                variant="contained"
                onClick={state.inputBlockType === 'text' ? addText : addList}
              >
                Agregar
              </Button>
              <Button
                size="small"
                style={{ padding: '8px 28px' }}
                color="warning"
                variant="contained"
                onClick={onClose}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export { CustomSearch, CustomSearchModal };
