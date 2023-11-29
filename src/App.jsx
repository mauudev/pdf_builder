import React from 'react';
import WYSIWYGEditor from './features/text-editor/editor';
import { EditorProvider } from './features/text-editor/contexts/editor-context';
import './App.css';

function App() {
  return (
    <EditorProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <img className="logo" src="cat.jpeg" alt="Logo" />
            <span>Rich Text Editor</span>
          </div>
        </header>
        <div className="app-container">
          <div className="sidebar"></div>
          <div className="editor-container">{<WYSIWYGEditor />}</div>
        </div>
      </div>
    </EditorProvider>
  );
}

export default App;
