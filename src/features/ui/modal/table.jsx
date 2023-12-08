import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { css } from 'glamor';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function customChunkRenderer(nodeName, node) {
  const allowedNodes = ['div', 'table', 'tbody', 'tr', 'th', 'td', 'thead', 'style'];

  if (allowedNodes.includes(nodeName)) {
    return {
      type: nodeName.toString().toUpperCase(),
      mutability: 'MUTABLE',
      data: {
        // Pass whatever you want here (like id, or classList, etc.)
        innerText: node.innerText,
        innerHTML: node.innerHTML,
      },
    };
  }
  return null;
}

function entityMapper(entity) {
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
}

function entityMapperToComponent(entity) {
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
}

function customBlockRenderFunc(block, config) {
  // console.log('block', block.getLength());
  // console.log('config', config);
  if (block.getType() === 'atomic') {
    const contentState = config.getEditorState().getCurrentContent();
    const entity = contentState.getEntity(block.getEntityAt(0));
    return {
      component: entityMapperToComponent(entity),
      editable: false,
      props: {
        children: () => entity.innerHTML,
      },
    };
  }
  return undefined;
}

export default function TableEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showEditorCode, setShowEditorCode] = useState(false);
  const [editorHTML, setEditorHTML] = useState('');
  const [textareaEditor, setTextareaEditor] = useState('');

  const onEditorStateChange = (editor) => {
    let payload = {
      editorState: editor,
      convertedContent: draftToHtml(convertToRaw(editor.getCurrentContent()), null, false, entityMapper),
      rawContent: convertToRaw(editor.getCurrentContent()),
    };
    console.log(`Blocks: ${JSON.stringify(convertToRaw(editor.getCurrentContent()))}`);
    setEditorState(payload.editorState);
    setEditorHTML(payload.convertedContent);
  };

  const onEditEditorHTML = (e) => {
    const editorHTML = e.target.value;
    setEditorHTML(editorHTML);
  };

  const toggleEditorCode = () => {
    if (!showEditorCode) {
      onEditorStateChange(editorState);
    }
    setShowEditorCode((prev) => !prev);
  };

  const addHtmlToEditor = () => {
    const contentBlock = htmlToDraft(editorHTML, customChunkRenderer);
    let editor;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editor = EditorState.createWithContent(contentState);
    } else {
      editor = EditorState.createEmpty();
    }
    onEditorStateChange(editor);
  };

  const ShowEditorCode = () => (
    <div className="rdw-option-wrapper" onClick={toggleEditorCode}>
      {showEditorCode ? 'Hide Code' : 'Show Code'}
    </div>
  );

  return (
    <>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        customBlockRenderFunc={customBlockRenderFunc}
        toolbarCustomButtons={[<ShowEditorCode />]}
      />

      {showEditorCode && (
        <div {...css({ width: '100%' })}>
          <textarea
            rows={10}
            {...css({
              width: '100%',
              padding: '0',
            })}
            value={editorHTML}
            onChange={onEditEditorHTML}
          />
          <div>
            <button type="button" onClick={addHtmlToEditor}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
