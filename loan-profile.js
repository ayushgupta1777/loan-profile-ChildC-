import React, { useEffect, useState, useRef } from 'react';

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/loans/loan-profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPencil, faCircleUser, faArrowLeft, faPen} from '@fortawesome/free-solid-svg-icons';
import { ThreeDot } from 'react-loading-indicators';
import Message from '../global/alert';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Loan_detail_loading from "../global/loading/loan_detail"

const LoanProfile = () => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [profile, setProfile] = useState(null);
  // const { compoundInterest = { enabled: false, frequency: null } } = loanDetails;
  const [showReceipt, setShowReceipt] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [amount1, setAmount1] = useState('');
  const [method, setMethod] = useState('Cash');
  const [topupinterestrate, settopupinterestrate] =useState('');
  const [amount2, setAmount2] = useState("");
  const [date, setDate] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bgColor, setBgColor] = useState("");

  const menuRef = useRef(null);


  const [progress, setProgress] = useState(60);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { customerID } = useParams();

    const [savedRemark, setSavedRemark] = useState("");
    const [note, setNote] = useState("");
    const [isEditing, setIsEditing] = useState(false);


      const [message, setMessage] = useState({ type: '', text: '' });

      const showMessage = (type, text) => {
          setMessage({ type, text });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        };
        
        useEffect(() => {
          const timer = setTimeout(() => {
            setMessage({ type: '', text: '' });
          }, 3000);
      
          // Clear the timeout when the component unmounts or when message changes
          return () => clearTimeout(timer);
        }, [message]);

        const handleCloseModal = (e) => {
          if (e.target.classList.contains("modal-overlay")) {
            setIsModalOpen(false);
          }
        };

        const handleCloseModal2 = (e) => {
          if (e.target.classList.contains("modal-overlay")) {
            setIsModalOpen2(false);
          }
        };
        
      useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const fetchLoanDetails = async () => {
      setBgColor(generateRandomColor());

      try {
        const token = localStorage.getItem('token');

        const { data } = await axios.get(`http://localhost:5000/api/loan-profile/${customerID}`,{
          headers: { 'x-auth-token': token }});
        setLoanDetails(data);
        setMessage({ type: 'success', text: 'Successful get Customer DATA' });

        setLoading(false);
      } catch (err) {
        setError('Error fetching loan details. Please try again.');
        setLoading(false);
        setMessage({ type: 'error', text: 'Unauthorized: You do not have access to this loan' });

      }
    };
    
    fetchLoanDetails();
  }, [customerID]);

  useEffect(() => {
    const fetchLoanDetails1 = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.get(`http://localhost:5000/api/loan-profile2/${customerID}`,{
          headers: { 'x-auth-token': token }});
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching loan details. 85678 Please try again.');
        setLoading(false);
        setMessage({ type: 'error', text: 'Unauthorized: You do not have access to this loan' });

      }
    };
    
    fetchLoanDetails1();
  }, [customerID]);


  const handleUpdateBillNumber = async () => {  
    const newBillNumber = prompt('Enter new bill number:'); // Simple input method  
    if (newBillNumber) {  
      try {  
        // Assuming there's an API endpoint to update the loan bill number  
        const response = await axios.put(`http://localhost:5000/api/billNo/${customerID}`, {  
          billNumber: newBillNumber // Include other necessary data based on your requirements  
        });  
        
        // Update the state with the new loan details  
        setLoanDetails(response.data);  
        alert('Bill number updated successfully!');  
      } catch (error) {  
        console.error('Error updating bill number:', error);  
        alert('Failed to update bill number. Please try again.');  
      }  
    }  
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:5000/api/loan-profile/${customerID}`,{
          headers: { 'x-auth-token': token }});
        setLoanDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching loan details.');
        setLoading(false);
      }
    };

    const updateInterest = async () => {
      try {
        await axios.put(`http://localhost:5000/api/update-interest/${customerID}`);
      } catch (err) {
        console.error('Error updating interest:', err);
      }
    };

    // Fetch initial details and update interest periodically
    fetchLoanDetails();
    const interval = setInterval(() => {
      updateInterest();
      fetchLoanDetails();
    }, 6000 ); // Update every second
  // }, 6000); // Update every second
