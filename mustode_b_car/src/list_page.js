// list_page.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './App.css';

// Fallback sample data สำหรับทดสอบ (ถ้า Firestore ว่าง)
const sampleAccountData = [
  { id: 'acc1', name: 'Account Sample 1', status: 'ปลดระงับ' },
  { id: 'acc2', name: 'Account Sample 2', status: 'ระงับ' },
];

const sampleCheckData = [
  { id: 'chk1', name: 'Check Sample 1', status: 'ปลดระงับ' },
  { id: 'chk2', name: 'Check Sample 2', status: 'ระงับ' },
];

const sampleTransactionData = [
  { id: 'trx1', name: 'Transaction Sample 1', status: 'จ่ายแล้ว' },
  { id: 'trx2', name: 'Transaction Sample 2', status: 'ยังไม่จ่าย' },
];

const ListPage = () => {
  const [activeTab, setActiveTab] = useState('accountDocs');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');

  // States สำหรับเก็บข้อมูลจาก Firestore
  const [accountDocs, setAccountDocs] = useState([]);
  const [checkDocs, setCheckDocs] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  // ดึงข้อมูลจาก Firestore เมื่อ component โหลดขึ้นมา
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึง accountDocs
        const accountSnapshot = await getDocs(collection(db, "accountDocs"));
        const accountData = accountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccountDocs(accountData.length > 0 ? accountData : sampleAccountData);

        // ดึง checkDocs
        const checkSnapshot = await getDocs(collection(db, "checkDocs"));
        const checkData = checkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCheckDocs(checkData.length > 0 ? checkData : sampleCheckData);

        // ดึง transactions
        const transactionSnapshot = await getDocs(collection(db, "transactions"));
        const transactionData = transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(transactionData.length > 0 ? transactionData : sampleTransactionData);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        // ใช้ fallback sample data ถ้ามีข้อผิดพลาด
        setAccountDocs(sampleAccountData);
        setCheckDocs(sampleCheckData);
        setTransactions(sampleTransactionData);
      }
    };
    fetchData();
  }, []);

  // ฟังก์ชันกรองข้อมูลตาม searchTerm
  const filterBySearch = (data) => {
    return data.filter(item =>
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // เลือกข้อมูลสำหรับแต่ละแท็บ
  let dataToDisplay = [];
  if (activeTab === 'accountDocs') {
    dataToDisplay = filterBySearch(accountDocs);
  } else if (activeTab === 'checkDocs') {
    dataToDisplay = filterBySearch(checkDocs);
  } else if (activeTab === 'transactions') {
    const filteredByStatus =
      filterStatus === 'ทั้งหมด'
        ? transactions
        : transactions.filter(item => item.status === filterStatus);
    dataToDisplay = filterBySearch(filteredByStatus);
  }

  // ฟังก์ชันสลับสถานะ (Toggle Status)
  // ถ้าเป็น "ระงับ" => "ปลดระงับ"
  // ถ้าเป็น "ปลดระงับ" => "ระงับ"
  // ถ้าเป็น "จ่ายแล้ว" => "ยังไม่จ่าย"
  // ถ้าเป็น "ยังไม่จ่าย" => "จ่ายแล้ว"
  const getToggledStatus = (currentStatus) => {
    if (currentStatus === 'ระงับ') return 'ปลดระงับ';
    if (currentStatus === 'ปลดระงับ') return 'ระงับ';
    if (currentStatus === 'จ่ายแล้ว') return 'ยังไม่จ่าย';
    if (currentStatus === 'ยังไม่จ่าย') return 'จ่ายแล้ว';
    return currentStatus;
  };

  const toggleStatus = async (docId, currentStatus) => {
    const newStatus = getToggledStatus(currentStatus);

    try {
      await updateDoc(doc(db, activeTab, docId), { status: newStatus });
      // อัปเดต state ให้สอดคล้องกับการเปลี่ยนแปลง
      if (activeTab === 'accountDocs') {
        setAccountDocs(prev => prev.map(item => item.id === docId ? { ...item, status: newStatus } : item));
      } else if (activeTab === 'checkDocs') {
        setCheckDocs(prev => prev.map(item => item.id === docId ? { ...item, status: newStatus } : item));
      } else if (activeTab === 'transactions') {
        setTransactions(prev => prev.map(item => item.id === docId ? { ...item, status: newStatus } : item));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
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

      {/* Sidebar (Burger Menu) */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
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
            onClick={toggleMenu}
          />
          {/* Sidebar Container */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '250px',
              height: '100vh',
              backgroundColor: '#00377E',
              color: 'white',
              padding: '20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '2px 0px 10px rgba(0,0,0,0.2)',
              transition: 'left 0.3s ease',
              zIndex: 6,
              overflowY: 'auto',
            }}
          >
            <div>
              <button
                onClick={toggleMenu}
                style={{ color: 'white', fontSize: '20px', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                ✖
              </button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '50%', margin: 'auto' }}></div>
                <p>admin#1234</p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <p style={{ cursor: 'pointer' }} onClick={() => { navigate('/statistics'); toggleMenu(); }}>
                  📊 สถิติ
                </p>
                <p style={{ cursor: 'pointer' }} onClick={() => { navigate('/list'); toggleMenu(); }}>
                  📋 รายชื่อ
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: '2px solid red',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                width: '100%',
                position: 'sticky',
                bottom: 0,
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        </>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', width: '100%', borderTop: '1px solid #ccc' }}>
        <div 
          onClick={() => setActiveTab('accountDocs')}
          style={{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'accountDocs' ? '#D7F0FF' : '#7DCDFF',
            borderRight: '1px solid #ccc'
          }}
        >
          ตรวจสอบเอกสารบัญชี
        </div>
        <div 
          onClick={() => setActiveTab('checkDocs')}
          style={{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'checkDocs' ? '#D7F0FF' : '#7DCDFF',
            borderRight: '1px solid #ccc'
          }}
        >
          ตรวจสอบเอกสารรถ
        </div>
        <div 
          onClick={() => setActiveTab('transactions')}
          style={{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'transactions' ? '#D7F0FF' : '#7DCDFF'
          }}
        >
          การทำธุรกรรม
        </div>
      </div>

      {/* ช่องค้นหา */}
      <div style={{ padding: '10px 20px' }}>
        <input
          type="text"
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* ส่วนพิเศษของแท็บ "การทำธุรกรรม" (Transactions) */}
      {activeTab === 'transactions' && (
        <>
          {/* ส่วน "วันที่" */}
          <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              วันที่ xx/xx/xxxx - xx/xx/xxxx
            </p>
          </div>

          {/* ส่วน statistic box */}
          <div style={{ display: 'flex', gap: '20px', padding: '0 20px', marginBottom: '20px' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: '#D7EFFF',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <p style={{ margin: 0 }}>ยอดรวมกำไรเข้าบริษัท</p>
              <h2 style={{ margin: 0, color: '#333' }}>฿ 3240.00</h2>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: '#D7EFFF',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <p style={{ margin: 0 }}>ยอดรวมที่ยังไม่ได้จ่าย</p>
              <h2 style={{ margin: 0, color: '#333' }}>฿ 2310.00</h2>
            </div>
          </div>

          {/* FilterStatus (เฉพาะ transactions) */}
          <div style={{ padding: '0 20px', textAlign: 'right' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '5px', fontSize: '16px', marginBottom: '10px' }}
            >
              <option>ทั้งหมด</option>
              <option>จ่ายแล้ว</option>
              <option>ยังไม่จ่าย</option>
            </select>
          </div>
        </>
      )}

      {/* Content (ตาราง) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
          <tbody>
            {dataToDisplay.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
                  <span>{item.name}</span>
                </td>
                <td style={{ padding: '10px', width: '120px' }}>
                  {/* ปุ่มสำหรับเปลี่ยนสถานะ */}
                  <button
                    onClick={() => toggleStatus(item.id, item.status)}
                    style={{
                      backgroundColor:
                        item.status === 'ระงับ' || item.status === 'ยังไม่จ่าย'
                          ? '#FF5252'
                          : item.status === 'ปลดระงับ' || item.status === 'จ่ายแล้ว'
                          ? '#4CAF50'
                          : '#FF9800',
                      color: '#fff',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {item.status}
                  </button>
                </td>
                <td style={{ padding: '10px', textAlign: 'right', width: '80px' }}>
                  <button
                    onClick={() => navigate(`/detail/${activeTab}/${item.id}`)}
                    style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    เมนู ▾
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPage;
