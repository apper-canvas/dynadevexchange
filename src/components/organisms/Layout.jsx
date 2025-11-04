import { Outlet, useOutletContext } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/layouts/Root";
import Header from "@/components/organisms/Header";

function Layout() {
  const { logout } = useAuth();
  
  // App-level state and methods that need to be shared across routes
  const outletContext = {
    logout
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main content area where route components render */}
      <Outlet context={outletContext} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default Layout;