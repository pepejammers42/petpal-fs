
import moment from "moment";
import axios from "../../api/axios";
import { TECollapse } from "tw-elements-react";

interface Notification {
  id: number;
  notification_type: string,
  message: string,
  creation_time: Date,
  is_read: boolean,
  link: string
}

type NotificationProps = {
  notification: Notification;
  idx: number;
  activeElement: string;
  setActiveElement: (element: any) => void;
  setError: (element: any) => void;
  fetchNotifications: () => void;
};




const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  idx,
  activeElement,
  setActiveElement,
  setError,
  fetchNotifications
}) => {

  const types: { [key: string]: string } = {
    'message': 'message',
    'status_update': 'status update',
    'pet_listing': 'pet listing',
    'application': 'application',
    'review': 'review',
  };


  const handleClick = async (notification: Notification, value: string) => {
    if (value === activeElement) {
      // Close
      setActiveElement("");
    } else {
      // Open
      setActiveElement(value);

      // Set is_read, if the item isn't read
      if (!notification.is_read) {
        notification.is_read = true;
        await updateNotification(notification.id)
      }
    }
  };

  const onDelete = async (id: number) => {
      try {
          const response = await axios.delete(
              `/notifications/${id}/`
          );
          await fetchNotifications();
      } catch (err) {
          setError("Failed to delete notification.");
          console.error(err);
      }
  }

  const updateNotification = async (id: number) => {
    try {
      const response = await axios.put(
        `/notifications/${id}/`,
        {
          is_read: true,
        }
      );
      setError(null);
    } catch (err) {
      setError("Failed to update notification.");
      console.error(err);
    }
  }

  return (

    <div className="rounded-t-lg border border-neutral-200 bg-white" key={idx}>
      <h2 className="mb-0" id="headingOne">
        <button
          className={`${activeElement === `${idx}` &&
            `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 `
            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none`}
          type="button"
          onClick={() => handleClick(notification, `${idx}`)}
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <span>
            <small className={`${notification.is_read ? "hidden" : "text-red-600"}`}>NEW</small> You have a new {types[notification.notification_type]}!
            <br />
            <small><i>{moment(notification.creation_time).fromNow()}</i></small>
          </span>


          <div className="ml-auto flex">
            <span
              className={`${activeElement === `${idx}`
                ? `rotate-[-180deg]`
                : `rotate-0 fill-[#212529]  dark:fill-white`
                } h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>

          </div>
        </button>
      </h2>
      <TECollapse
        show={activeElement === `${idx}`}
        className="!mt-0 !rounded-b-none !shadow-none"
      >
        <div className="px-5 py-4">
          {notification.message}

          <br />
          <br />

          <button
            className="ml-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onDelete(notification.id)}>
            Delete
          </button>
        </div>
      </TECollapse>
    </div>
  );
};

export default NotificationItem;