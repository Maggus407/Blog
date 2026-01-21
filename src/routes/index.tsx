import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { users } from '../db/schema'
import '../App.css'

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(users)
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getUsers(),
})

function Home() {
  const users = Route.useLoaderData()

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <small>ID: {user.id}</small>
            </li>
          ))}
        </ul>
      </header>
    </div>
  )
}

