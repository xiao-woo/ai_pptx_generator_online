import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OutlineEditorPage from './pages/OutlineEditorPage'
import TemplateSelectionPage from './pages/TemplateSelectionPage'
import PPTPreviewPage from './pages/PPTPreviewPage'
import ExportPage from './pages/ExportPage'
import FeedbackPage from './pages/FeedbackPage'
import Navigation from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/outline" element={<OutlineEditorPage />} />
            <Route path="/templates" element={<TemplateSelectionPage />} />
            <Route path="/preview" element={<PPTPreviewPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App