import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{
            maxWidth: '32rem',
            margin: '2rem auto',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e53e3e',
            background: '#fff5f5',
            textAlign: 'center',
          }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Something went wrong</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{this.state.error?.message}</p>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #e53e3e',
                background: 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
