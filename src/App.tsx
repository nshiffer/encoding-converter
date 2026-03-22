import { ErrorBoundary } from './components/ErrorBoundary'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <ErrorBoundary>
      <MainLayout>
        <HomePage />
      </MainLayout>
    </ErrorBoundary>
  )
}

export default App
