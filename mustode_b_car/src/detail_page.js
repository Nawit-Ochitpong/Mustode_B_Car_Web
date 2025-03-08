// detail_page.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './App.css';

const DetailPage = () => {
  const { tabType, docId } = useParams(); 
  const navigate = useNavigate();

  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const docRef = doc(db, tabType, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocData(docSnap.data());
        } else {
          console.log("No such document!");
          // fallback sample data
          if (tabType === 'accountDocs') {
            setDocData({
              name: "ตัวอย่างข้อมูลบัญชี",
              status: "ไม่พบข้อมูล",
              address: "N/A",
              phone: "N/A",
              email: "N/A",
              docLease: "N/A",
              docRegis: "N/A",
              docLicense: "N/A",
            });
          } else if (tabType === 'checkDocs') {
            setDocData({
              name: "Toyota Vios",
              carModel: "1.5 G",
              year: "2020",
              gearType: "อัตโนมัติ",
              status: "ไม่พบข้อมูล",
              docCarReg: "N/A",
              docInsurance: "N/A",
              docLicense: "N/A",
              imageUrl: "",
            });
          } else if (tabType === 'transactions') {
            setDocData({
              name: "Toyota Vios 9000 x 2 วัน",
              status: "ไม่พบข้อมูล",
              startDate: "xx/xx/xxxx",
              endDate: "xx/xx/xxxx",
              price: 9000,
              dayCount: 2,
              deposit: 0,
              total: 18000,
              serviceFee: 10, // สมมติเป็น %
              note: "N/A",
            });
          } else {
            setDocData({ name: "No Data", status: "No Data" });
          }
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        // fallback ข้อมูลกรณีเกิดข้อผิดพลาด
        if (tabType === 'accountDocs') {
          setDocData({
            name: "Error",
            status: "Error",
            address: "N/A",
            phone: "N/A",
            email: "N/A",
            docLease: "N/A",
            docRegis: "N/A",
            docLicense: "N/A",
          });
        } else if (tabType === 'checkDocs') {
          setDocData({
            name: "Error",
            carModel: "",
            year: "",
            gearType: "",
            status: "Error",
            docCarReg: "N/A",
            docInsurance: "N/A",
            docLicense: "N/A",
            imageUrl: "",
          });
        } else if (tabType === 'transactions') {
          setDocData({
            name: "Error",
            status: "Error",
            startDate: "",
            endDate: "",
            price: 0,
            dayCount: 0,
            deposit: 0,
            total: 0,
            serviceFee: 10,
            note: "N/A",
          });
        } else {
          setDocData({ name: "Error", status: "Error" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [tabType, docId]);

  if (loading) {
    return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;
  }

  // เลือก Render ตาม tabType
  if (tabType === 'accountDocs') {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', background: '#f4f4f4' }}>
        <Header navigate={navigate} />
        <div style={{ padding: '20px' }}>
          <AccountDocsDetail docId={docId} tabType={tabType} data={docData} />
        </div>
      </div>
    );
  } else if (tabType === 'checkDocs') {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', background: '#f4f4f4' }}>
        <Header navigate={navigate} />
        <div style={{ padding: '20px' }}>
          <CheckDocsDetail docId={docId} tabType={tabType} data={docData} />
        </div>
      </div>
    );
  } else if (tabType === 'transactions') {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', background: '#f4f4f4' }}>
        <Header navigate={navigate} />
        <div style={{ padding: '20px' }}>
          <TransactionDetail docId={docId} tabType={tabType} data={docData} />
        </div>
      </div>
    );
  } else {
    // กรณีเป็นแท็บอื่น
    return (
      <div style={{ padding: '20px' }}>
        <h3>ยังไม่ได้ออกแบบสำหรับ tabType: {tabType}</h3>
        <button onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>
    );
  }
};

