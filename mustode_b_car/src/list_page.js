import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

// ========== Popup (Modal) สำหรับชำระเงิน ==========
const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  if (!isOpen) {
    return null; // ถ้า isOpen = false ไม่ render อะไร
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        style={{
          width: '300px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <h2>ชำระเงิน</h2>
        <img
          src="https://via.placeholder.com/150?text=QR+Code"
          alt="QR Code"
          style={{ marginBottom: '10px' }}
        />
        <div style={{ marginBottom: '10px' }}>
          ยอดชำระทั้งหมด: <strong>{totalAmount} บาท</strong>
        </div>

        <div
          style={{
            marginBottom: '10px',
            borderTop: '1px solid #ccc',
            paddingTop: '10px'
          }}
        >
          <p>กำไร: 180 บาท</p>
          <p>ค่าเช่ารถ Honda Jazz: 1,800 บาท</p>
          <p style={{ color: 'red' }}>ยอดต้องชำระทั้งหมด {totalAmount} บาท</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            style={{
              backgroundColor: '#fff',
              color: '#00377E',
              border: '2px solid #00377E',
              borderRadius: '5px',
              padding: '5px 15px',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            style={{
              backgroundColor: '#00377E',
              color: '#fff',
              border: '2px solid #00377E',
              borderRadius: '5px',
              padding: '5px 15px',
              cursor: 'pointer'
            }}
            onClick={onConfirm}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== Component หลักที่แสดงรายการธุรกรรม ==========
const TransactionPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [paidTransactions, setPaidTransactions] = useState({});

  // รายการธุรกรรมตัวอย่าง
  const transactions = [
    { id: 1, name: 'รายการ 1', status: 'ยังไม่จ่าย' },
    { id: 2, name: 'รายการ 2', status: 'จ่ายแล้ว' },
    { id: 3, name: 'รายการ 3', status: 'ยังไม่จ่าย' }
  ];

  // เมื่อกดปุ่ม "ชำระเงินให้ผู้ปล่อยเช่า"
  const handlePayNow = (txId) => {
    setSelectedTxId(txId);
    setIsPaymentModalOpen(true);
  };

  // เมื่อกดปุ่ม "ตกลง" ใน Popup
  const handleConfirmPayment = () => {
    setIsPaymentModalOpen(false);

    if (selectedTxId !== null) {
      setPaidTransactions((prev) => ({
        ...prev,
        [selectedTxId]: true // เปลี่ยนสถานะรายการเป็น "จ่ายแล้ว"
      }));
    }

    setSelectedTxId(null);
  };

  // เมื่อกดปุ่ม "ยกเลิก" ใน Popup
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedTxId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>การทำธุรกรรม</h1>
      <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px' }}>{tx.name}</td>
              <td style={{ padding: '10px' }}>
                <span
                  style={{
                    backgroundColor: paidTransactions[tx.id] || tx.status === 'จ่ายแล้ว' ? '#4CAF50' : '#FF5252',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '5px'
                  }}
                >
                  {paidTransactions[tx.id] || tx.status === 'จ่ายแล้ว' ? 'จ่ายเงินแล้ว' : 'ยังไม่จ่าย'}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                {paidTransactions[tx.id] || tx.status === 'จ่ายแล้ว' ? (
                  <button
                    style={{
                      backgroundColor: '#6F6F6F',
                      color: '#fff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'default'
                    }}
                    disabled
                  >
                    ชำระเงินแล้ว
                  </button>
                ) : (
                  <button
                    style={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handlePayNow(tx.id)}
                  >
                    ชำระเงินให้ผู้ปล่อยเช่า
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ========== Popup ชำระเงิน ========== */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
        totalAmount="1620"
      />
    </div>
  );
};


// ========== Component สำหรับ dropdown ของ "ผ่าน/ไม่ผ่าน" ==========
const ApprovalDropdown = ({ rowIndex, docIndex, onSelect, currentValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(rowIndex, docIndex, option);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={toggleOpen}
        style={{
          padding: '5px 10px',
          border: 'none',
          borderRadius: '3px',
          backgroundColor:
            currentValue === 'ผ่าน'
              ? '#4CAF50'
              : currentValue === 'ไม่ผ่าน'
              ? '#FF5252'
              : '#ccc',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        {currentValue || 'เลือก'}
        <span style={{ marginLeft: '5px' }}>▾</span>
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            zIndex: 1,
            minWidth: '100%'
          }}
        >
          <div
            style={{ padding: '5px 10px', cursor: 'pointer' }}
            onClick={() => handleSelect('ผ่าน')}
          >
            ผ่าน
          </div>
          <div
            style={{ padding: '5px 10px', cursor: 'pointer' }}
            onClick={() => handleSelect('ไม่ผ่าน')}
          >
            ไม่ผ่าน
          </div>
        </div>
      )}
    </div>
  );
};

// ฟังก์ชันช่วยคำนวณวันที่
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// แปลงวันที่เป็น string แบบ dd/mm/yyyy
function formatDate(date) {
  return date.toLocaleDateString('en-GB');
}

const ListPage = () => {
  const [activeTab, setActiveTab] = useState('accountDocs'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด'); 
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [docFilter, setDocFilter] = useState('ทั้งหมด'); 
  const navigate = useNavigate();

  // ========== 1) ข้อมูลสำหรับ "ตรวจสอบเอกสารรถ" / "ตรวจสอบเอกสารบัญชี" ==========
  const generateCarDocsData = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Name ${i + 1}`,
      status: 'ระงับ',
      detail: {
        carImage: 'https://via.placeholder.com/150?text=Car+Image',
        carBrand: 'Toyota',
        carModel: `Vios ${2010 + i}`,
        seats: 4,
        gear: 'ออโต้',
        fuel: 'เบนซิน',
        engine: '1500 CC',
        wheels: 4,
        docs: [
          { label: 'สำเนาทะเบียนรถ' },
          { label: 'พ.ร.บ. รถยนต์' },
          { label: 'ใบขับขี่' },
          { label: 'สัญญาเช่ารถ' }
        ]
      }
    }));
  };

  const generateAccountDocsData = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Name ${i + 1}`,
      status: 'ระงับ',
      detail: {
        address: {
          province: 'กรุงเทพมหานคร',
          district: 'เขตบางเขน',
          subDistrict: 'แขวงอนุสาวรีย์',
          postalCode: '10220',
          road: 'ถนนพหลโยธิน',
          houseNo: `บ้านเลขที่ ${100 + i}/${25 + i}`
        },
        phone: 'xxx-xxx-xxxx',
        email: 'xxxxxxx@gmail.com',
        docs: [
          { label: 'สัญญาผู้เช่า' },
          { label: 'บัตรประชาชน' },
          { label: 'ใบขับขี่' }
        ]
      }
    }));
  };

  const initialCarDocs = generateCarDocsData(3);
  const initialAccountDocs = generateAccountDocsData(3);

  const [rowsData, setRowsData] = useState(initialAccountDocs);
  const [approvalDecisions, setApprovalDecisions] = useState({});

  useEffect(() => {
    if (activeTab === 'checkDocs') {
      setRowsData(initialCarDocs);
    } else if (activeTab === 'accountDocs') {
      setRowsData(initialAccountDocs);
    }
    setOpenRowIndex(null);
    setApprovalDecisions({});
    setDocFilter('ทั้งหมด');
  }, [activeTab]);

  const updateApprovalDecision = (rowIndex, docIndex, option) => {
    setApprovalDecisions((prev) => {
      const rowDecisions = prev[rowIndex]
        ? [...prev[rowIndex]]
        : Array(rowsData[rowIndex].detail.docs.length).fill('');
      rowDecisions[docIndex] = option;
      return { ...prev, [rowIndex]: rowDecisions };
    });
  };

  const handleSaveRow = (rowIndex) => {
    if (rowsData[rowIndex].status === 'ปลดระงับ') {
      setRowsData((prev) => {
        const newData = [...prev];
        newData[rowIndex].status = 'ระงับ';
        return newData;
      });
      alert('เปลี่ยนสถานะเป็นระงับแล้ว');
      return;
    }
    const decisions = approvalDecisions[rowIndex] || [];
    if (
      decisions.length !== rowsData[rowIndex].detail.docs.length ||
      decisions.includes('')
    ) {
      alert('กรุณาเลือกสถานะสำหรับเอกสารทุกรายการ');
      return;
    }
    const allPassed = decisions.every((d) => d === 'ผ่าน');
    setRowsData((prev) => {
      const newData = [...prev];
      newData[rowIndex].status = allPassed ? 'ปลดระงับ' : 'ระงับ';
      return newData;
    });
    alert('บันทึกข้อมูลแล้ว: ' + (allPassed ? 'ปลดระงับ' : 'ระงับ'));
  };

  const filteredRows =
    docFilter === 'ทั้งหมด'
      ? rowsData
      : rowsData.filter((row) =>
          docFilter === 'โดนระงับ'
            ? row.status === 'ระงับ'
            : row.status === 'ปลดระงับ'
        );

  // ========== 2) ข้อมูลสำหรับแท็บ "การทำธุรกรรม" ==========
  const sampleDataTransactions = [
    {
      id: 1,
      name: 'Name 1',
      status: 'ยังไม่จ่าย',
      detail: {
        carImage: 'https://via.placeholder.com/150?text=Car+Image',
        carModel: 'Toyota Vios',
        dailyPrice: 900,
        days: 2,
        discount: 10
      }
    },
    {
      id: 2,
      name: 'Name 2',
      status: 'จ่ายแล้ว',
      detail: {
        carImage: 'https://via.placeholder.com/150?text=Car+Image',
        carModel: 'Honda City',
        dailyPrice: 1000,
        days: 1,
        discount: 0
      }
    },
    {
      id: 3,
      name: 'Name 3',
      status: 'ยังไม่จ่าย',
      detail: {
        carImage: 'https://via.placeholder.com/150?text=Car+Image',
        carModel: 'Mazda 2',
        dailyPrice: 800,
        days: 3,
        discount: 5
      }
    }
  ];

  const [openTxIndex, setOpenTxIndex] = useState(null);
  const toggleTxDropdown = (index) => {
    if (openTxIndex === index) {
      setOpenTxIndex(null);
    } else {
      setOpenTxIndex(index);
    }
  };

  const filteredTransactions =
    filterStatus === 'ทั้งหมด'
      ? sampleDataTransactions
      : sampleDataTransactions.filter((tx) => tx.status === filterStatus);

  // ========== 3) ฟีเจอร์ปุ่มเลือกรถ & ช่วงวันที่ ในแท็บการทำธุรกรรม ==========
  const [selectedCar, setSelectedCar] = useState('Toyota Vios');
  const carOptions = ['Toyota Vios', 'Honda City', 'Mazda 2', 'Nissan Almera'];

  const [dateRangeOffset, setDateRangeOffset] = useState(0);
  const today = new Date();
  const startDate = addDays(today, 14 * dateRangeOffset);
  const endDate = addDays(startDate, 14);

  // ========== 4) ฟีเจอร์ Popup ชำระเงิน (Modal) ==========
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState(null); // เก็บ ID ของรายการที่จะจ่าย

  // เมื่อกดปุ่ม "ชำระเงินให้ผู้ปล่อยเช่า"
  const handlePayNow = (txId) => {
    setSelectedTxId(txId);
    setIsPaymentModalOpen(true);
  };

  // เมื่อกดปุ่ม "ตกลง" ใน Popup
  const handleConfirmPayment = () => {
    // ปิด Popup
    setIsPaymentModalOpen(false);

    // เปลี่ยนสถานะรายการเป็น "จ่ายแล้ว"
    if (selectedTxId !== null) {
      // สมมติเราแก้ใน sampleDataTransactions ได้เลย (แต่จริง ๆ อาจต้องเก็บเป็น state)
      // เพื่อความง่ายในตัวอย่างนี้ จะใช้วิธี filter & map
      sampleDataTransactions.forEach((tx) => {
        if (tx.id === selectedTxId) {
          tx.status = 'จ่ายแล้ว';
        }
      });
    }
    setSelectedTxId(null);
    alert('ชำระเงินเรียบร้อยแล้ว');
  };

  // เมื่อกดปุ่ม "ยกเลิก" ใน Popup
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedTxId(null);
  };

  // ========== ฟังก์ชันทั่วไป ==========
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#00377E',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{ fontSize: '24px', marginRight: 'auto', cursor: 'pointer' }}
          onClick={toggleMenu}
        >
          ☰
        </span>
        <h1 style={{ margin: '0 auto', fontSize: '24px', textAlign: 'center', flex: 1 }}>
          รายชื่อ
        </h1>
      </div>

      {/* Burger Menu */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '250px',
            height: '100%',
            backgroundColor: '#00377E',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '2px 0px 10px rgba(0,0,0,0.2)'
          }}
        >
          <div>
            <button
              onClick={toggleMenu}
              style={{
                color: 'white',
                fontSize: '20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  margin: 'auto'
                }}
              ></div>
              <p>admin#1234</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate('/statistics')}>
                📊 สถิติ
              </p>
              <p style={{ cursor: 'pointer' }} onClick={() => navigate('/list')}>
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
              width: '100%'
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px' }}>
        <div
          onClick={() => setActiveTab('accountDocs')}
          style={{
            flex: 1,
            padding: '10px 15px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'accountDocs' ? '#D7F0FF' : '#7DCDFF'
          }}
        >
          ตรวจสอบเอกสารบัญชี
        </div>
        <div
          onClick={() => setActiveTab('checkDocs')}
          style={{
            flex: 1,
            padding: '10px 15px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'checkDocs' ? '#D7F0FF' : '#7DCDFF'
          }}
        >
          ตรวจสอบเอกสารรถ
        </div>
        <div
          onClick={() => setActiveTab('transactions')}
          style={{
            flex: 1,
            padding: '10px 15px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'transactions' ? '#D7F0FF' : '#7DCDFF'
          }}
        >
          การทำธุรกรรม
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        {activeTab === 'transactions' ? (
          // ===================== แท็บ "การทำธุรกรรม" =====================
          <div style={{ padding: '20px' }}>
            {/* สรุปข้อมูลด้านบน */}
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

            {/* Filter dropdown สำหรับ transactions */}
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '5px', fontSize: '16px' }}
              >
                <option>ทั้งหมด</option>
                <option>จ่ายแล้ว</option>
                <option>ยังไม่จ่าย</option>
              </select>
            </div>

            <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
              <tbody>
                {filteredTransactions.map((tx, index) => {
                  const totalPrice = tx.detail.dailyPrice * tx.detail.days;
                  const discountAmount = totalPrice * (tx.detail.discount / 100);
                  const finalPrice = totalPrice - discountAmount;

                  return (
                    <React.Fragment key={tx.id}>
                      {/* แถวหลัก */}
                      <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
                          <span>{tx.name}</span>
                        </td>
                        <td style={{ padding: '10px', width: '120px' }}>
                          <span
                            style={{
                              backgroundColor: tx.status === 'จ่ายแล้ว' ? '#4CAF50' : '#FF5252',
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: '5px'
                            }}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', width: '80px' }}>
                          <button
                            style={{
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              padding: '5px 10px',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            onClick={() => toggleTxDropdown(index)}
                          >
                            {openTxIndex === index ? '▲' : '▼'}
                          </button>
                        </td>
                      </tr>

                      {/* แถวรายละเอียด (ถ้าเปิด dropdown) */}
                      {openTxIndex === index && (
                        <tr>
                          <td style={{ padding: '10px', backgroundColor: '#f9f9f9' }} colSpan={3}>
                            {/* ส่วนตัวเลือกรถและช่วงวันที่ */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '20px',
                              paddingBottom: '10px',
                              borderBottom: '1px solid #ccc'
                            }}>
                              {/* มุมซ้าย: ตัวเลือกรถ */}
                              <div>
                                <label>
                                  เลือกรถ:{' '}
                                  <select
                                    value={selectedCar}
                                    onChange={(e) => setSelectedCar(e.target.value)}
                                    style={{ padding: '5px' }}
                                  >
                                    {carOptions.map((car) => (
                                      <option key={car} value={car}>
                                        {car}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              {/* มุมขวา: ช่วงวันที่ */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => setDateRangeOffset(dateRangeOffset - 1)}
                                >
                                  ◀
                                </button>
                                <span>
                                  {formatDate(startDate)} - {formatDate(endDate)}
                                </span>
                                <button
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => setDateRangeOffset(dateRangeOffset + 1)}
                                >
                                  ▶
                                </button>
                              </div>
                            </div>

                            {/* รายละเอียดราคา */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                              {/* ซ้าย: ข้อมูลรถ */}
                              <div style={{ flex: 1 }}>
                                <img
                                  src={tx.detail.carImage}
                                  alt="Car"
                                  style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                                />
                                <div style={{ marginTop: '8px' }}>
                                  <strong>{tx.detail.carModel}</strong>
                                </div>
                              </div>
                              {/* กลาง: รายละเอียดราคา */}
                              <div style={{ flex: 2 }}>
                                <p>• รายละเอียด: {tx.detail.dailyPrice} x {tx.detail.days} วัน</p>
                                <p>ถึงวันที่ xx/xx/xxxx - xx/xx/xxxx</p>
                                <p style={{ marginTop: '20px' }}>
                                  <strong>ส่วนต่าง</strong><br />
                                  {tx.detail.discount > 0
                                    ? `หักค่าให้แอพ ${tx.detail.discount}%`
                                    : 'ไม่มีส่วนลด'}
                                </p>
                              </div>
                              {/* ขวา: สรุปราคา */}
                              <div style={{ flex: 1, textAlign: 'right' }}>
                                <div style={{ marginBottom: '8px' }}>
                                  <span>฿{totalPrice}</span>
                                </div>
                                {tx.detail.discount > 0 && (
                                  <div style={{ marginBottom: '8px' }}>
                                    <span>-฿{discountAmount}</span>
                                  </div>
                                )}
                                <div style={{ fontWeight: 'bold', color: '#E53935', marginBottom: '20px' }}>
                                  ฿{finalPrice}
                                </div>

                                {/* ปุ่มชำระเงิน */}
                                {tx.status === 'ยังไม่จ่าย' ? (
                                  <button
                                    style={{
                                      backgroundColor: '#4CAF50',
                                      color: '#fff',
                                      padding: '10px 20px',
                                      border: 'none',
                                      borderRadius: '5px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handlePayNow(tx.id)}
                                  >
                                    ชำระเงินให้ผู้ปล่อยเช่า
                                  </button>
                                ) : (
                                  <button
                                    style={{
                                      backgroundColor: '#999',
                                      color: '#fff',
                                      padding: '10px 20px',
                                      border: 'none',
                                      borderRadius: '5px',
                                      cursor: 'default'
                                    }}
                                    disabled
                                  >
                                    ชำระเงินแล้ว
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (


          
          // ===================== แท็บ "ตรวจสอบเอกสารบัญชี" หรือ "ตรวจสอบเอกสารรถ" =====================
          <div>
            <div style={{ margin: '10px 0', textAlign: 'right' }}>
              <select
                value={docFilter}
                onChange={(e) => setDocFilter(e.target.value)}
                style={{ padding: '5px', fontSize: '16px' }}
              >
                <option value="ทั้งหมด">ทั้งหมด</option>
                <option value="โดนระงับ">โดนระงับ</option>
                <option value="ปลดระงับ">ปลดระงับ</option>
              </select>
            </div>
            <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse' }}>
              <tbody>
                {filteredRows.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {/* แถวหลัก */}
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                      <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#00377E', borderRadius: '50%' }}></div>
                        <span>{item.name}</span>
                      </td>
                      <td style={{ padding: '10px', width: '120px' }}>
                        <span style={{
                          backgroundColor: item.status === 'ปลดระงับ' ? '#4CAF50' : '#FF5252',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '5px'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', width: '60px' }}>
                        <button
                          onClick={() => setOpenRowIndex(openRowIndex === idx ? null : idx)}
                          style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          {openRowIndex === idx ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>

                    {/* แถวรายละเอียด (เมื่อ dropdown ถูกเปิด) */}
                    {openRowIndex === idx && (
                      <tr>
                        <td style={{ padding: '10px', backgroundColor: '#f9f9f9', position: 'relative' }} colSpan="3">
                          {activeTab === 'checkDocs' ? (
                            // ------------------- รายละเอียด "ตรวจสอบเอกสารรถ" -------------------
                            <div style={{ display: 'flex', gap: '20px' }}>
                              {/* คอลัมน์ซ้าย: รูปภาพ + ข้อมูลพื้นฐานรถ */}
                              <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px' }}>{item.name}</h3>
                                <div style={{ marginBottom: '10px' }}>
                                  <img
                                    src={item.detail.carImage}
                                    alt="Car"
                                    style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                                  />
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ชื่อยี่ห้อรถ:</strong> {item.detail.carBrand}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ชื่อรุ่นรถ:</strong> {item.detail.carModel}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>จำนวนที่นั่ง:</strong> {item.detail.seats}
                                </div>
                              </div>
                              {/* คอลัมน์กลาง: ระบบต่าง ๆ */}
                              <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ระบบเกียร์:</strong> {item.detail.gear}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ระบบเชื้อเพลิง:</strong> {item.detail.fuel}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ระบบเครื่องยนต์:</strong> {item.detail.engine}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>จำนวนล้อ:</strong> {item.detail.wheels}
                                </div>
                              </div>
                              {/* คอลัมน์ขวา: รายการเอกสาร */}
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {item.detail.docs.map((doc, docIndex) => (
                                  <div key={docIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <label style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
                                      {doc.label}:
                                    </label>
                                    <button
                                      style={{ padding: '5px 10px', cursor: 'pointer' }}
                                      onClick={() => alert('ดาวน์โหลด ' + doc.label)}
                                    >
                                      ดาวน์โหลด
                                    </button>
                                    <ApprovalDropdown
                                      rowIndex={idx}
                                      docIndex={docIndex}
                                      currentValue={
                                        approvalDecisions[idx]
                                          ? approvalDecisions[idx][docIndex]
                                          : ''
                                      }
                                      onSelect={updateApprovalDecision}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            // ------------------- รายละเอียด "ตรวจสอบเอกสารบัญชี" -------------------
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px' }}>{item.name}</h3>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>ที่อยู่:</strong><br />
                                  จังหวัด: {item.detail.address.province}<br />
                                  อำเภอ: {item.detail.address.district}<br />
                                  ตำบล/แขวง: {item.detail.address.subDistrict}<br />
                                  รหัสไปรษณีย์: {item.detail.address.postalCode}<br />
                                  ถนน: {item.detail.address.road}<br />
                                  บ้านเลขที่: {item.detail.address.houseNo}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>เบอร์โทรศัพท์:</strong> {item.detail.phone}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <strong>อีเมล:</strong> {item.detail.email}
                                </div>
                              </div>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {item.detail.docs.map((doc, docIndex) => (
                                  <div key={docIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <label style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
                                      {doc.label}:
                                    </label>
                                    <button
                                      style={{ padding: '5px 10px', cursor: 'pointer' }}
                                      onClick={() => alert('ดาวน์โหลด ' + doc.label)}
                                    >
                                      ดาวน์โหลด
                                    </button>
                                    <ApprovalDropdown
                                      rowIndex={idx}
                                      docIndex={docIndex}
                                      currentValue={
                                        approvalDecisions[idx]
                                          ? approvalDecisions[idx][docIndex]
                                          : ''
                                      }
                                      onSelect={updateApprovalDecision}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* ปุ่มบันทึก/ปลดระงับ */}
                          <button
                            style={{
                              position: 'absolute',
                              bottom: '20px',
                              right: '20px',
                              backgroundColor: '#00377E',
                              border: '2px solid #000000',
                              color: '#fff',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSaveRow(idx)}
                          >
                            {rowsData[idx].status === 'ปลดระงับ' ? 'ปลดระงับ' : 'บันทึก'}
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========== Payment Modal ========== */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
        totalAmount="1620"
      />
    </div>
  );
};

export default ListPage;
