import React from 'react';
import WYSIWYGEditor from './features/text-editor/editor';

import './App.css';

function App() {
  return (
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
  );
}

export default App;
