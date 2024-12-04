import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import image from '@/assets/images/undraw_Events_re_2p66.svg';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface JoinEventModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    eventID: string;
}

interface JoinEventRequest {
    eventID: string;
    role: string;
    subRole?: string;
}

interface EventFromAPI {
    eventID: string;
    nParticipant: number;
    nStaff: number;
    role: string[];
}

const eventFromAPI: EventFromAPI = {
    eventID: '',
    nParticipant: 0,
    nStaff: 0,
    role: [],
};

const JoinEventModal: React.FC<JoinEventModalProps> = ({
    isOpen,
    onOpenChange,
    eventID,
}) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('participant');
    const [selectedSubRole, setSelectedSubRole] = useState<string | null>(null);
    const [subRoleLabel, setSubRoleLabel] = useState('Select a role');

    const joinEvent = async (data: JoinEventRequest) => {
        const response = await axiosAPIInstance.patch(`v1/event/join`, data);

        return response.data;
    };

    const { mutate, isError, isPending } = useMutation({
        mutationFn: joinEvent,
    });

    const onJoin = () => {
        mutate(
            {
                eventID,
                role: selectedRole,
                subRole: selectedSubRole ?? undefined,
            },
            {
                onSuccess: () => navigate(`/workspace/${eventID}`),
                onError: (error: any) => {
                    if (error.response?.status === 409) {
                        setErrorMessage('You have already joined this event.');
                    } else {
                        setErrorMessage('An error occurred. Please try again.');
                    }
                },
            },
        );
    };

    // fetch event interface EventFromAPI
    const fetchEvent = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/getEvent/${eventID}`,
        );

        return response.data.data;
    };

    const { data: eventData = eventFromAPI } = useQuery<EventFromAPI>({
        queryKey: ['event', eventID],
        queryFn: fetchEvent,
    });

    const isParticipantDisabled = eventData.nParticipant === 0;
    const isStaffDisabled = eventData.nStaff === 0;

    useEffect(() => {
        if (isParticipantDisabled) {
            setSelectedRole('staff');
        }
    }, [isParticipantDisabled]);

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        if (role !== 'staff') {
            setSelectedSubRole(null);
            setSubRoleLabel('Select a role');
        }
    };

    const handleSubRoleChange = (value: string) => {
        setSelectedSubRole(value);
        setSubRoleLabel('');
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Join Workspace Confirmation
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to join the workspace?</p>
                            <motion.div
                                className={`border p-4 rounded-md ${
                                    selectedRole === 'participant'
                                        ? 'border-primary cursor-pointer'
                                        : 'border-gray-300'
                                } ${
                                    isParticipantDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                whileHover={{
                                    scale: isParticipantDisabled ? 1 : 1.1,
                                }}
                                whileTap={{
                                    scale: isParticipantDisabled ? 1 : 0.9,
                                }}
                                onClick={() =>
                                    !isParticipantDisabled &&
                                    handleRoleChange('participant')
                                }
                            >
                                <h5 className="text-lg font-semibold text-foreground-600">
                                    Participant
                                </h5>
                                <p className="text-foreground-400">
                                    Engaging as a participant.
                                </p>
                            </motion.div>
                            <motion.div
                                className={`border p-4 rounded-md ${
                                    selectedRole === 'staff'
                                        ? 'border-primary cursor-pointer'
                                        : 'border-gray-300'
                                } ${
                                    isStaffDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                whileHover={{
                                    scale: isStaffDisabled ? 1 : 1.1,
                                }}
                                whileTap={{
                                    scale: isStaffDisabled ? 1 : 0.9,
                                }}
                                onClick={() =>
                                    !isStaffDisabled &&
                                    handleRoleChange('staff')
                                }
                            >
                                <h5 className="text-lg font-semibold text-foreground-600">
                                    Staff
                                </h5>
                                <p className="text-foreground-400">
                                    Contributing as staff.
                                </p>
                                {selectedRole === 'staff' &&
                                    eventData.role &&
                                    eventData.role.length > 0 && (
                                        <Select
                                            isRequired
                                            aria-label="Select a role"
                                            className="max-w-xs"
                                            label={subRoleLabel}
                                            variant="underlined"
                                            onChange={(e) =>
                                                handleSubRoleChange(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {eventData.role.map((role) => (
                                                <SelectItem key={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                            </motion.div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color={isError ? 'danger' : 'primary'}
                                isDisabled={
                                    isError ||
                                    (selectedRole === 'staff' &&
                                        !selectedSubRole)
                                }
                                isLoading={isPending}
                                onPress={onJoin}
                            >
                                {errorMessage ? errorMessage : 'Confirm'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default JoinEventModal;
