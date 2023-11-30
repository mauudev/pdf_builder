import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
  },
};

const TableModal = ({ isOpen, onClose, onSave }) => {
  const [tableData, setTableData] = useState({
    rows: 2,
    columns: 2,
    data: [
      ['1', '2'],
      ['3', '4'],
    ],
  });

  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const handleCellHover = (rowIndex, colIndex) => {
    setHoveredRow(rowIndex);
    setHoveredColumn(colIndex);
  };

  const handleRemoveRow = () => {
    if (tableData.rows > 1) {
      setTableData((prevData) => ({
        ...prevData,
        rows: prevData.rows - 1,
        data: prevData.data.filter((_, index) => index !== hoveredRow),
      }));
      setHoveredRow(null);
    }
  };

  const handleRemoveColumn = () => {
    if (tableData.columns > 1) {
      setTableData((prevData) => ({
        ...prevData,
        columns: prevData.columns - 1,
        data: prevData.data.map((row) => row.filter((_, index) => index !== hoveredColumn)),
      }));
      setHoveredColumn(null);
    }
  };

  const handleAddRow = () => {
    setTableData((prevData) => {
      const newData = [...prevData.data];
      const newRow = Array(prevData.columns).fill('');
      const targetIndex = hoveredRow !== null ? hoveredRow + 1 : prevData.rows;
      newData.splice(targetIndex, 0, newRow);
      return {
        ...prevData,
        rows: prevData.rows + 1,
        data: newData,
      };
    });
  };

  const handleAddColumn = () => {
    setTableData((prevData) => {
      const newData = prevData.data.map((row) => [...row]);
      const targetIndex = hoveredColumn !== null ? hoveredColumn + 1 : prevData.columns;
      newData.forEach((row) => row.splice(targetIndex, 0, ''));
      return {
        ...prevData,
        columns: prevData.columns + 1,
        data: newData,
      };
    });
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    setTableData((prevData) => {
      const newData = [...prevData.data];
      newData[rowIndex][colIndex] = value;
      return {
        ...prevData,
        data: newData,
      };
    });
  };

  const handleSave = () => {
    onSave(tableData);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <div>
          <h2>Agregar tabla</h2>
          <table>
            <tbody>
              {Array.from({ length: tableData.rows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  onMouseEnter={() => handleCellHover(rowIndex, null)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {Array.from({ length: tableData.columns }).map((_, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={tableData.data[rowIndex][colIndex]}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      />
                    </td>
                  ))}
                  {hoveredRow === rowIndex && (
                    <td>
                      <IconButton aria-label="add" onClick={handleAddRow}>
                        <AddCircleIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={handleRemoveRow}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  )}
                </tr>
              ))}
              <tr>
                {Array.from({ length: tableData.columns }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    onMouseEnter={() => handleCellHover(null, colIndex)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {hoveredColumn === colIndex && (
                      <>
                        <IconButton aria-label="add" onClick={handleAddColumn}>
                          <AddCircleIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleRemoveColumn}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
          <div style={modalStyle.controlButtons}>
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default TableModal;
