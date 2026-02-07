
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import './App.css';
import NotificationSound from "./components/notificationSound/NotificationSound";
import { ChatState } from "./Context/ChatProvider";


function App() {
  const { notification } = ChatState();
  return (
    <div className="App">
      <NotificationSound notification={notification} />
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/chats" element={ <Chats/>} />
      </Routes>
      
    </div>
  )
}

export default App
