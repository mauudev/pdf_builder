import {
  EditorState,
  AtomicBlockUtils,
  ContentBlock,
  ContentState,
  Modifier,
  genKey,
  CharacterMetadata,
} from 'draft-js';
import { List as ImmutableList, Repeat as ImmutableRepeat, Map as ImmutableMap } from 'immutable';

export const insertAtomicBlock = (editorState, entityType, mutability, data) => {
  let entityKey = null;
  switch (entityType) {
    case 'TABLE':
      if (data && data.html && data.tableCells) {
        entityKey = editorState
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
  const movedSelection = EditorState.moveSelectionToEnd(editorState);
  return AtomicBlockUtils.insertAtomicBlock(movedSelection, entityKey, character);
};

export const insertBlock = (editorState, blockType, text, data) => {
  let newBlock = null;
  switch (blockType) {
    case 'unstyled':
      const newBlockKey = genKey();
      const charData = CharacterMetadata.create();
      newBlock = new ContentBlock({
        key: newBlockKey,
        type: blockType,
        text: text,
        characterList: ImmutableList(ImmutableRepeat(charData, text.length)),
        data: ImmutableMap(data || {}),
      });
      break;
    default:
      return editorState;
  }
  const currentContent = editorState.getCurrentContent();
  const blockMap = currentContent.getBlockMap();
  const updatedBlocks = blockMap.set(newBlock.getKey(), newBlock);
  const updatedContentState = ContentState.createFromBlockArray(updatedBlocks.toArray());
  const newEditorState = EditorState.push(editorState, updatedContentState, 'insert-fragment');
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};

export const insertText = (editorState, text) => {
  const currentContent = editorState.getCurrentContent(),
    currentSelection = editorState.getSelection();
  const newContent = Modifier.replaceText(currentContent, currentSelection, text);
  const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
  return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
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
