import { message, Card, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinning from '../../components/Spinning';

function VerifyAccount() {
    const { token, email } = useParams();
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const verifyAccount = async () => {
        setSpinning(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-account`, { token, email });
            if (response.status === 200) {
                setTimeout(() => {
                    setSpinning(false);
                    setResult(true);
                    message.success("Verified successfully!");
                }, 1000);
            } else {
                setTimeout(() => {
                    setSpinning(false);
                    setResult(false);
                    message.error(`Verification failed: ${response.data.message}`);
                }, 1000);
            }
        } catch (error) {
            setTimeout(() => {
                setSpinning(false);
                setResult(false);
                message.error(`Verification failed! ${error.response?.data?.message || 'Unexpected error occurred.'}`);
            }, 1000);
        } finally {
            setSpinning(false);
        }
    };

    const resendVerification = async () => {
        setSpinning(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resend-verification`, { email });
            if (response.status === 200) {
                message.success("Verification email sent again!");
            } else {
                message.error(`Failed to resend verification: ${response.data.message}`);
            }
        } catch (error) {
            message.error(`Error: ${error.response?.data?.message || 'Unexpected error occurred.'}`);
        } finally {
            setSpinning(false);
        }
    };

    useEffect(() => {
        verifyAccount();
    }, []);

    return (
        <>
            <Spinning spinning={spinning} />
            {!spinning && result === true && (
                <Card
                    title="Account Verified"
                    style={{ textAlign: 'center' }}
                >
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                    <p>Your account has been successfully verified!</p>
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Go to Login
                    </Button>
                </Card>
            )}
            {!spinning && result === false && (
                <Card
                    title="Verification Failed"
                    style={{ textAlign: 'center' }}
                >
                    <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                    <p>Account verification failed. You can resend the verification email and try again.</p>
                    <Button type="primary" onClick={resendVerification}>
                        Resend Verification Email
                    </Button>
                </Card>
            )}
        </>
    );
}

export default VerifyAccount;
