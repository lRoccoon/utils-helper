import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByText(/Utils Helper/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders all tool cards', () => {
    render(<Home />)
    expect(screen.getByText('JSON Tools')).toBeInTheDocument()
    expect(screen.getByText('YAML Tools')).toBeInTheDocument()
    expect(screen.getByText('TOML Tools')).toBeInTheDocument()
    expect(screen.getByText('Diff Tool')).toBeInTheDocument()
    expect(screen.getByText('Converter')).toBeInTheDocument()
    expect(screen.getByText('IP Address')).toBeInTheDocument()
    expect(screen.getByText('Holiday Query')).toBeInTheDocument()
  })

  it('displays keyboard shortcut hint', () => {
    render(<Home />)
    expect(screen.getByText(/Press/i)).toBeInTheDocument()
  })
})
