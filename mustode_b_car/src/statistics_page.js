// statistics_page.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './App.css';

const scaleMonthlyData = (data, selectedYear) => {
  const baseYear = 2024;
  const factor = selectedYear < baseYear ? Math.pow(0.9, baseYear - selectedYear) : 1;
  return data.map(item => ({ ...item, value: Math.round(item.value * factor) }));
};

const StatisticsPage = () => {
  const categories = ['income', 'expenses', 'users', 'banned_car'];
  const [selectedCategory, setSelectedCategory] = useState('income');
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(2024);
  const [firebaseData, setFirebaseData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "statistics", String(year));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Fetched Firebase data for year", year, docSnap.data());
          setFirebaseData(docSnap.data());
        } else {
          console.log("No Firebase data for year", year, "using fallback data.");
          setFirebaseData(null);
        }
      } catch (error) {
        console.error("Error fetching Firebase data:", error);
        setFirebaseData(null);
      }
    }
    fetchData();
  }, [year]);

  const sampleData = {
    income: [
      { month: 'ม.ค.', value: 125000 },
      { month: 'ก.พ.', value: 98000 },
      { month: 'มี.ค.', value: 132000 },
      { month: 'เม.ย.', value: 115000 },
      { month: 'พ.ค.', value: 120000 },
      { month: 'มิ.ย.', value: 140000 },
      { month: 'ก.ค.', value: 155000 },
      { month: 'ส.ค.', value: 130000 },
      { month: 'ก.ย.', value: 160000 },
      { month: 'ต.ค.', value: 110000 },
      { month: 'พ.ย.', value: 90000 },
      { month: 'ธ.ค.', value: 100000 },
    ],
    expenses: [
      { month: 'ม.ค.', value: 1050000 },
      { month: 'ก.พ.', value: 1020000 },
      { month: 'มี.ค.', value: 1080000 },
      { month: 'เม.ย.', value: 1000000 },
      { month: 'พ.ค.', value: 1030000 },
      { month: 'มิ.ย.', value: 1040000 },
      { month: 'ก.ค.', value: 1100000 },
      { month: 'ส.ค.', value: 1080000 },
      { month: 'ก.ย.', value: 1110000 },
      { month: 'ต.ค.', value: 1050000 },
      { month: 'พ.ย.', value: 1020000 },
      { month: 'ธ.ค.', value: 1060000 },
    ],
    users: [
      { month: 'ม.ค.', value: 2100 },
      { month: 'ก.พ.', value: 2050 },
      { month: 'มี.ค.', value: 2150 },
      { month: 'เม.ย.', value: 2000 },
      { month: 'พ.ค.', value: 2070 },
      { month: 'มิ.ย.', value: 2090 },
      { month: 'ก.ค.', value: 2150 },
      { month: 'ส.ค.', value: 2120 },
      { month: 'ก.ย.', value: 2180 },
      { month: 'ต.ค.', value: 2050 },
      { month: 'พ.ย.', value: 2000 },
      { month: 'ธ.ค.', value: 2080 },
    ],
    banned_car: [
      { month: 'ม.ค.', value: 3800 },
      { month: 'ก.พ.', value: 3780 },
      { month: 'มี.ค.', value: 3850 },
      { month: 'เม.ย.', value: 3700 },
      { month: 'พ.ค.', value: 3760 },
      { month: 'มิ.ย.', value: 3780 },
      { month: 'ก.ค.', value: 3820 },
      { month: 'ส.ค.', value: 3800 },
      { month: 'ก.ย.', value: 3850 },
      { month: 'ต.ค.', value: 3780 },
      { month: 'พ.ย.', value: 3750 },
      { month: 'ธ.ค.', value: 3800 },
    ],
  };

  const baseMonthlyDataByCategory = firebaseData || sampleData;

  const monthlyDataByCategoryScaled = {};
  categories.forEach(cat => {
    monthlyDataByCategoryScaled[cat] = scaleMonthlyData(baseMonthlyDataByCategory[cat], year);
  });

  const totals = {};
  categories.forEach(cat => {
    totals[cat] = monthlyDataByCategoryScaled[cat].reduce((acc, cur) => acc + cur.value, 0);
  });

  const monthlyData = monthlyDataByCategoryScaled[selectedCategory];
  const maxMonthlyValue = Math.max(...monthlyData.map(item => item.value));

  const getUnit = (cat) => {
    if (cat === 'income' || cat === 'expenses') return ' บาท';
    if (cat === 'users') return ' คน';
    if (cat === 'banned_car') return ' คัน';
    return '';
  };

  const getLabel = (cat) => {
    if (cat === 'income') return 'รายได้';
    if (cat === 'expenses') return 'ค่าใช้จ่าย';
    if (cat === 'users') return 'จำนวนผู้ใช้งานแอพ';
    if (cat === 'banned_car') return 'จำนวนรถที่โดนระงับ';
    return '';
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f4f4f4', position: 'relative' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#00377E', color: 'white', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <div style={{ cursor: 'pointer' }} onClick={toggleSidebar}>
          <span style={{ fontSize: '24px', marginRight: '8px' }}>☰</span>
        </div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>สถิติ</h1>
        <div />
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
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
            onClick={toggleSidebar}
          />
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
                onClick={toggleSidebar}
                style={{ color: 'white', fontSize: '20px', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                ✖
              </button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '50%', margin: 'auto' }}></div>
                <p>admin#1234</p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <p style={{ cursor: 'pointer' }} onClick={() => { navigate('/statistics'); toggleSidebar(); }}>
                  📊 สถิติ
                </p>
                <p style={{ cursor: 'pointer' }} onClick={() => { navigate('/list'); toggleSidebar(); }}>
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

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
          <button
            onClick={() => setYear(year - 1)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px', color: '#00377E' }}
          >
            ◀
          </button>
          <h2 style={{ fontSize: '28px', color: '#333', margin: 0 }}>{year}</h2>
          <button
            onClick={() => setYear(year < currentYear ? year + 1 : year)}
            disabled={year >= currentYear}
            style={{ border: 'none', background: 'none', cursor: year >= currentYear ? 'not-allowed' : 'pointer', fontSize: '24px', color: year >= currentYear ? '#ccc' : '#00377E' }}
          >
            ▶
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
          {monthlyData.map((item, index) => {
            const barHeight = Math.round((item.value / maxMonthlyValue) * 150);
            return (
              <div key={index} style={{ textAlign: 'center', width: '40px' }}>
                <div style={{ marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                  {item.value.toLocaleString()}
                </div>
                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '5px' }}>
                  <div style={{ width: '100%', height: `${barHeight}px`, background: '#4DA6FF', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <div style={{ fontSize: '14px', color: '#333' }}>{item.month}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: 'fit-content' }}>
            {categories.map(cat => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#00377E' : '#D2E4FA',
                  borderRadius: '10px',
                  width: '250px',
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '18px', color: selectedCategory === cat ? '#fff' : '#333' }}>
                  {getLabel(cat)}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: '20px', color: selectedCategory === cat ? '#fff' : '#333' }}>
                  {totals[cat].toLocaleString() + getUnit(cat)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
