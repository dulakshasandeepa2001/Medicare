import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState(''); //methanin wenne useState hook ekak use krla username state eka create krnna,username state ekak kiynne userge input eka store krnna
  const [password, setPassword] = useState(''); //methanin wenne useState hook ekak use krla password state eka create krnna,password state ekak kiynne userge input eka store krnna
  const [error, setError] = useState(''); //methanin wenne useState hook ekak use krla error state eka create krnna,methanadi error state ekak kiynne login process eke awulak unama display krnna
  const [loading, setLoading] = useState(false); //methanin wenne useState hook ekak use krla loading state eka create krnna
  const [rememberMe, setRememberMe] = useState(false); //methanin wenne useState hook ekak use krla rememberMe state eka create krnna
  const navigate = useNavigate();//methanin wenne useNavigate hook ekak use krla navigate function ekak gannwa,me function eka use krla api different routes walata navigate krnna puluwan
    const baseUrl = process.env.REACT_APP_BASE_URL // methnin wenne .env file eke thiyena REACT_APP_BASE_URL variable eka gannwa
  const handleSubmit = async (e) => { // handleSubmit kiynne function ekak,me function eka form ekak submit krnna use krnwa,meke nm login krnna backend ekta request ekak yawanna,submit button eka press karamwa me function eka call wenwa
    e.preventDefault(); //meken wenne form ekak submit krnna kalin page eka reload wenna epa krnwa
    setError(''); // meken wenne error state eka reset krnwa
    setLoading(true); // meken wenne loading state eka set krnwa
  // hook ekak kiynne react eke built-in function ekak,me hook ekak use krla api component ekak athule state eka manage krnna puluwan,ekiynne component ekak athule data store krnna puluwan
    try {
      const response = await fetch(`${baseUrl}/login/`, { // meken wenne backend eke /login/ endpoint ekata POST request ekak yawanna
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username,
          password: password 
        }),
      });

      const data = await response.json(); //request body eke thibba data tika

       if (response.ok) {
        // Backend validated credentials successfully
        console.log('✅ Login successful:', data);

      
        const userData = {
          user_id: data.id, //meka use karala
          username:data.username,
        
          email:data.email,
          role:data.role,
          doctor_id: data.doctor_id || null


        }
console.log('✅ Login successful, navigating to dashboard');
        navigate('/dashboard'); 
      } else {
        setError(data.message || '❌ Invalid username or password'); //meken wenne error message ekak set krnwa,eka display wenne userta login page eke,setError function ekak use krla
      }
    } catch (error) {
      setError('❌ An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-icon">🏥</div>
          <h1>Medicare</h1>
          <p className="login-subtitle">Healthcare Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form"> {/* meken wenne form ekak create krnwa,me form ekata onSubmit event ekak dila thiyenwa,me event ekak use krla form ekak submit krnna puluwan  */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Username
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <input   //meken wenne password input field ekak hadanna,input field ekak kiynne userge data eka input krnna puluwan eka
              type="password"
              className="form-input"
              placeholder="Enter your password" //placeholder kiynne input field eke thiyena text eka,me text eka userge input eka gena idea ekak denwa
              value={password} //value kiynne input field eke thiyena data eka,me data eka password state ekata bind krla thiyenwa
              onChange={(e) => setPassword(e.target.value)} //onChange kiynne event handler ekak,me event handler ekak use krla userge input eka password state ekata update krnwa
              required  //required kiynne me input field eka fill krnna one kiyala,meka use krla user ekath me field eka fill krnna one
              disabled={loading} //disabled kiynne me input field eka disable krnwa kiyala,meka use krla loading state eka true unama me field eka disable wenwa
              autoComplete="current-password" //autoComplete kiynne browser ekata me input field eka current password ekak kiyala pennanna
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-link">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>Sign In</>  
            )}
          </button>
        </form> {/* meken wenne form ekak close krnwa */}

        <div className="login-footer">
          <p>Don't have an account? <a href="/signup" className="signup-link">Sign Up</a></p>
          <div className="footer-info">
            <span>© 2024 Medicare. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
