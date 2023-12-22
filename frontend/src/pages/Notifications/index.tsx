import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { DropDown, DropdownProvider } from '../../components/DropDown';
import SearchPagination from "../../components/SearchPagination";
import to_url_params from "../../api/urls"
import NotificationItem from "../../components/NotificationItem";

interface Notification {
    id: number;
    notification_type: string,
    message: string,
    creation_time: Date,
    is_read: boolean,
    link: string
}


const NotificationsPage: React.FC = () => {
    function create_url_params(searchParams: any) {

        var temp = {
            page: searchParams.get("page") ?? 1,
            is_read: searchParams.get("is_read") ?? []
        }

        if (!Array.isArray(temp.is_read)) {
            temp.is_read = (temp.is_read == "Read") ? "True" : "False"
        }
        return temp
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeElement, setActiveElement] = useState("");
    const [maxCount, setMaxCount] = useState(0);
    const statuses = ["Read", "Unread"]

    const query = useMemo(
        () => create_url_params(searchParams)
        , [searchParams]);

    const handleFilterChange = (filterCategory: string, value: string) => {
        setSearchParams((prevParams) => {
            prevParams.set(filterCategory, value);
            return prevParams;
        });

        // If the filterCategory isn't page, set page back to 1
        if (filterCategory !== "page") {
            setSearchParams((prevParams) => {
                prevParams.set("page", "1");
                return prevParams;
            });
        }
    };

    const fetchNotifications = async () => {
        try {
            const params = to_url_params(query, false);
            const sortParam = null;
            const response = await axios.get(`/notifications/?${params}${sortParam ? `&sort_by=${sortParam}` : ''}`);
            console.log(response)

            setNotifications(response.data.results)
            setMaxCount(response.data.count)
            setError(null);
        } catch (err) {
            setError("Failed to fetch notifications.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchNotifications();
    }, [query]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-3/4 mx-auto mt-5 flex">

            {/* Filter section */}
            <div className="w-1/4">
                <DropDown
                    data={statuses}
                    category="Read Status"
                    enableSearch={true}
                    value={searchParams.get("is_read") ?? "All"}
                    onChange={(value) => handleFilterChange("is_read", value)} />
            </div>


            <div className="w-3/4">
                {/* <h1 className="text-lg text-fg-secondary bg-gradient-header p-4 text-center">Notifications</h1> */}
                <h1 className="text-2xl text-fg-primary p-4 text-center">Notifications</h1>
                <div id="accordionExample">
                    {notifications?.map((notification, idx) => (
                        <NotificationItem
                            notification={notification}
                            idx={idx}
                            activeElement={activeElement}
                            setActiveElement={setActiveElement}
                            setError={setError}
                            fetchNotifications={fetchNotifications}
                        />
                    ))}
                </div>

                <SearchPagination
                    page={searchParams.get("page") ? Number(searchParams.get("page")) : 1}
                    pageSize={searchParams.get("page_size") ? Number(searchParams.get("page_size")) : 8}
                    maxCount={maxCount}
                    onChange={(value) => handleFilterChange("page", value.toString())} />
            </div>
        </div >
    );
};

export default NotificationsPage;
