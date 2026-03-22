import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { ToolPage } from './pages/ToolPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools/:slug" element={<ToolPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
