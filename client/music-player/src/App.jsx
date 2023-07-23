import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Dashboard, Home, Login, MusicPlayer } from "./components";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";

import { AnimatePresence, motion } from "framer-motion";
import { validateUser } from "./api";
import { useStateValue } from "./contexts/StateProvider";
import { actionType } from "./contexts/reducer";

import { ProtectedRoute } from "protected-route-react";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  // state , dispatch fn
  const [{ user, isSongPlaying }, dispatch] = useStateValue();
  // console.log("INDEX :", isSongPlaying);

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );

  // so that on refreshing the information does;nt gets lost
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        // 1. we have to extract that refrence token and 2. pass it to the backend and extract info from it
        userCred.getIdToken().then((token) => {
          // console.log("🤯🤯🤯" + token);
          validateUser(token).then((data) => {
            console.log("userDataFromBackend", data);
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          });
        });
      } else {
        // 1. set auth state as false and reroute the user to login screen
        setAuth(false);
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
        window.localStorage.setItem("auth", "false");
        navigate("/login");
      }
    });
  }, [dispatch, firebaseAuth, navigate]);

  return (
    <AnimatePresence wait>
      <div className="h-auto min-w -[680px] bg-violet-100 flex justify-center items-center">
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!auth} redirect="/home">
                <Login setAuth={setAuth} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={auth} redirect="/login">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute
                isAuthenticated={auth}
                adminRoute={true}
                isAdmin={user && user?.role === "admin"}
                redirectAdmin="/"
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        {isSongPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
          >
            <MusicPlayer />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default App;
