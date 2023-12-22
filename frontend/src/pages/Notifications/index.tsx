import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import { TECollapse } from "tw-elements-react";
import axios from "../../api/axios";
import SearchPagination from "../../components/SearchPagination";
import to_url_params from "../../api/urls"
import { format } from 'date-fns';

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
            page: searchParams.get("page") ?? 1
        }

        return temp
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [activeElement, setActiveElement] = useState("");

    const handleClick = async (notification: Notification, value: string) => {
        if (value === activeElement) {
            // Close
            setActiveElement("");
        } else {
            // Open
            setActiveElement(value);

            // Set is_read, if the item isn't read
            if (!notification.is_read) {
                notifications[Number(value)].is_read = true;
                await updateNotification(notification.id)
            }
        }
    };

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
            const params = to_url_params(query);
            const sortParam = null;
            const response = await axios.get(`/notifications/?${params}${sortParam ? `&sort_by=${sortParam}` : ''}`);
            console.log(response)

            setNotifications(response.data.results)
            setError(null);
        } catch (err) {
            setError("Failed to fetch notifications.");
            console.error(err);
        } finally {
            setIsLoading(false);
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
            setNotifications(response.data.results)
            setError(null);
        } catch (err) {
            setError("Failed to update notification.");
            console.error(err);
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


        <div className=" max-w-lg mx-auto mt-5">
            {/* <h1 className="text-lg text-fg-secondary bg-gradient-header p-4 text-center">Notifications</h1> */}
            <h1 className="text-2xl text-fg-primary p-4 text-center">Notifications</h1>
            <div id="accordionExample">
                {notifications?.map((notification, idx) => (
                    <div className="rounded-t-lg border border-neutral-200 bg-white" key={idx}>
                        <h2 className="mb-0" id="headingOne">
                            <button
                                className={`${activeElement === `${idx}` &&
                                    `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                                    } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                                type="button"
                                onClick={() => handleClick(notification, `${idx}`)}
                                aria-expanded="true"
                                aria-controls="collapseOne"
                            >
                                <span><small className={`${notification.is_read ? "hidden" : "text-red-600"}`}>NEW</small>  Notification #{idx + 1} - {notification.notification_type}</span>

                                <div className="ml-auto flex">
                                    <span className="mr-4">
                                        {format(notification.creation_time, 'dd/MM/yyyy')}
                                    </span>
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
                            </div>
                        </TECollapse>
                    </div>
                ))}
            </div>
            {/* <div className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="mb-0" id="headingTwo">
                    <button
                        className={`${activeElement === "element2"
                            ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            : `transition-none rounded-b-[15px]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                        type="button"
                        onClick={() => handleClick("element2")}
                        aria-expanded="true"
                        aria-controls="collapseOne"
                    >
                        Accordion Item #2
                        <span
                            className={`${activeElement === "element2"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                                } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
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
                    </button>
                </h2>
                <TECollapse
                    show={activeElement === "element2"}
                    className="!mt-0 !rounded-b-none !shadow-none"
                >
                    <div className="px-5 py-4">
                        <strong>This is the second item's accordion body.</strong> Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu
                        rhoncus purus, vitae tincidunt nibh. Vivamus elementum egestas
                        ligula in varius. Proin ac erat pretium, ultricies leo at, cursus
                        ante. Pellentesque at odio euismod, mattis urna ac, accumsan metus.
                        Nam nisi leo, malesuada vitae pretium et, laoreet at lorem.
                        Curabitur non sollicitudin neque.
                    </div>
                </TECollapse>
            </div>
            <div className="rounded-b-lg border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="accordion-header mb-0" id="headingThree">
                    <button
                        className={`${activeElement === "element3"
                            ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            : `transition-none rounded-b-[15px]`
                            } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                        type="button"
                        onClick={() => handleClick("element3")}
                        aria-expanded="true"
                        aria-controls="collapseOne"
                    >
                        Accordion Item #3
                        <span
                            className={`${activeElement === "element3"
                                ? `rotate-[-180deg] -mr-1`
                                : `rotate-0 fill-[#212529] dark:fill-white`
                                } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
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
                    </button>
                </h2>
                <TECollapse
                    show={activeElement === "element3"}
                    className="!mt-0 !shadow-none"
                >
                    <div className="px-5 py-4">
                        <strong>This is the third item's accordion body.</strong>Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Vestibulum eu rhoncus
                        purus, vitae tincidunt nibh. Vivamus elementum egestas ligula in
                        varius. Proin ac erat pretium, ultricies leo at, cursus ante.
                        Pellentesque at odio euismod, mattis urna ac, accumsan metus. Nam
                        nisi leo, malesuada vitae pretium et, laoreet at lorem. Curabitur
                        non sollicitudin neque.
                    </div>
                </TECollapse>
            </div> */}

            <SearchPagination
                page={searchParams.get("page") ? Number(searchParams.get("page")) : 1}
                pageSize={searchParams.get("page_size") ? Number(searchParams.get("page_size")) : 8}
                maxCount={10}
                onChange={(value) => handleFilterChange("page", value.toString())} />
        </div >
    );
};

export default NotificationsPage;
