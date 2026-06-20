import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'c', activeLine }) {
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        lineProps={lineNumber => {
          let style = { display: 'block' };
          if (lineNumber === activeLine) {
            style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
            style.borderLeft = '3px solid var(--accent-primary)';
            style.paddingLeft = '0.5rem';
          }
          return { style };
        }}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-mono)',
          backgroundColor: '#0d1117'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
