import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import DataEntryPage from "./components/DataEntryPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Inventory from "./components/Inventory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/data-entry"
          element={
            <ProtectedRoute>
              <DataEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/inventory" 
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
