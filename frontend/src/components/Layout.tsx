import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <main className="z-10 w-full p-4 flex justify-center">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;