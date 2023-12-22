import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ajax_or_login } from '../../ajax';
import NotificationItem from '../../components/NotificationItem';

interface Notification {
  id: number;
  // Add other properties here
}

const NotificationsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        ajax_or_login('/notifications/', {}, navigate)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(data => {
                setNotifications(data.results);
            })
            .catch(error => setError(error.message))
            .finally(() => setIsLoading(false));
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (


        <div className=" max-w-lg mx-auto mt-5">
            {/* <h1 className="text-lg text-fg-secondary bg-gradient-header p-4 text-center">Notifications</h1> */}
            <h1 className="text-2xl text-fg-primary p-4 text-center">Notifications</h1>
            <ul className="shadow-lg rounded-lg divide-y divide-fg-dimmed">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