// -------------------
// Header component เล็กๆ
// -------------------
const Header = ({ navigate }) => {
  return (
    <div style={{ backgroundColor: '#00377E', color: 'white', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
      <span
        style={{ cursor: 'pointer', marginRight: '10px' }}
        onClick={() => navigate(-1)}
      >
        ◀
      </span>
      <h2 style={{ margin: 0 }}>รายละเอียด</h2>
    </div>
  );
};

// -------------------
// 1) Layout สำหรับ accountDocs
// -------------------
const AccountDocsDetail = ({ docId, tabType, data }) => {
  // state สำหรับ popup
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isSuspended = data.status === 'ระงับ'; 
  const suspendButtonText = isSuspended ? 'ปลดระงับ' : 'ระงับ';

  const handleSuspendToggle = async () => {
    try {
      const newStatus = isSuspended ? 'ปลดระงับ' : 'ระงับ';
      await updateDoc(doc(db, tabType, docId), { status: newStatus });
      alert(`อัปเดตสถานะเป็น "${newStatus}" แล้ว`);
      data.status = newStatus; 
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  // กดปุ่มบันทึก => เปิด Popup
  const handleSave = () => {
    setShowConfirmModal(true);
  };

  // ปุ่มใน Popup
  const handleCancel = () => {
    setShowConfirmModal(false);
  };
  const handleConfirm = () => {
    alert("บันทึกสำเร็จ!");
    setShowConfirmModal(false);
  };

  return (
    <div style={containerStyle}>
      {/* ปุ่ม “ระงับ/ปลดระงับ” */}
      <button
        onClick={handleSuspendToggle}
        style={{
          ...suspendButtonStyle,
          backgroundColor: isSuspended ? 'green' : 'red',
        }}
      >
        {suspendButtonText}
      </button>

      {/* 2 คอลัมน์ */}
      <div style={columnContainerStyle}>
        {/* ซ้าย */}
        <div style={leftColumnStyle}>
          <InputField label="ชื่อ" value={data.name} />
          <InputField label="ที่อยู่" value={data.address} />
          <InputField label="เบอร์โทรศัพท์" value={data.phone} />
          <InputField label="อีเมล" value={data.email} />
        </div>

        {/* ขวา */}
        <div style={rightColumnStyle}>
          <InputField label="สัญญาเช่าซื้อ" value={data.docLease} />
          <InputField label="รูปใบประกอบ" value={data.docRegis} />
          <InputField label="รูปใบขับขี่" value={data.docLicense} />
        </div>
      </div>

      {/* ปุ่มบันทึก */}
      <div style={saveButtonContainerStyle}>
        <button onClick={handleSave} style={saveButtonStyle}>
          บันทึก
        </button>
      </div>

      {/* Popup ยืนยันบันทึก */}
      {showConfirmModal && (
        <ConfirmationModal
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

// -------------------
// 2) Layout สำหรับ checkDocs (รถ)
// -------------------
const CheckDocsDetail = ({ docId, tabType, data }) => {
  // state สำหรับ popup
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isSuspended = data.status === 'ระงับ'; 
  const suspendButtonText = isSuspended ? 'ปลดระงับ' : 'ระงับ';

  const handleSuspendToggle = async () => {
    try {
      const newStatus = isSuspended ? 'ปลดระงับ' : 'ระงับ';
      await updateDoc(doc(db, tabType, docId), { status: newStatus });
      alert(`อัปเดตสถานะเป็น "${newStatus}" แล้ว`);
      data.status = newStatus; 
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  // กดปุ่มบันทึก => เปิด Popup
  const handleSave = () => {
    setShowConfirmModal(true);
  };

  // ปุ่มใน Popup
  const handleCancel = () => {
    setShowConfirmModal(false);
  };
  const handleConfirm = () => {
    alert("บันทึกสำเร็จ!");
    setShowConfirmModal(false);
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleSuspendToggle}
        style={{
          ...suspendButtonStyle,
          backgroundColor: isSuspended ? 'green' : 'red',
        }}
      >
        {suspendButtonText}
      </button>

      <div style={columnContainerStyle}>
        {/* ซ้าย */}
        <div style={leftColumnStyle}>
          {/* รูปภาพรถ */}
          <label style={labelStyle}>รูปภาพ</label>
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="Car"
              style={{
                width: '200px',
                height: 'auto',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '15px'
              }}
            />
          ) : (
            <input
              type="text"
              value="(ไม่มีรูป)"
              readOnly
              style={inputStyle}
            />
          )}

          <InputField label="ชื่อรถ" value={data.name} />
          <InputField label="รุ่น" value={data.carModel} />
          <InputField label="ปี" value={data.year} />
          <InputField label="ระบบเกียร์" value={data.gearType} />
        </div>

        {/* ขวา */}
        <div style={rightColumnStyle}>
          <InputField label="เลขทะเบียน / เอกสารรถ" value={data.docCarReg} />
          <InputField label="พ.ร.บ. / ประกัน" value={data.docInsurance} />
          <InputField label="รูปใบขับขี่" value={data.docLicense} />
        </div>
      </div>

      <div style={saveButtonContainerStyle}>
        <button onClick={handleSave} style={saveButtonStyle}>
          บันทึก
        </button>
      </div>

      {/* Popup ยืนยันบันทึก */}
      {showConfirmModal && (
        <ConfirmationModal
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

// -------------------
// 3) Layout สำหรับ transactions
// -------------------
const TransactionDetail = ({ docId, tabType, data }) => {
  const isSuspended = data.status === 'ระงับ'; 
  const suspendButtonText = isSuspended ? 'ปลดระงับ' : 'ระงับ';

  const handleSuspendToggle = async () => {
    try {
      const newStatus = isSuspended ? 'ปลดระงับ' : 'ระงับ';
      await updateDoc(doc(db, tabType, docId), { status: newStatus });
      alert(`อัปเดตสถานะเป็น "${newStatus}" แล้ว`);
      data.status = newStatus; 
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const handleSave = () => {
    alert("กดปุ่มบันทึกแล้ว! (เขียน logic เพิ่มได้)");
  };

  // สมมติคำนวณค่าเช่าทั้งหมด
  const pricePerDay = data.price || 0;
  const days = data.dayCount || 1;
  const deposit = data.deposit || 0;
  const serviceFeePercent = data.serviceFee || 10; 
  const totalRent = pricePerDay * days; 
  const serviceFeeValue = (totalRent * serviceFeePercent) / 100;
  const grandTotal = totalRent + serviceFeeValue - deposit;

  return (
    <div style={containerStyle}>
      <button
        onClick={handleSuspendToggle}
        style={{
          ...suspendButtonStyle,
          backgroundColor: isSuspended ? 'green' : 'red',
        }}
      >
        {suspendButtonText}
      </button>

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>{data.name || 'ไม่มีชื่อ'}</h3>
            <p style={{ margin: 0 }}>วันที่: {data.startDate} - {data.endDate}</p>
          </div>
          <button
            style={{
              backgroundColor: isSuspended ? 'green' : 'red',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              visibility: 'hidden', 
            }}
          >
            ระงับ
          </button>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>ค่ารายวัน:</strong> {pricePerDay.toLocaleString()} x {days} วัน
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>ค่าบริการ:</strong> {serviceFeePercent}% = {serviceFeeValue.toLocaleString()}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>มัดจำ:</strong> {deposit.toLocaleString()}
          </p>
          <hr />
          <h2 style={{ margin: '5px 0', color: '#ff0000' }}>
            รวมทั้งหมด: {grandTotal.toLocaleString()}
          </h2>
        </div>
      </div>

      <div style={saveButtonContainerStyle}>
        <button onClick={handleSave} style={saveButtonStyle}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

/** Popup ยืนยันการบันทึก */
const ConfirmationModal = ({ onCancel, onConfirm }) => {
  return (
    <>
      <div style={overlayStyle} />
      <div style={modalStyle}>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>ยืนยันผลบันทึกและตรวจสอบ</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: '#fff',
              color: '#00377E',
              border: '1px solid #00377E',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#00377E',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            บันทึก
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailPage;

//
// ส่วนสไตล์/โค้ดซ้ำๆ ทำให้กระชับ
//
const containerStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  position: 'relative',
  minHeight: '70vh',
};

const suspendButtonStyle = {
  position: 'absolute',
  right: '20px',
  top: '20px',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
};

const columnContainerStyle = {
  display: 'flex',
  gap: '30px',
  marginTop: '20px',
};

const leftColumnStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const rightColumnStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginBottom: '15px',
};

const saveButtonContainerStyle = {
  textAlign: 'right',
  marginTop: '40px',
};

const saveButtonStyle = {
  backgroundColor: '#00377E',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 999,
};

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  width: '300px',
  padding: '20px',
  borderRadius: '10px',
  zIndex: 1000,
  textAlign: 'center',
};

//
// helper component สำหรับช่อง input readOnly
//
const InputField = ({ label, value }) => {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        value={value || ''}
        readOnly
        style={inputStyle}
      />
    </div>
  );
};
