import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateServerPage from "./pages/CreateServerPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={< Layout />} >
          <Route path='login' element={< LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='create-server' element={<CreateServerPage />} />
          <Route path='profile' element={< ProfilePage />} />
          <Route path='edit-profile' element={<EditProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
