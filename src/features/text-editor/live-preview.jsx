import React, { useState, useEffect } from 'react';

const LivePreview = ({ content, pageStyles }) => {
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    let formattedContent = '';
    if (content) {
      formattedContent = content.replace(/\n/g, '<br>');
    }
    setPreviewContent(formattedContent);
  }, [content]);

  return (
    <div
      style={{
        ...pageStyles,
        fontFamily: 'Arial, sans-serif',
      }}
      dangerouslySetInnerHTML={{ __html: previewContent }}
    />
  );
};

export default LivePreview;
