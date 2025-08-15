import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuilderPage from './pages/BuilderPage';
import PreviewPage from './pages/Previewpage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/preview/:formId" element={<PreviewPage />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;