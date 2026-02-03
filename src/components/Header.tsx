import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

import './Header.css'

export default function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-item">
          <Link to="/">Home</Link>
        </div>
        {isAdminRoute && <span className="nav-item nav-item-muted">Admin</span>}
      </nav>
      {isAdminRoute && <AdminHeaderActions />}
    </header>
  )
}

function AdminHeaderActions() {
  const { data: session, isPending } = authClient.useSession()
  const [signOutErrorMessage, setSignOutErrorMessage] = useState<string | null>(null)

  const handleSignOut = async () => {
    try {
      setSignOutErrorMessage(null)
      await authClient.signOut()
      window.location.href = '/'
    } catch (signOutError) {
      console.error(signOutError)
      const friendlyMessage =
        signOutError instanceof Error && signOutError.message
          ? signOutError.message
          : 'Could not sign out. Please try again.'
      setSignOutErrorMessage(friendlyMessage)
    }
  }

  if (isPending) {
    return <p className="admin-meta">Loading session...</p>
  }

  if (!session) {
    return null
  }

  return (
    <div className="admin-actions">
      <p className="admin-meta">
       <p className="admin-meta">
        <span className="admin-name">{session.user.name ?? session.user.email}</span>
        {session.user.name && session.user.email ? <span> ({session.user.email})</span> : null}
       </p>
      </p>
      <Button type="button" size="sm" variant="outline" onClick={handleSignOut} aria-label="Sign out">
        Sign out
      </Button>
      {signOutErrorMessage ? (
        <p className="admin-error" role="alert">
          {signOutErrorMessage}
        </p>
      ) : null}
    </div>
  )
}
