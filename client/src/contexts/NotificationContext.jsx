import { createContext, useContext, useState, useEffect } from 'react';
// import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    // const { socket } = useSocket();

    useEffect(() => {
        // if (!socket) return;

        // socket.on('new_notification', (notification) => {
        //     setNotifications(prev => [notification, ...prev]);
        //     // You can also implement a notification sound or toast here
        // });

        // return () => {
        //     socket.off('new_notification');
        // };
    }, []);


    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif._id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};