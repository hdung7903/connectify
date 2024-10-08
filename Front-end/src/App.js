import React from 'react';
import AddFriend from './Addfriend';
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import 'antd/dist/antd.min.css'; // Ensure Ant Design styles are imported
import 'antd/dist/antd'; // Ensure Ant Design styles are imported
import ProfilePage from './Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddFriend />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
