import React, { useState } from "react";
import moment from "moment";
import { ajax_or_login } from '../../ajax';
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }: { notification: any }) => {
  const [expanded, setExpanded] = useState(false); // Add state for expanded state
  const navigate = useNavigate();


  const formattedTime = moment(notification.creation_time).fromNow();
  const types: { [key: string]: string } = {
    'message': 'message',
    'status_update': 'status update',
    'pet_listing': 'pet listing',
    'application': 'application',
    'review': 'review',
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  const handleStatusChange = async () => { 
    await ajax_or_login(`/notifications/${notification.id}/`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({
        is_read: true,
      })}, navigate);
  }

  return (
    <li className={`flex items-center px-4 py-2 border-b border-fg-dimmed ${notification.is_read ? 'bg-bg-primary' : 'bg-bg-success'}`}>
      {/* <span className="text-sm font-bold text-fg-success mr-3">{notification.notification_type}</span> */}

      {/* Notification text and link */}
      <div className="flex flex-col flex-grow">
   
        <span className="text-sm text-fg-primary">You have a new {types[notification.notification_type]}!</span>
        <span className="text-xs text-primary-300">{formattedTime}</span>

        {/* Expand button */}
        <button onClick={handleExpand} className="text-xs text-primary-300 hover:underline">
          {expanded ? "Collapse" : "Expand"}
        </button>

        {/* Additional details */}
        {expanded && (
          <div>
           {notification.message}
          </div>
        )}
      </div>

      {/* Unread notification indicator */}
      {!notification.is_read && <span className="h-2 w-2 bg-secondary-500 rounded-full ml-2"></span>}
    </li>
  );
};

export default NotificationItem;