import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ContentCtx, loadContent, fill } from './content';

// 先读后台保存的内容,再渲染(读不到就用默认内容)
loadContent().then((content) => {
  document.title = fill(content, content.meta.pageTitle);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ContentCtx.Provider value={content}><App /></ContentCtx.Provider>
    </StrictMode>,
  );
});
