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
      <div
        style={{
          backgroundColor: '#00377E',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Hamburger Icon to open sidebar */}
        <div style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }} onClick={() => setSidebarOpen(true)}>
            ☰
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>สถิติ</h1>
        <div />
      </div>

      {/* Year Navigation and Main Content */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            margin: '20px 0',
          }}
        >
          <button
            onClick={() => setYear(year - 1)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#00377E',
            }}
          >
            ◀
          </button>
          <h2 style={{ fontSize: '28px', color: '#333', margin: 0 }}>{year}</h2>
          <button
            onClick={() => setYear(year < currentYear ? year + 1 : year)}
            disabled={year >= currentYear}
            style={{
              border: 'none',
              background: 'none',
              cursor: year >= currentYear ? 'not-allowed' : 'pointer',
              fontSize: '24px',
              color: year >= currentYear ? '#ccc' : '#00377E',
            }}
          >
            ▶
          </button>
        </div>

     {/* Bar Chart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center', // ทำให้กราฟอยู่ตรงกลาง
          marginBottom: '80px',
          width: '80%', // ปรับขนาดให้พอดีกับจอ
          height: '350px', // เพิ่มความสูงของ container ของกราฟ
          padding: '0 20px', // เพิ่ม padding ซ้ายขวาให้ดูสมดุล
          margin: 'auto', // จัดให้อยู่ตรงกลาง
        }}
      >
        {monthlyData.map((item, index) => {
          const barHeight = Math.round((item.value / maxMonthlyValue) * 300); // เพิ่มขนาดกราฟ
          return (
            <div
              key={index}
              style={{
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.5s ease-in-out', // ทำให้กราฟเปลี่ยนขนาดอย่าง smooth
              }}
            >
              <div style={{ marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                {item.value.toLocaleString()}
              </div>
              <div
                style={{
                  height: '300px', // เพิ่มความสูงของ container ที่ถือแท่งกราฟ
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  width: '100%', // ให้ความกว้างเต็มพื้นที่
                }}
              >
                <div
                  style={{
                    width: '60%', // ปรับขนาดของแต่ละแท่งให้สมดุล
                    height: `${barHeight}px`,
                    background: 'linear-gradient(to top, #4A90E2, #7DCDFF)', // เพิ่มความ smooth ด้วย gradient
                    borderRadius: '8px 8px 0 0', // เพิ่มความโค้งมนให้ดู smooth
                    transition: 'height 0.5s ease-in-out', // ทำให้ความสูงของกราฟเปลี่ยนอย่างลื่นไหล
                  }}
                />
              </div>
              <div style={{ fontSize: '14px', color: '#333' }}>{item.month}</div>
            </div>
          );
        })}
      </div>



        {/* Statistic Boxes (2×2 Grid) Centered */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', width: 'fit-content' }}>
          {categories.map(cat => (
        <div
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? '#7DCDFF' : '#D7F0FF',
              borderRadius: '12px',
              width: '220px', // เพิ่มขนาดความกว้างของกล่อง
              height: '100px', // เพิ่มขนาดความสูงของกล่อง
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s ease-in-out',
              padding: '20px', // เพิ่ม Padding ให้เนื้อหาด้านในดูไม่แออัด
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // เพิ่มเงาให้ดูมิติขึ้น
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Effect Hover ขยายเล็กน้อย
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#333' }}>
              {getLabel(cat)}
            </h3>
            <p style={{ margin: '0', fontSize: '22px', fontWeight: 'normal', color: '#333' }}>
              {totals[cat].toLocaleString() + getUnit(cat)}
            </p>
              </div>
            ))}
          </div>
        </div>
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
          left: sidebarOpen ? 0 : '-250px', // Slide in/out
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
            <p style={{ marginLeft: '10px' }}>admin#1234</p>
          </div>
          <span
          style={{ fontSize: '20px', cursor: 'pointer', marginTop: '15px' }}
          onClick={() => setSidebarOpen(false)}
        >
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
            <span style={{ fontSize: '18px' }}>📊 สถิติ</span>
          </div>
          <div
            style={{ marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => {
              navigate('/list');
              setSidebarOpen(false);
            }}
          >
            <span style={{ fontSize: '18px' }}>📋 รายชื่อ</span>
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

export default StatisticsPage;