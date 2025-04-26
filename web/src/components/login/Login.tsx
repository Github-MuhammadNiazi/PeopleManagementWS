import './Login.css';
import logo from '../../assets/appLogo.png';
import { PrimeReactProvider } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

// Service import
import { authenticateConnection } from '../../api/services/authService';

const Login = () => {
  const [isForeigner, setIsForeigner] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const hasAuthenticated = useRef(false); // To Prevent duplicate calls

  useEffect(() => {
    if (!hasAuthenticated.current) {
      hasAuthenticated.current = true;
      authenticateConnection()
        .catch((error) => {
          toast.current?.show({ severity: 'error', summary: 'Connection Error', detail: 'Failed to connect to the server!' });
        })
        .finally(() => {
          hasAuthenticated.current = false;
        });
    }
  }, []);

  const login = () => {
    // TODO: Perform login logic here
    setLoading(true);
    toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Logging in...' });
    setLoading(false);
  };

  return (
    <PrimeReactProvider>
      <Toast ref={toast} />
      <div className="login-container">
        <div className="login-left">
          <div className="graphic">
            <img src={logo} alt="Logo" className='logo' />
          </div>
        </div>
        <div className="login-right">
          <div className="form-box">
            {/* Modify based on your design */}
            <h2 className="logo">People <span>Management <span className="xt">WS</span></span></h2>
            <div className="flex flex-column gap-2"
              style={{ width: '70%' }}>
              <InputText
                id="username"
                placeholder={isForeigner ? 'Passport Number' : 'ID Card Number'}
              />
            </div>
            <div className="flex flex-column gap-2 mt-2"
              style={{ width: '70%' }}>
              <InputText
                id="password"
                type="password"
                placeholder="Password" />
            </div>
            <div className="card flex justify-content-center">
              <InputSwitch checked={isForeigner} onChange={(e) => setIsForeigner(e.value)} />
              <span className="switch-label">I am a foreigner</span>
            </div>
            <div className="card flex flex-wrap justify-content-center gap-3">
              <Button label="Login" loading={loading} onClick={login} />
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Login;