// }, 600000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [customerID]);
  
    // Handle Top-Up
    const handleTopUp = async () => {
      const topUpAmount = prompt('Enter the top-up amount:'); // Ask user for the amount
      if (!topUpAmount || isNaN(topUpAmount) || topUpAmount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
  
      try {
        const { data } = await axios.put(`http://localhost:5000/api/top-up/${customerID}`, {
          topUpAmount: parseFloat(topUpAmount),
        });
  
        // Update state with new loan details
        setLoanDetails(data);
        alert('Top-up successful!');
      } catch (err) {
        console.error('Error during top-up:', err);
        alert('Failed to process the top-up. Please try again.');
      }
    };
  
 const handleTopUp1 = async () => {
    if (!amount1 || amount1 <= 0 || !date || !topupinterestrate) {
      setMessage('Enter a valid amount.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(`http://localhost:5000/api/loans/${customerID}/topup`, {
        amount: parseFloat(amount1),
        date,
        method,
        topupinterestrate,
      });

      setMessage(response.data.message);
      // onSuccess(); // Refresh parent data

      setAmount1('');
      setDate("");
      settopupinterestrate('');
      setIsModalOpen(false)
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing top-up');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayment = async () => {
    if (!amount2 || !date) {
      setError("Please enter amount and date.");
      return;
    }

    // setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/top-down/${customerID}`,
        {         amount: parseFloat(amount2), date, method}
      );
      alert("Repayment recorded successfully!");

      // Refresh loan details after repayment

      // fetchLoanDetails();

      setAmount2("");
      setDate("");
      setIsModalOpen2(false);
      settopupinterestrate('');
      // setError("");
    } catch (err) {
      console.error("Error processing repayment:", err);
      setError("Failed to process repayment. Try again.");
    }
    setLoading(false);
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreview(URL.createObjectURL(file)); // Show preview before upload
    uploadImage(file); // Upload image to Cloudinary
  }
};

const uploadImage = async (file) => {
  setLoading(true);
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(`http://localhost:5000/api/images/upload/${customerID}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setImage(response.data.imageUrl); // Store the uploaded image URL
    console.log(response)
  } catch (error) {
    console.error("Error uploading image", error);
  } finally {
    setLoading(false);
  }
};


 // Fetch existing note from database
 useEffect(() => {
  const fetchNote = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${customerID}/remark`);
      setNote(response.data.remark || "Write your note here...");
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  fetchNote();
}, [customerID]);

// Update note in the database
const handleSave = async () => {
  try {
    await axios.put(`http://localhost:5000/api/${customerID}/remark`, { remarks: note });
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating note:", error);
  }
};


const generateRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFBB33", "#8E44AD", "#2E86C1"];
  return colors[Math.floor(Math.random() * colors.length)];
};


  const handleAddSignature = () => {
    navigate(`/add-signature/${customerID}`);
  };
  const handlehome = () => {
    navigate(`/`);
  };

  const DetailPage = () => {
    navigate(`/top-t/${customerID}`);
  };


  // Format to Indian Number System
  const formatToIndianCurrency = (number) => {
    if (number === null || number === undefined) return '';
  
    const numStr = number.toString(); // Convert to string
  
    // Split into integer and decimal parts
    const [integerPart, decimalPart] = numStr.split('.');
  
    // Format integer part to Indian Number System
    const formattedInteger = integerPart.replace(
      /(\d)(?=(\d\d)+\d$)/g, // Regex for Indian Number System grouping
      '$1,'
    );
  
    // Combine integer and decimal parts
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };
  

// const [active, setActive] = useState(""); // State to track active menu item

// const handleItemClick = (item) => {
//   setActive(item);
// };

const handleClick = () => {
  setProgress(100); // Start filling the progress arc
  setTimeout(() => {
    navigate(`/DetailPage/${customerID}`); // Redirect after 3 seconds
  }, 1000);
};


