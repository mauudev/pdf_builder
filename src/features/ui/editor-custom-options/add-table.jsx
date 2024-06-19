import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';

const modalStyle = {
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
  controlButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '1rem',
    addButtons: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
};

const getInitialState = () => ({
  rows: 2,
  columns: 2,
  styles: {},
  tableCells: [
    ['', ''],
    ['', ''],
  ],
  html: '',
});

const AddTableOption = ({ handleOpen }) => (
  <div className="rdw-option-wrapper" onClick={handleOpen}>
    <FontAwesomeIcon title="Add Table" icon="fa-solid fa-table" />
  </div>
);

const TableModal = ({ isOpen, onClose, onSave }) => {
  const [tableData, setTableData] = useState(() => getInitialState());

  const generateHtmlTable = () => {
    const { tableCells } = tableData;

    const tableRows = tableCells.map((row) => {
      const cells = row.map((cell) => `<td>${cell}</td>`).join('');
      return `<tr>${cells}</tr>`;
    });
    return `<table><tbody>${tableRows.join('')}</tbody></table>`;
  };

  useEffect(() => {
    if (isOpen) {
      setTableData(getInitialState());
    }
  }, [isOpen]);

  const handleSave = () => {
    const tableHtml = generateHtmlTable();
    setTableData((prevData) => {
      const updatedData = {
        ...prevData,
        html: tableHtml,
      };
      onSave(updatedData);
      return updatedData;
    });
  };

  const handleClose = () => {
    setTableData(getInitialState());
    onClose();
  };

  const handleRemoveRow = (rowIndex) => {
    if (tableData.rows > 1) {
      setTableData((prevData) => ({
        ...prevData,
        rows: prevData.rows - 1,
        tableCells: prevData.tableCells.filter((_, index) => index !== rowIndex),
      }));
    }
  };

  const handleRemoveColumn = (colIndex) => {
    if (tableData.columns > 1) {
      setTableData((prevData) => ({
        ...prevData,
        columns: prevData.columns - 1,
        tableCells: prevData.tableCells.map((row) => row.filter((_, index) => index !== colIndex)),
      }));
    }
  };

  const handleAddRow = () => {
    setTableData((prevData) => ({
      ...prevData,
      rows: prevData.rows + 1,
      tableCells: [...prevData.tableCells, Array(prevData.columns).fill('')],
    }));
  };

  const handleAddColumn = () => {
    setTableData((prevData) => ({
      ...prevData,
      columns: prevData.columns + 1,
      tableCells: prevData.tableCells.map((row) => [...row, '']),
    }));
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    setTableData((prevData) => {
      const newCells = [...prevData.tableCells];
      newCells[rowIndex][colIndex] = value;
      return {
        ...prevData,
        tableCells: newCells,
      };
    });
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Box sx={modalStyle}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Agregar tabla</h2>
                <IconButton
                  onClick={handleClose}
                  size="small"
                  style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <table>
                <tbody>
                  {tableData.tableCells.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        <Tooltip title="Eliminar fila">
                          <IconButton aria-label="delete" onClick={() => handleRemoveRow(rowIndex)}>
                            <RemoveCircleOutlineIcon sx={{ color: '#ff0000' }} />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    {Array.from({ length: tableData.columns }).map((_, colIndex) => (
                      <td key={colIndex}>
                        <Tooltip title="Eliminar columna">
                          <IconButton aria-label="delete" onClick={() => handleRemoveColumn(colIndex)}>
                            <RemoveCircleOutlineIcon sx={{ color: '#ff0000' }} />
                          </IconButton>
                        </Tooltip>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div style={modalStyle.controlButtons}>
                <div style={modalStyle.controlButtons.addButtons}>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddColumn}
                  >
                    Agregar Columna
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddRow}
                  >
                    Agregar Fila
                  </Button>
                </div>
                <Button variant="contained" onClick={handleSave}>
                  Guardar
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export { TableModal, AddTableOption };
