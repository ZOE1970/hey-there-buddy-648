import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { promoteLegalUsersToAdmin } from "./utils/promoteLegalUsers";

// Promote legal users to admin role on app start
promoteLegalUsersToAdmin().then(success => {
  if (success) {
    console.log('Legal users successfully promoted to admin role');
  }
});

createRoot(document.getElementById("root")!).render(<App />);
