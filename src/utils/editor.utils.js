import { EditorState, AtomicBlockUtils } from 'draft-js';

export const insertAtomicBlock = (targetEditorState, entityType, mutability, data) => {
  let entityKey = null;
  switch (entityType) {
    case 'TABLE':
      if (data && data.html && data.tableCells) {
        entityKey = targetEditorState
          .getCurrentContent()
          .createEntity(entityType, mutability, {
            rows: data.rows,
            columns: data.columns,
            tableCells: data.tableCells,
            styles: data.styles,
            innerHTML: data.html,
          })
          .getLastCreatedEntityKey();
      }
      break;
    default:
  }
  const character = ' ';
  const movedSelection = EditorState.moveSelectionToEnd(targetEditorState);
  return AtomicBlockUtils.insertAtomicBlock(movedSelection, entityKey, character);
};

export const entityMapper = (entity) => {
  if (entity.type === 'DIV') {
    return `<div>${entity.data.innerHTML}</div>`;
  }
  if (entity.type === 'TABLE') {
    return `<table>${entity.data.innerHTML}</table>`;
  }
  if (entity.type === 'TBODY') {
    return `<tbody>${entity.data.innerHTML}</tbody>`;
  }
  if (entity.type === 'TR') {
    return `<tr>${entity.data.innerHTML}</tr>`;
  }
  if (entity.type === 'TH') {
    return `<th>${entity.data.innerHTML}</th>`;
  }
  if (entity.type === 'TD') {
    return `<td>${entity.data.innerHTML}</td>`;
  }
  if (entity.type === 'STYLE') {
    return `<style>${entity.data.innerHTML}</style>`;
  }
  return '';
};

export const entityMapperToComponent = (entity) => {
  if (entity.type === 'DIV') {
    return () => <div dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TABLE') {
    return () => <table dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TBODY') {
    return <tbody dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TR') {
    return () => <tr dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TH') {
    return () => <th dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'TD') {
    return () => <td dangerouslySetInnerHTML={{ __html: entity.data.innerHTML }} />;
  }
  if (entity.type === 'STYLE') {
    return () => <style>{entity.data.innerHTML}</style>;
  }
  return '';
};

export const customBlockRenderFunc = (block, config) => {
  if (block.getType() === 'atomic') {
    const contentState = config.getEditorState().getCurrentContent();
    const entityKey = block.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);
    return {
      component: entityMapperToComponent(entity),
      editable: false,
      props: {
        children: () => entity.innerHTML,
      },
    };
  }
};
