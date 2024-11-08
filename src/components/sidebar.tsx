import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Link, link as linkStyles, Skeleton } from '@nextui-org/react';
import { BiCalendarStar } from 'react-icons/bi';
import { LuCalendarClock } from 'react-icons/lu';
import { GoChecklist } from 'react-icons/go';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import { Event } from '@/types/index';
import logo from '@/images/logo.png';
import { AuthContext } from '@/context/AuthContext';
import { axiosAPIInstance } from '@/api/axios-config.ts';
import { siteConfig } from '@/config/site';

export const Sidebar = () => {
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const user_id = {
        _id: user as string,
    };

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');

        return response.data.data;
    };

    const {
        data: allEventData = [],
        error,
        isLoading,
    } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    return (
        <aside
            aria-label="Sidebar"
            className="fixed h-full p-6 w-64 z-50 border-r transition-transform -translate-x-full md:translate-x-0"
            id="sidebar"
        >
            <div className="flex items-center justify-center h-32">
                <Link aria-label="Home" href="/">
                    <img src={logo} alt="logo" className="w-32 h-32" />
                </Link>
            </div>
            {siteConfig.sideItems.map((item) => (
                <Link
                    key={item.href}
                    aria-label={item.label}
                    className={clsx(
                        linkStyles({
                            color: 'foreground',
                        }),
                        'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                        currentPath === item.href &&
                            'text-violet-500 bg-default-100 font-medium',
                        'flex items-center gap-2 my-4 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                    )}
                    onClick={() => navigate(item.href)}
                >
                    {/* icon */}
                    {item.icon === 'event' && (
                        <BiCalendarStar className="w-6 h-6 mx-4" />
                    )}
                    {item.icon === 'calendar' && (
                        <LuCalendarClock className="w-6 h-6 mx-4" />
                    )}
                    {item.icon === 'todo' && (
                        <GoChecklist className="w-6 h-6 mx-4" />
                    )}
                    {/* label */}
                    <span className="font-medium">{item.label}</span>
                </Link>
            ))}
            <hr className="my-4 border-1 border-violet-200 dark:border-default-700" />
            {/* list events */}
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Events</h3>
                {error ? (
                    <div>Error loading events: {error.message}</div>
                ) : (
                    <Skeleton isLoaded={!isLoading}>
                        <ul className="flex flex-col gap-2 ml-2 list-disc">
                            {allEventData.map(
                                (event) =>
                                    event.staff?.some(
                                        (staff) => staff.stdID === user_id._id,
                                    ) && (
                                        <li key={event._id} className="ml-4">
                                            <Link
                                                aria-label={event.eventName}
                                                className={clsx(
                                                    linkStyles({
                                                        color: 'foreground',
                                                    }),
                                                    'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                                                    currentPath ===
                                                        `/protected/workspace/${event._id}` &&
                                                        'text-violet-500 bg-default-100',
                                                    'flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                                                )}
                                                onClick={() => {
                                                    const eventID = event._id;

                                                    navigate(
                                                        `/protected/workspace/${eventID}`,
                                                        {
                                                            state: { event },
                                                        },
                                                    );
                                                }}
                                            >
                                                <span className="capitalize">
                                                    {event.eventName}
                                                </span>
                                                {/* <Chip
                                            color={kindColor[event.kind.toLowerCase()]}
                                            variant="flat"
                                        >
                                            {event.kind}
                                        </Chip> */}
                                            </Link>
                                        </li>
                                    ),
                            )}
                        </ul>
                    </Skeleton>
                )}
            </div>
        </aside>
    );
};
