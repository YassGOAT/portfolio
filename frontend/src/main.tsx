import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Presentation from './pages/Presentation';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Certifications from './pages/Certifications';
import CVs from './pages/CVs';
import Contact from './pages/Contact';

const qc = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Presentation /> },
      { path: 'skills', element: <Skills /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetails /> },
      { path: 'certifications', element: <Certifications /> },
      { path: 'cvs', element: <CVs /> },
      { path: 'contact', element: <Contact /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
