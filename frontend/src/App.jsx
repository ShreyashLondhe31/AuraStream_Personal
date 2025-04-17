import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/Home/HomePage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/Home/NotFoundPage";
import CreateProfileForm from "./pages/Profile/CreateProfileForm";
import ProfileList from "./pages/Profile/ProfileList";
import ProfileProtectedRoute from "./components/ProfileProtectedRoute";
import AuthScreen from "./pages/Home/AuthScreen";

function App() {
  const { user, isCheckingAuth, authCheck, needsProfileSelection } =
    useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full bg-black">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/profiles"} />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/profiles"} />} />
				<Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
				<Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
				<Route path='/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />} />
				<Route path='/profiles' element={<ProfileList />} />
				<Route path='/createprofile' element={<CreateProfileForm />} />
				<Route path='/*' element={<NotFoundPage />} />
			</Routes>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
