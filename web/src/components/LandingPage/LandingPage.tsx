import './LandingPage.css';
import Loader from '../common/Loader';
import { useEffect, useRef, useState } from 'react';

// Service import
import { authenticateConnection } from '../../api/services/authService';
import { Toast } from 'primereact/toast';
import Login from '../Login/Login';

const LandingPage = () => {
    const [isRendered, setIsRendered] = useState(false);
    const toast = useRef<Toast>(null);
    const hasAuthenticated = useRef(false);

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

    return (
        <>
            <Toast ref={toast} />
            <div className="landing-page">
                {!isRendered && <Loader />}
                <Login />
            </div>
        </>
    )
};

export default LandingPage;
