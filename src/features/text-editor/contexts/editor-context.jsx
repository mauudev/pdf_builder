import React, { createContext, useContext, useReducer, useState } from 'react';
import { EditorState } from 'draft-js';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const editorInitialState = {
    styles: {
      pageSize: 'LETTER',
      fontSize: '14.0pt',
      lineHeight: '1.5rem',
      margin: {
        marginTop: '20.0pt',
        marginLeft: '20.0pt',
        marginRight: '20.0pt',
        marginBottom: '20.0pt',
      },
    },
    editor: {
      state: EditorState.createEmpty(),
      convertedContent: null,
      rawContent: {},
    },
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_PAGE_SIZE':
        return {
          ...state,
          styles: { ...state.styles, pageSize: action.payload },
        };
      case 'CHANGE_LINE_HEIGHT':
        return {
          ...state,
          styles: { ...state.styles, lineHeight: `${parseFloat(action.payload)}rem` },
        };
      case 'CHANGE_MARGIN':
        return {
          ...state,
          styles: {
            ...state.styles,
            margin: {
              ...state.styles.margin,
              [action.payload.margin]: `${parseFloat(action.payload.value)}pt`,
            },
          },
        };
      case 'SET_EDITOR_STATE':
        return {
          ...state,
          editor: {
            ...state.editor,
            state: action.payload.editorState,
            convertedContent: action.payload.convertedContent,
            rawContent: action.payload.rawContent,
          },
        };
      default:
        return state;
    }
  };

  const [editorState, dispatch] = useReducer(reducer, editorInitialState);

  const contextValue = {
    editorState,
    dispatch,
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor debe ser utilizado dentro de EditorProvider');
  }
  return context;
};
