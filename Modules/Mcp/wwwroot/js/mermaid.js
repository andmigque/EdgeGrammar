import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

const mermaidInitDto = {
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        darkMode: true,
        background: '#2b3b50',
        primaryColor: '#2b3b50',
        primaryBorderColor: '#1a6ea8',
        primaryTextColor: '#e8f4ff',
        lineColor: '#1a6ea8',
        secondaryColor: '#1a2a41',
        tertiaryColor: '#2b3b50'
    }
};

mermaid.initialize(mermaidInitDto);

document.addEventListener(     'DOMContentLoaded', () => { mermaid.run(); });
document.body.addEventListener('mermaid-render',   () => { mermaid.run(); });
