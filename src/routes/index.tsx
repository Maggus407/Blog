import { createFileRoute } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blog</h1>
      </header>
    </div>
  )
}

