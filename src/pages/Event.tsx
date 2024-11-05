import { Tabs, Tab, Skeleton } from '@nextui-org/react';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import { axiosAPIInstance } from '@/api/axios-config.ts';
import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/eventComponents/AllEvent.tsx';
import { AuthContext } from '@/context/AuthContext';
import JoinedEvent from '@/components/eventComponents/JoinedEvent';

export default function Event() {
    interface Event {
        _id: string;
        eventName: string;
        eventDescription: string;
        nParticipant: number;
        participants: string[];
        nStaff: number;
        startDate: string;
        endDate: string;
        president: string;
        kind: string;
        role: string[];
        icon: string | null;
        poster: string | null;
        postList: string[];
        staff: {
            stdID: string;
            role: string;
        }[];
    }

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
        <DefaultLayout>
            {error ? (
                <div>Error loading events: {error.message}</div>
            ) : (
                <Skeleton isLoaded={!isLoading}>
                    <Tabs
                        key="secondary"
                        fullWidth
                        color="secondary"
                        size="md"
                        style={{ fontWeight: 'bold' }}
                        variant="underlined"
                    >
                        <Tab key="All" title="All">
                            <AllEvent events={allEventData} user={user_id} />
                        </Tab>

                        <Tab key="Joined" title="Joined">
                            <JoinedEvent
                                events={allEventData.filter((event) =>
                                    event.staff?.some(
                                        (staff) => staff.stdID === user_id._id,
                                    ),
                                )}
                            />
                        </Tab>
                    </Tabs>
                </Skeleton>
            )}
        </DefaultLayout>
    );
}