import './Login.css';
import logo from '../../assets/appLogo.png';
import { PrimeReactProvider } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Loader from '../common/Loader'; // Import the Loader component

// Service import
import { authenticateConnection, login } from '../../api/services/authService';

const Login = () => {
  const [isForeigner, setIsForeigner] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const hasAuthenticated = useRef(false);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  useEffect(() => {
    if (!hasAuthenticated.current) {
      hasAuthenticated.current = true;
      authenticateConnection()
        .catch((error) => {
          toast.current?.show({ severity: 'error', summary: 'Server error', detail: error.message });
        })
        .finally(() => {
          hasAuthenticated.current = false;
          setIsRendered(true);
        });
    }
  }, []);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values);
      console.log('Login response:', response);
      // TODO: handle successful login (e.g., redirect to dashboard, store token, etc.)
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Failed to Login', detail: error?.status < 500 ? "Username or password is incorrect" : 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrimeReactProvider>
      {!isRendered && <Loader />}
      <Toast ref={toast} />
      <div className="login-container">
        <div className="login-left">
          <div className="graphic">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
        <div className="login-right">
          <div className="form-box">
            <h2 className="logo">
              People <span>Management <span className="xt">WS</span></span>
            </h2>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid }) => (
                <Form className='flex flex-column'>
                  <div style={{ padding: '0.5rem' }}>
                    <Field
                      as={InputText}
                      id="username"
                      name="username"
                      placeholder={isForeigner ? 'Passport Number' : 'ID Card Number'}
                    />
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <Field
                      as={InputText}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <InputSwitch checked={isForeigner} onChange={(e) => setIsForeigner(e.value)} />
                    <span className="flex flex-justify-center switch-label">I am a foreigner</span>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <Button
                      label="Login"
                      type="submit"
                      loading={loading || isSubmitting}
                      disabled={loading || isSubmitting || !isValid}
                    />
                  </div>
                </Form>
              )}
            </Formik>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Login;