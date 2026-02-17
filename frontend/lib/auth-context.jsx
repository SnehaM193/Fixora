"use client";

import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState("user");

  useEffect(() => {
    const saved = localStorage.getItem("fixora-role");
    if (saved === "user" || saved === "vendor") {
      setRole(saved);
    }
  }, []);

  function toggleRole() {
    const newRole = role === "user" ? "vendor" : "user";
    setRole(newRole);
    localStorage.setItem("fixora-role", newRole);
  }

  function setRoleTo(newRole) {
    setRole(newRole);
    localStorage.setItem("fixora-role", newRole);
  }

  return (
    <RoleContext.Provider value={{ role, toggleRole, setRoleTo }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
