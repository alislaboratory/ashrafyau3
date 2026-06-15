import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Lab from './pages/Lab';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:slug" element={<PostDetail />} />
          <Route path="lab" element={<Lab />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
