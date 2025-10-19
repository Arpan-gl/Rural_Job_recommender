import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Skills from "./pages/Skills";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import {ProfilePage} from "./pages/ProfilePage";
import { useDispatch } from 'react-redux';
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { login } from "./store/reducer";
import axios from "../axios";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/user/user_detail");
        if (res.data && res.data.data) {
          dispatch(login({ user: res.data.data }));
        }
      } catch (error) {
        // Not logged in or error, do nothing
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [dispatch]);

  if (!authChecked) {
    // Show a loading spinner or blank screen while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/skills" element={
                  <PrivateRoute><Skills /></PrivateRoute>} />
                <Route path="/jobs" element={
                  <PrivateRoute><Jobs /></PrivateRoute>} />
                <Route path="/dashboard" element={
                  <PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/assistant" element={
                  <PrivateRoute><Assistant /></PrivateRoute>} />
                <Route path="/profile" element={
                  <PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signout" element={<SignOut />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;