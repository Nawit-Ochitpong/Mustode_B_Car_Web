// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login_page';
import StatisticsPage from './statistics_page';
import ListPage from './list_page';
import DetailPage from './detail_page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/list" element={<ListPage />} />

        {/* เส้นทางสำหรับหน้า Detail */}
        <Route path="/detail/:tabType/:docId" element={<DetailPage />} />

        {/* กรณี path อื่นๆ ให้กลับไปหน้า login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
