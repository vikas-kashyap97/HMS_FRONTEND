import { createContext } from "react";

// Kept in its own module (instead of main.jsx) to avoid the circular import
// main.jsx -> App.jsx -> main.jsx.
export const Context = createContext({ isAuthenticated: false });
