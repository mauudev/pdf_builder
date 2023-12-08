import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, AtomicBlockUtils } from 'draft-js';

function TableOption({ onChange, editorState }) {
  const addTable = (tableData) => {
    const { headers, rows } = tableData;

    const tableStyles = {
      border: '1px solid black',
      'border-collapse': 'collapse',
      width: '100%',
    };

    const headerHTML = headers.map((header) => `<th>${header}</th>`).join('');
    const rowHTML = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
    const tableHTML = `<table style="${Object.entries(tableStyles)
      .map(([prop, value]) => `${prop}:${value}`)
      .join(';')}"><tbody>${rowHTML}</tbody></table>`;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('TABLE', 'MUTABLE', {
      innerHTML: tableHTML,
      tableStyles,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    console.log(`ENTITY KEY: ${entityKey}`);

    onChange(newEditorState);
  };

  return (
    <div
      onClick={() =>
        addTable({
          headers: ['Header 1', 'Header 2'],
          rows: [
            ['Data 1', 'Data 2'],
            ['Data 3', 'Data 4'],
          ],
        })
      }
    >
      Insert Table
    </div>
  );
}

TableOption.propTypes = {
  onChange: PropTypes.func,
  editorState: PropTypes.object,
};

export default TableOption;
