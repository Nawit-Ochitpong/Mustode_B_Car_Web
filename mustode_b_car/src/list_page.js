// list_page.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ListPage = () => {
  const [activeTab, setActiveTab] = useState('accountDocs');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Sample data for each tab (replace with real data later)
  const sampleDataAccountDocs = [
    { name: 'Invoice #123', status: 'จ่ายแล้ว' },
    { name: 'Invoice #124', status: 'ยังไม่จ่าย' },
    { name: 'Invoice #125', status: 'จ่ายแล้ว' },
    { name: 'Invoice #126', status: 'ยังไม่จ่าย' },
  ];
  const sampleDataCarDocs = [
    { name: 'Car #101', status: 'ปลดระงับ' },
    { name: 'Car #102', status: 'ระงับ' },
    { name: 'Car #103', status: 'ปลดระงับ' },
    { name: 'Car #104', status: 'ระงับ' },
  ];
  const sampleDataTransactions = [
    { name: 'Txn #201', status: 'ปลดระงับ' },
    { name: 'Txn #202', status: 'ระงับ' },
    { name: 'Txn #203', status: 'ปลดระงับ' },
    { name: 'Txn #204', status: 'ระงับ' },
  ];

  // Decide which data to render based on activeTab
  const getDataForActiveTab = () => {
    if (activeTab === 'accountDocs') return sampleDataAccountDocs;
    if (activeTab === 'carDocs') return sampleDataCarDocs;
    if (activeTab === 'transactions') return sampleDataTransactions;
    return [];
  };

  const data = getDataForActiveTab();

  // Render summary boxes ONLY if the tab is "transactions"
  const renderSummaryBoxes = () => {
    if (activeTab === 'transactions') {
      return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {/* Box 1 */}
          <div
            style={{
              backgroundColor: '#E6F4FF',
              width: '220px',
              padding: '10px',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '10px 0', fontSize: '16px' }}>ยอดรวมกำไรเข้าบริษัท</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>1,281,500 บาท</p>
          </div>
          {/* Box 2 */}
          <div
            style={{
              backgroundColor: '#E6F4FF',
              width: '220px',
              padding: '10px',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '10px 0', fontSize: '16px' }}>ยอดรวมที่ยังไม่ได้จ่าย</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>1,000,000 บาท</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render each row in the table
  const renderRows = () => {
    return data.map((item, idx) => (
      <tr key={idx}>
        <td style={{ padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Placeholder icon */}
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ccc',
                borderRadius: '50%',
              }}
            />
            <span>{item.name}</span>
          </div>
        </td>
        <td style={{ padding: '10px', textAlign: 'right' }}>
          <span
            style={{
              backgroundColor:
                item.status === 'จ่ายแล้ว' || item.status === 'ปลดระงับ'
                  ? '#4CAF50'
                  : '#FF5252',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '5px',
            }}
          >
            {item.status}
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f4f4f4', position: 'relative' }}>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: '#00377E',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }} onClick={() => setSidebarOpen(true)}>
            ☰
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>รายชื่อ</h1>
        <div />
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <div
          onClick={() => setActiveTab('accountDocs')}
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'accountDocs' ? '3px solid #00377E' : 'none',
          }}
        >
          ตรวจสอบเอกสารบัญชี
        </div>
        <div
          onClick={() => setActiveTab('carDocs')}
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'carDocs' ? '3px solid #00377E' : 'none',
          }}
        >
          ตรวจสอบเอกสารรถ
        </div>
        <div
          onClick={() => setActiveTab('transactions')}
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'transactions' ? '3px solid #00377E' : 'none',
          }}
        >
          การทำธุรกรรม
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ margin: '20px' }}>
        <input
          placeholder="ค้นหา"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
      </div>

      {/* Summary Boxes (only for transactions) */}
      <div style={{ padding: '0 20px' }}>{renderSummaryBoxes()}</div>

      {/* Main Content: Table */}
      <div style={{ padding: '20px' }}>
        <table
          style={{
            width: '100%',
            backgroundColor: '#fff',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#E6F4FF' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ชื่อ</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>

      {/* Overlay (only visible if sidebarOpen) */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 5,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-250px',
          width: '250px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sidebar Header with burger icon to close */}
        <div
          style={{
            backgroundColor: '#00377E',
            color: '#fff',
            padding: '20px',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>เมนู</span>
          <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setSidebarOpen(false)}>
            ☰
          </span>
        </div>

        {/* Sidebar Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => {
              navigate('/statistics');
              setSidebarOpen(false);
            }}
          >
            <span style={{ fontSize: '18px' }}>สถิติ</span>
          </div>
          <div
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => {
              navigate('/list');
              setSidebarOpen(false);
            }}
          >
            <span style={{ fontSize: '18px' }}>รายชื่อ</span>
          </div>
        </div>

        {/* Sidebar Footer: Logout Button */}
        <button
          onClick={() => {
            navigate('/login');
            setSidebarOpen(false);
          }}
          style={{
            backgroundColor: '#FF4F4F',
            color: '#fff',
            border: 'none',
            padding: '15px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default ListPage;
