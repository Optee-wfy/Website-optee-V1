import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const observeRevealElements = () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
};

const mutationObserver = new MutationObserver(observeRevealElements);
mutationObserver.observe(document.body, { childList: true, subtree: true });
observeRevealElements();
