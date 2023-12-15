import React, { createContext, useContext, useReducer } from 'react';
import { EditorState } from 'draft-js';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const editorInitialState = {
    pageStyles: {
      pageSize: 'LETTER',
      fontSize: '16.0pt',
      lineHeight: '1.5pt',
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
      pdfContent: null,
      pdfPreview: null,
    },
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_PAGE_SIZE':
        return {
          ...state,
          pageStyles: { ...state.pageStyles, pageSize: action.payload },
        };
      case 'CHANGE_LINE_HEIGHT':
        return {
          ...state,
          pageStyles: { ...state.pageStyles, lineHeight: `${parseFloat(action.payload)}pt` },
        };
      case 'CHANGE_MARGIN':
        return {
          ...state,
          pageStyles: {
            ...state.pageStyles,
            margin: {
              ...state.pageStyles.margin,
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
            pdfContent: action.payload.pdfContent,
          },
        };
      case 'SET_PDF_CONTENT':
        return {
          ...state,
          editor: {
            ...state.editor,
            pdfContent: action.payload.pdfContent,
            pdfPreview: action.payload.pdfPreview,
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
