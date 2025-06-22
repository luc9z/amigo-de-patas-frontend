import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import {ToastContainer} from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
            <ToastContainer position="top-center" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  );
}
