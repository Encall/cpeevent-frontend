import { useState, useEffect } from 'react';
import type { Event } from '@/types/index';
import DefaultLayout from "@/layouts/default";
import { useQuery } from '@tanstack/react-query';
import { axiosAPIInstance } from '@/api/axios-config.ts';

export default function MembersPage() {
    const [members, setMembers] = useState<{ stdID: string; role: string; name: string; tel: string; }[]>([]);

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');
        return response.data.data as Event[];
    };

    const { data: eventsData } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    useEffect(() => {
        if (eventsData) {
            const allMembers = eventsData.flatMap(event =>
                event.staff.map(staffMember => ({
                    stdID: staffMember.stdID,
                    role: staffMember.role,
                    name: "",
                    tel: "",
                }))
            );
            setMembers(allMembers);
        }
    }, [eventsData]);

    return (
        <DefaultLayout>
            <div className="font-bold text-4xl m-10 text-gray-700">Members</div>
            <title>Members</title>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full">
                    <thead>
                        <tr className="bg-purple-200 w-fit ">
                            <th className="px-4 py-2 rounded-l-lg text-gray-700 w-1/4 ">Student ID</th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">Name</th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">Role</th>
                            <th className="px-4 py-2 rounded-r-lg text-gray-700 w-1/4">Tel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .sort((a, b) => {
                                const roleComparison = a.role.localeCompare(b.role);
                                if (roleComparison !== 0) {
                                    return roleComparison;
                                }
                                return a.stdID.localeCompare(b.stdID);
                            })
                            .map((member, index) => (
                                <tr
                                    key={index}
                                    className={
                index === 0 || (index > 0 && member.role === members[index - 1].role)
                    ? "border-t-0"
                    : "border-t border-gray-300"
            }
        >
            <td className="px-4 py-3 text-center text-gray-700">{member.stdID}</td>
            <td className="px-4 py-3 text-center text-gray-700">{member.name}</td>
            <td className="px-4 py-3 text-center text-gray-700">{member.role}</td>
            <td className="px-4 py-3 text-center text-gray-700">{member.tel}</td>
        </tr>
    ))}

                    </tbody>
                </table>
            </div>
        </DefaultLayout>
    );
}