if (loading) {
  return (
    <Loan_detail_loading/>

  if (error)  
  {
    return (
      <Loan_detail_loading/>
    )}
const handleReceipt = () => {
  navigate(`/Loc_AI/${customerID}`);
};
  const { loanType, amount,  interestRate, startDate, compoundInterest, interestFrequency, remarks, billNo, remainingPrincipal, topUpTotal } = loanDetails?.loanDetails || {};
  const { accruedInterest, totalAmount,topdownInterest  } = loanDetails?.loanDetails || {};
  const { updatedAt, profileImage } = loanDetails || {};

  const{ FirstName, LastName } = profile || {};

  // const topUpTotal = loanDetails?.loanDetails.topUpHistory?.reduce((sum, topUp) => sum + topUp.amount, 0) || 0;

  const totalLoanAmount = amount + topUpTotal;
  const topUpInterest = loanDetails?.loanDetails?.topUpInterest || 0;
  
  const totalInterest = accruedInterest + topUpInterest ;
  // const totalInterest = accruedInterest 
  const  P = topUpTotal + totalAmount           

  const topup = topUpInterest + topUpTotal;

  // const grandTotal = topup + totalAmount; 

  const grandTotal = P + totalInterest

  const data = [
    { title: "Total Income", value: "4.719,00", percentage: "16.1%", change: "vs previous month", className: "card" },
    { title: "Total Expenses", value: "3.270,00", percentage: "16.1%", change: "vs previous month", className: "card purple" },
    { title: "Net Profit", value: "629,00", percentage: "-8.8%", change: "vs previous month", className: "card" },
    { title: "Cash at end of month", value: "7.684,00", percentage: "4.9%", change: "vs previous month", className: "card" },
  ];
  const percentage = 10;
  const barPercentage = 8;
  return (
    <div Name="loan-profile">
      {/* Header Section */}
      <div className="header">
        <span onClick={() => handlehome()}><FontAwesomeIcon icon={faArrowLeft} size="lg" /></span>
        <div className="customer-info">
          {/* <span className='pic'><FontAwesomeIcon icon={faCircleUser} size="2xl" /></span> */}
         
          <div className="loan-profile-container-lp">
            <label htmlFor="fileInput" className="image-upload">
              {profileImage ? (
              <img src={profileImage} alt="Profile" width={150} height={150} style={{ borderRadius: "50%" }} className="loan-profile-image-lp"
              onContextMenu={(e) => e.preventDefault()} // Disable right-click
              draggable="false" 
              />
            ) : (
              <div className="profile-placeholder-lp" style={{ backgroundColor: bgColor }}>
              {FirstName ? FirstName.charAt(0).toUpperCase() : "?"}
            </div>
              )}
            </label>
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} hidden />
            {loading && <p>Uploading...</p>}
          </div>

          <h2>{FirstName}</h2>
        </div>
        <div className="customer-info" onClick={handleUpdateBillNumber}>
          <p>Bill #: {billNo}</p>
          <span  className="update-btn"><FontAwesomeIcon icon={faPencil} /></span>  
        </div>
          <button className="receipt-btn" onClick={handleReceipt}> Receipt </button>      
        
      </div>


<div className='jkl'>
      {/* <h1>Financial Dashboard</h1> */}
      
      <div className="container-lp">
        <div className="card">
          <h2>Total Loan</h2>
          <p className="value">₹ {Math.floor(totalLoanAmount || 0)}</p>
          <p className="percentage">16.1%</p>
          <p className="change">vs previous month</p>
        </div>
        <div className="card-purple">
          <h2>Total Interest</h2>
          <p className="value">₹ {formatToIndianCurrency(Math.floor(accruedInterest || 0))}</p>
          <p className="percentage">16.1%</p>
          <p className="change">vs previous month</p>
        </div>
        <div className="card">
          <h2>Net Top-up</h2>
          <p className="value">₹ {topUpTotal}</p>
          <p className="percentage">-8.8%</p>
          <p className="change">vs previous month</p>
        </div>
        <div className="card">
          <h2>Total Amount</h2>
          <p className="value">₹ {formatToIndianCurrency(Math.floor(totalAmount))}</p>
          <p className="percentage">{new Date(updatedAt).toLocaleDateString('en-GB')}</p>
          <p className="change">last updated</p>
        </div>
      </div>


      <button className="read-more-btn-lp"onClick={DetailPage}>
      <span className="text" >READ MORE</span>
      <span className="icon">
        <svg 
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="circular-animation"></div>
    </button>

  </div>

  {/* inerest circular  */}

  <div className="progress-container">
  <div className="centered-container">
      <div className="unique-circular-container" onClick={handleClick}>
        <svg className="unique-circular-svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <circle className="unique-circle-bg" cx="50" cy="50" r="45" />
          <circle
            className="unique-circle-progress"
            cx="50"
            cy="50"
            r="45"
            style={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
          />
        </svg>
        <span className="unique-button-text">Read More</span>
      </div>
    </div>

      <div className="progress-bar-container">
        <div className="progress-label">{interestRate}%</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${interestRate}%` }}
          ></div>
        </div>
        <div className="progress-label">Interest Rate</div>
      </div>
    </div>
     <div className="note-container">
                {isEditing ? (
                  <textarea
                    className="note-input"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onBlur={handleSave} // Save on blur
                    onKeyDown={(e) => e.key === "Enter" && handleSave()} // Save on Enter key
                    autoFocus
                  />
                ) : (
                  <div className="note-display">
                    <p>{note}</p>
                    <FontAwesomeIcon icon={faPen} className="edit-icon" onClick={() => setIsEditing(true)} />
                  </div>
                )}
              </div>
      


    {/* footer */}

    <footer className="footer">
      <div className="footer-container">


        {/* Center Section - Logo & Navigation */}
        <div className="footer-center">
          <h2 className="footer-logo">
            <span className="footer-icon">📌</span> KhataTroops
          </h2>
          <ul className="footer-nav">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Service</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>

          {/* Social Icons */}
          <div className="footer-social">
            <span className="social-icon" onClick={() => navigate(`/add-signature/${customerID}`)} >ADD SIGNATURE</span>
            <span className="social-icon" onClick={() => navigate(`/top-t/${customerID}`)}>TOP</span>
            <span className="social-icon">Ig</span>
            <span className="social-icon">Tw</span>
          </div>
        </div>
      </div>
      {/* Horizontal Line & Copyright */}
      <div className="footer-divider"></div>
      <p className="footer-copyright">Copyright Ayush Studio</p>
      
    </footer>


    <div className="dropdown-container" ref={menuRef}>
      {/* Dropdown Button */}
      <button className={`dropdown-btn ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        Options <span className={`arrow ${isOpen ? "rotate" : ""}`}>▼</span>
      </button>

      {/* Dropdown Menu with Scale Animation */}
      <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <div className="dropdown-item" onClick={() => setIsModalOpen(true)}>
          <span className="icon">⬆️</span> TOP-UP
        </div>
        <div className="dropdown-item" onClick={() => setIsModalOpen2(true)}>
          <span className="icon">💵</span> TOP-DOWN
        </div>
      </div>
    </div>


      {isModalOpen && (
      <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="topup-container">
        <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
    

        <h2 className="topup-title">Top-Up Loan</h2>

        <div className="topup-box">
          <label className="topup-label">Offer Your Amount</label>
          <input
            type="number"
            value={amount1}
            onChange={(e) => setAmount1(Math.max(0, e.target.value))}

            className="topup-input"
            placeholder="₹ 150"
            min="0"

          />
          <input
            type="number"
            value={topupinterestrate}
            onChange={(e) => settopupinterestrate(Math.max(0, e.target.value))}
            className="topup-input"
            placeholder="5%"
            min="0"
          />
          <button onClick={handleTopUp1} className="topup-button" disabled={loading}>
            {loading ? "Processing..." : "Apply"}
          </button>

                  <div className="input-group">
          <label className="topup-label">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        </div>

        <label className="topup-label">Payment Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="topup-select">
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
        </select>
          </div>
        </div>
      )}


    {isModalOpen2 && (
      <div className="modal-overlay" onClick={handleCloseModal2}>
      <div className="topup-container">
        <button className="close-button" onClick={() => setIsModalOpen2(false)}>✖</button>
    

        <h2 className="topup-title">Top-DOWN Loan</h2>

        <div className="topup-box">
          <label className="topup-label">Payment Amount</label>
          <input
            type="number"
            value={amount2}
            onChange={(e) => setAmount2(Math.max(0, e.target.value))}
            className="topup-input"
            placeholder="₹ 150"
            min="0"
          />
          <button onClick={handleRepayment} className="topup-button" disabled={loading}>
            {loading ? "Processing..." : "Apply"}
          </button>

                  <div className="input-group">
          <label className="topup-label">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        </div>



        <label className="topup-label">Payment Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="topup-select">
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
        </select>
          </div>
        </div>
      )}

      {/* </div> */}
      <Message type={message.type} text={message.text} />

    </div>
  );
};

export default LoanProfile;


.loan-profile {
    max-width: 800px;
    margin: 20px auto;
    background: #f9f9f9;
        border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  
  /* Header Section */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border-bottom: 1px solid #e0e0e0; */
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .header {
    /* background: #9e65ff; */
    background: rgba(255, 255, 255, 0.2); 
    backdrop-filter: blur(12px); /* Foggy Blur */
    color: #fff;
    /* color: #555; */

    /* border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px; */
    border-bottom-right-radius: 20px;
    /* border-top-left-radius: 30px; */
    padding: 15px;
    text-align: center;
    /* margin-bottom: -27px; */
    margin-bottom: -90px;


    display: flex;
    position:relative;
    box-shadow: none;
  }

  .customer-info p{
    color: #28a745;
  }

  span .update-btn{
    cursor: pointer;
  }
  
  /* .header button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  } */
  
  .header button.receipt-btn:hover {
    background-color: #0056b3;
  }
  
  .customer-info {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }
  
  .customer-info span.pic{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #007bff;
  }
  
  .customer-info h2 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }
  
  .customer-info p {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    }
  
  .receipt-btn {
    background-color: #28a745;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .receipt-btn:hover {
    background-color: #218838;
  }

  .loan-profile-container-lp {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 15px;
  }
  
  .loan-profile-image-lp {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    pointer-events: none; /* Prevent interaction like copying the link */
    user-select: none; /* Prevent text/image selection */
  }

  .profile-placeholder-lp {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px; /* Adjusted for better fit */
    font-weight: bold;
    color: white;
    text-transform: uppercase;
    user-select: none; /* Prevent text selection */
    pointer-events: none; /* Prevent interaction */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Smooth shadow for depth */
  }

/* new ui */

.jkl {
  background: linear-gradient(to right, #4f46e5, #9333ea);
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
  height: 120vh;
  margin: 0;
}

.dashboard {
  text-align: center;
  color: white;
  margin-bottom: 20px;
  }
  
  .container-lp {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  width: 100%;
  padding: 0 20px;
  
 
  }
  
  @media (max-width: 768px) {
  .container-lp {
  grid-template-columns: repeat(2, 1fr);
  }
  .container-lp {
   margin-top: 0;
   
    }
    .jkl {
      display: flex;
      justify-content: center;
      align-items: flex-start; /* Change from center */
      height: 100vh;
    padding-top: 160px;   /*Add padding instead of margin */
  }
  
  }

  @media (max-width: 768px) {
    .read-more-btn {
        bottom: -10px !important; /* Force override */
    }
}


  @media (min-width: 768px) {
    .jkl {
      min-height: 100vh;
      padding: 20px;
  }
  
    .container-lp {
      margin-top: 50px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      max-width: 1200px;
      width: 100%;
      padding: 0 20px;
  }

  .card, .card-purple {
    width: 100%;
    max-width: 400px; /* Set a max width so it doesn’t stretch too much */
    height: auto; /* Let the content define the height */
    aspect-ratio: 1/1;
}
.card h2, .card-purple h2 {
  font-size: clamp(18px, 2vw, 22px);
}


  }
  
  .card {
    width: 100%;
    /* height: 190px; */
    height: 90%;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background: white;
    text-align: left;
    overflow: hidden;
    margin: 0 auto;
    }
  

  
    .card h2 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #444;
      }
  
      .card p.value {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #222;
        }
  
        .card p.percentage, .card p.change {
          font-size: 15px;
          opacity: 0.9;
          margin: 3px 0;
          color: #555;
          }

  .card-purple {
    width: 100%;
    height: 90%;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-align: left;
    overflow: hidden;
    margin: 0 auto;


    background: linear-gradient(to bottom, #d1b8ff, #a370f7);
    /* bit darker 
    background: linear-gradient(to bottom, #b084f7, #8333e5); */
    

    color: white;
    }

    .card-purple h2 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
      /* color: #444; */
      }
  
      .card-purple p.value {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
        /* color: #222; */
        }
  
        .card-purple p.percentage, .card-purple p.change {
          font-size: 15px;
          opacity: 0.9;
          margin: 3px 0;
          /* color: #555; */
          }

        /* show more   button  */

        .read-more-btn-lp {
          position: absolute;
           bottom: -50px; 
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          border: none;
          border-radius: 50px;
          background: linear-gradient(to right, #c800ff, #5a00e5);
          cursor: pointer;
          overflow: hidden;
          transition: 0.3s;
        }
        
        .read-more-btn-lp:hover {
          transform: translateX(-50%) scale(1.05);
        }
        
        .read-more-btn-lp .text {
          margin-right: 10px;
        }
        
        .read-more-btn-lp .icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .circular-animation {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: white;
          animation: rotate 1s linear infinite;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        @keyframes rotate {
          0% {
            transform: translateY(-50%) rotate(0deg);
          }
          100% {
            transform: translateY(-50%) rotate(360deg);
          }
        }
        


.progress-container {
display: flex;
flex-direction: column;
align-items: center;
background: white;
padding: 20px;
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.circular-progress {
width: 120px;
height: 120px;
position: relative;
}

.circular-progress svg {
transform: rotate(-90deg);
}

.circular-progress circle {
fill: none;
stroke-width: 10;
stroke-linecap: round;
}

.circular-progress .bg-circle {
stroke: #e0e0e0;
}

.circular-progress .progress-circle {
stroke: url(#gradient);
stroke-dasharray: 314;
stroke-dashoffset: calc(314 - (314 * 75) / 100);
}

.progress-text {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 20px;
font-weight: bold;
color: #444;
}

/* Horizontal Progress Bar */
.progress-bar-container {
width: 100%;
margin-top: 20px;
}

.progress-bar {
width: 100%;
height: 8px;
background: #e0e0e0;
border-radius: 5px;
overflow: hidden;
}

.progress-fill {
width: 32%;
height: 100%;
background: #fbbf24;
}

.progress-label {
font-size: 14px;
font-weight: bold;
color: #fbbf24;
text-align: left;
margin-top: 5px;
}

/* ---------------------------------------circular button  Outer Container --------------------------------------------- */

/* Fullscreen Centering */
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Outer Circular Button */
.unique-circular-container {
  position: relative;
  width: 120px; /* Adjusted for better balance */
  height: 120px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG Styling */
.unique-circular-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Ensures the arc starts from the top */
}

/* Background Circle */
.unique-circle-bg {
  fill: none;
  stroke: #ddd;
  stroke-width: 8;
}

/* Progress Circle */
.unique-circle-progress {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 141; /* 50% Filled initially */
  transition: stroke-dashoffset 1s linear;
}

/* Button Text */
.unique-button-text {
  position: absolute;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  user-select: none;
}
.footer {
  background: #f9f9f9;
  padding: 40px 0 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Inner Container */
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1100px;
}

/* Left Section */
.footer-left {
  text-align: left;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  max-width: 150px; /* Keeps text in short lines */
}

/* Center Section */
.footer-center {
  text-align: center;
  flex-grow: 1;
}

/* Logo */
.footer-logo {
  font-size: 18px;
  font-weight: bold;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-icon {
  margin-right: 5px;
}

/* Navigation */
.footer-nav {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
}

.footer-nav li a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

/* Social Icons */
.footer-social {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.social-icon {
  background: #2563eb;
  color: white;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
}

/* Divider Line */
.footer-divider {
  width: 80%;
  height: 1px;
  background: #b0c4de;
  margin: 20px 0;
}

/* Copyright Text */
.footer-copyright {
  font-size: 12px;
  color: #777;
  margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {

  .footer {
    background: #f9f9f9;
    padding: 40px 0 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Inner Container */
  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 1100px;
  }
  /* .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  } */

  .footer-left {
    text-align: left;
    max-width: 200px;
    /* margin-bottom: 20px; */
  }
  .footer-center {
    margin-top: 50px;
    text-align: center;
    flex-grow: 1;
  }
}
/* dropdown-container */

.dropdown-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* Dropdown Button */
.dropdown-btn {
  background: #7b40f5;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
  transition: transform 0.2s ease-in-out;
}

/* Rotate Dropdown Arrow */
.arrow {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.arrow.rotate {
  transform: rotate(180deg);
}

/* Button Active Effect (Slightly Bigger on Click) */
.dropdown-btn.active {
  transform: scale(1.05);
}

/* Dropdown Menu (Initially Hidden) */
.dropdown-menu {
  position: absolute;
  bottom: 50px;
  right: -145px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 180px;
  transform: scale(0.9);
  opacity: 0;
  visibility: hidden;
  transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s;
}

/* Show Menu with Scale Animation */
.dropdown-menu.show {
  transform: scale(1) translateX(-80%);
  opacity: 1;
  visibility: visible;
}

/* Dropdown Item */
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #6b4ef9;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f0e6ff;
}

/* Delete Button Special Styling */
.dropdown-item.delete {
  color: #ff4b4b;
}

/* Icon Styling */
.icon {
  margin-right: 8px;
  font-size: 16px;
}

  .summary {
    margin: 20px auto;
    background: #fff;
    border-radius: 7px;
    border: 1px solid #e0e0e0;
    padding: 15px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .row-s {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }
  .row-sd {
    display: flex;
    flex-direction:row;
    
    /* align-items: center; */
    margin-bottom: 15px;
  }
  .row-s span {
    flex: 1;
    font-size: 14px;
    align-self: flex-start;

  }
  .col span.number {
    flex: 1;
    font-size: 40px;
    align-self: flex-start;

  }
  .row-s span.number {
    flex: 1;
    font-size: 40px;
    align-self: flex-start;

  }
  
  button.btn {
    background-color: #ffc107;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-end;
  }
  
  button.receipt-btn:hover {
    background-color: #e0a800;

  }
  
  .edit-btn {
    margin-left: auto;
  }
  
  .delete-btn {
    background-color: #ff5252;
    margin-left: auto;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-end;
  }
  
  .delete-btn:hover {
    background-color: #e53935;
  }
  
  .show-details-btn {
    width: 50%;
    margin-top: 15px;
    padding: 10px 0;
    font-size: 16px;
    transform: translate(50%, 90%);
    background-color: #ffc107;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-end;
  }
  
  /* Interest Section */
  .interest {
    /* margin-top: 40px; */
    margin:  40px 20px;
  }
  .interest span{
    color: #6c6f84;
    font-size: 1rem;
    font-weight: 500;
    margin: 0 10px;
  }
  
  .interest .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background: #f1f8e9;
    border-radius: 4px;
    border: 1px solid #c8e6c9;
  }

  @media only screen and (max-width: 768px) {
    .row-sd {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .col {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 5px 0;
    }

    .row-sd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      padding: 12px;
      background-color: #f9f9ff;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin: 12px 0;
    }
    
    .col {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    
    span.number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1d3557;
      background: #e8f0ff;
      padding: 5px 10px;
      border-radius: 8px;
      display: inline-block;
      margin-top: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    span.number::before {
      content: "₹ ";
      font-size: 1rem;
      color: #457b9d;
      font-weight: normal;
    }

    .last-update {
      background-color: #1d3557; 
      color: white;
      text-align: center;
      padding: 3px 6px;
      border-radius: 2px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      max-width: fit-content;
    }
    
    .last-update span {
      display: inline-block;
      padding: 5px;
    }
  }

  /* signature  */
  .sigCanvas {
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: crosshair;
  }

  /* Menu Bar Container */
.actions {
  background: #1a1b26; /* Dark background */
  border-radius: 1px;
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  width: fit-content;
  /* margin: 20px auto; */
}

.actions .actiion-group{
  display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.actiion-group2{
  display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 40px auto;
    /* justify-content: center;
}

.actiion-group3{
  display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center; 
}
.actiion-group3 button{
  padding: 7px;
  border-radius: 5px;
}

/* Individual Menu Items */
.menu-item {
  display:flex;
  flex-direction: column; /* Text in column layout */
   align-items: center; /* Center align the text and icon */
  
  color: #6c6f84;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 10px;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

/* Active State */
.menu-item.active {
  color: #9ffce7; /* Highlighted color */
  font-weight: bold;
}

/* Hover Effect */
.menu-item:hover {
  color: #9ffce7; /* Change color on hover */
}

/* Underline Effect */
.menu-item.active::before {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #9ffce7;
  border-radius: 2px;
  animation: underline4 0.3s ease-in-out;
}

/* Smooth Transition for Underline */
@keyframes underline4 {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Close (X) Button */
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end; /* Align modal at bottom */
  justify-content: center;
}

/* Modal Container */
.topup-container {
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 70vh; /* Fixed height */
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Close Button */
.topup-container button.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

/* Modal Title */
.topup-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

/* Input Fields */
.topup-input, .topup-select, .input-group input {
  width: 80%;
  font-size: 18px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
}

/* Apply Button */
.topup-box button.topup-button {
  background: #7ed957;
  color: white;
  font-size: 20px;
  width: 80%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.topup-button:hover {
  background: #6bc44d;
}

.topup-button:disabled {
  background: gray;
  cursor: not-allowed;
}

/* Labels */
.topup-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: center;
}

/* Input Group */
.input-group {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
}



