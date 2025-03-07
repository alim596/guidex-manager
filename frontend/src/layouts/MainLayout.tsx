import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css";

const MainLayout = () => {
    return (
      <>
        <Outlet />
        <ToastContainer/>
      </>
    )
}

export default MainLayout