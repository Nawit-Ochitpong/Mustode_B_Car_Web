import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ListPage = () => {
  const [activeTab, setActiveTab] = useState('accountDocs');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  const generateSampleData = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Name ${i + 1}`,
      status: i % 2 === 0 ? 'ปลดระงับ' : 'ระงับ',
    }));
  };

  const sampleDataAccountDocs = generateSampleData(20);
  const sampleDataCheckDocs = generateSampleData(20);
  const sampleDataTransactions = Array.from({ length: 20 }, (_, i) => ({
    name: `Name ${i + 1}`,
    status: i % 2 === 0 ? 'จ่ายแล้ว' : 'ยังไม่จ่าย',
  }));

  const filteredData = filterStatus === 'ทั้งหมด' ? sampleDataTransactions : sampleDataTransactions.filter(item => item.status === filterStatus);

  const getDataForActiveTab = () => {
    if (activeTab === 'accountDocs') return sampleDataAccountDocs;
    if (activeTab === 'checkDocs') return sampleDataCheckDocs;
    return [];
  };

  return (
    
    
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}> 
      {/* Header */}
      <div style={{ backgroundColor: '#00377E', color: 'white', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', marginRight: 'auto', cursor: 'pointer' }} onClick={toggleMenu}>
          ☰
        </span>
        <h1 style={{ margin: '0 auto', fontSize: '24px', textAlign: 'center', flex: 1 }}>รายชื่อ</h1>
      </div>
      
      {/* Burger Menu */}
      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '250px', height: '100%', backgroundColor: '#00377E', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '2px 0px 10px rgba(0,0,0,0.2)' }}>
          <div>
            <button onClick={toggleMenu} style={{ color: 'white', fontSize: '20px', border: 'none', background: 'none', cursor: 'pointer' }}>✖</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '50%', margin: 'auto' }}></div>
              <p>admin#1234</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate('/statistics')}>📊 สถิติ</p>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate('/list')}>📋 รายชื่อ</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', border: '2px solid red', padding: '10px', borderRadius: '10px', cursor: 'pointer', width: '100%' }}>ออกจากระบบ</button>
        </div>
      )}
    
  
{}

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px' }}>
        <div onClick={() => setActiveTab('accountDocs')} style={{ flex: 1, padding: '10px 15px', textAlign: 'center', cursor: 'pointer', backgroundColor: activeTab === 'accountDocs' ? '#D7F0FF' : '#7DCDFF' }}>ตรวจสอบเอกสารบัญชี</div>
        <div onClick={() => setActiveTab('checkDocs')} style={{ flex: 1, padding: '10px 15px', textAlign: 'center', cursor: 'pointer', backgroundColor: activeTab === 'checkDocs' ? '#D7F0FF' : '#7DCDFF' }}>ตรวจสอบเอกสารรถ</div>
        <div onClick={() => setActiveTab('transactions')} style={{ flex: 1, padding: '10px 15px', textAlign: 'center', cursor: 'pointer', backgroundColor: activeTab === 'transactions' ? '#D7F0FF' : '#7DCDFF' }}>การทำธุรกรรม</div>
      </div>

      {activeTab === 'transactions' ? (
        <div style={{ padding: '20px' }}>
          {/* Transaction Specific UI */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            <div style={{ background: '#D7EFFF', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <p>ยอดรวมกำไรเข้าบริษัท</p>
              <h2>฿ 3240.00</h2>
            </div>
            <div style={{ background: '#D7EFFF', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <p>ยอดรวมที่ยังไม่ได้จ่าย</p>
              <h2>฿ 2310.00</h2>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '5px', fontSize: '16px' }}>
              <option>ทั้งหมด</option>
              <option>จ่ายแล้ว</option>
              <option>ยังไม่จ่าย</option>
            </select>
          </div>

          {/* Transaction List */}
          <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
                    <span>{item.name}</span>
                  </td>
                  <td style={{ padding: '10px', width: '120px' }}>
                    <span style={{ backgroundColor: item.status === 'จ่ายแล้ว' ? '#4CAF50' : '#FF5252', color: '#fff', padding: '6px 12px', borderRadius: '5px' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', width: '80px' }}>
                    <button style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>เมนู ▾</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
            <tbody>{getDataForActiveTab().map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#00377E', borderRadius: '50%' }}></div>
                  <span>{item.name}</span>
                </td>
                <td style={{ padding: '10px', width: '120px' }}>
                  <span style={{ backgroundColor: item.status === 'ปลดระงับ' ? '#4CAF50' : '#FF5252', color: '#fff', padding: '6px 12px', borderRadius: '5px' }}>
                    {item.status}
                  </span>
                </td>
                  {/* Dropdown Button */}
          <td style={{ padding: '10px', textAlign: 'right', width: '60px' }}>
            <button
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              ▼
            </button>
          </td>
                
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPage;
