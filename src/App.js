// App.js
import { BrowserRouter } from "react-router-dom";
import Header from "./Components/app/Header"
import Nav from "./Components/app/Nav"
import Main from "./Components/app/Main"
import Footer from "./Components/app/Footer"
import AuthProvider from "./context/AuthProvider"
import HttpHeadersProvider from "./context/HttpHeadersProvider";
import "./css/style.css"
import "./index.css";
import ErrorBoundary from "./Components/error/ErrorBoundary";
import NotificationsDisplay from "./Components/notification/NotificationDisplay";



function App() {
  
  return (
    <BrowserRouter>
            <AuthProvider>
              <HttpHeadersProvider>
                <NotificationsDisplay />
                <Header />
                <Nav />
                <Main />
                <Footer />
              </HttpHeadersProvider>
            </AuthProvider>
      </BrowserRouter>

  );
}

export default App;
