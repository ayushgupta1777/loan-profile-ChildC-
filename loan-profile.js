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

//   const calculateDailyInterest = (amount, interestRate) => {
//     const dailyRate = (interestRate / 100) / 30; // Assuming 30 days in a month
//     return dailyRate * amount; // Daily interest for the amount
//   };
  
//   const calculateAccruedInterest = (amount, interestRate, startDate) => {
//     const today = new Date();
//     const start = new Date(startDate);
//     const elapsedDays = Math.floor((today - start) / (1000 * 60 * 60 * 24)); // Convert ms to days
//     const dailyInterest = calculateDailyInterest(amount, interestRate);
//     return dailyInterest * elapsedDays; // Total accrued interest
//   };
  
//   // Calculate accrued interest dynamically
//   let accruedInterest = 0;
//   let totalAmount = 0;
  
//   if (loanDetails) {
//     const { amount, interestRate, startDate } = loanDetails.loanDetails;
//     accruedInterest = calculateAccruedInterest(amount, interestRate, startDate);
//     totalAmount = amount + accruedInterest; // Total amount = principal + accrued interest
//   } 

//   let totalLeft = 0;

// if (loanDetails) {
//   const { amount, interestRate, startDate } = loanDetails.loanDetails;
//   accruedInterest = calculateAccruedInterest(amount, interestRate, startDate);
//   totalAmount = amount + accruedInterest;
//   totalLeft = totalAmount - amount; // Calculate the remaining amount (if applicable)
// }


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

  )}

// <div 
// className="container" 
// style={{
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh", // Full height of the viewport (optional)
//   width: "100%", // Full width of the container
//   background: "transparent", // Explicitly set transparent background

// }}
// >
// <ThreeDot color="#3168cc" size="medium" text="" textColor="" />
// </div>;

  if (error)  
  {
    return (
      <Loan_detail_loading/>
  
    )}
  
  
  // <div 
  // className="container" 
  // style={{
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: "100vh", // Full height of the viewport (optional)
  //   width: "100%", // Full width of the container
  //   background: "transparent", // Explicitly set transparent background
  
  // }}
  // >
  // <ThreeDot color="#3168cc" size="medium" text="Error" textColor="" />
  // </div>;


// const handleReceipt = () => {
//   navigate(`/receipt/${customerID}`, { state: { profile, loanDetails } });
// };

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

    {/* <div className="centered-container">
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
    </div> */}

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
        
        {/* Left Side - Adjusted Content */}
        {/* <div className="footer-left">
          <p>Creative solutions</p>
          <p>for growth.</p>
          <p>Innovative designs</p>
          <p>every day.</p>
          <p>We build brands</p>
          <p>with care.</p>
        </div> */}

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
        {/* <div className="dropdown-item">
          <span className="icon">📦</span> Archive
        </div>
        <div className="dropdown-item">
          <span className="icon">🔗</span> Move
        </div>
        <div className="dropdown-item delete">
          <span className="icon">🗑️</span> Delete
        </div> */}
      </div>
    </div>


      {/* Summary Section */}
      {/* <div className="summary">
      <div className="row-s">  
      <span>Start Date: {new Date(startDate).toLocaleDateString('en-GB')}</span>
      <button className="btn">Edit</button>
        </div>  
        <div className="row-s total-lent">  
          <span>Total Lent: </span>
          <span className='number'>₹ {formatToIndianCurrency(totalLoanAmount)}</span>
          <button class="delete-btn">Delete</button>  
        </div>  
        <div className="row-s">  
          <span>Total Left: </span>
        </div>  
        <div className="row-sd interest-total">

          <div className='col'>
          <span>Interest: </span>  
          <span className='number'>{formatToIndianCurrency(Math.floor(totalInterest || 0))}</span>  
          </div>

          <div className='col'>
          <span>Total Amount:  </span>
          <span className='number'>{formatToIndianCurrency(Math.floor(grandTotal))}</span> 
           </div>
        </div> 


        <div className="last-update">
          <span>Last Updated: {new Date(updatedAt).toLocaleDateString('en-GB')}</span>
        </div>

        
        <button class="show-details-btn" onClick={DetailPage}>Show Details</button>
        </div> */}
  
      {/* <div className="interest">
        <div className="row">
          <span>Interest Rate: {interestRate}%</span>
          <span>{interestFrequency} Calculation</span>
        </div>
        {compoundInterest?.enabled && (
          <div className="row">
            <span>Compound Frequency: {compoundInterest.frequency || 'None'}</span>
          </div>
        )}
      </div> */}
  
      {/* <div className="actions"> */}

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
