import React from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tabs,
    Tab,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
} from '@nextui-org/react';
import { LuMoreHorizontal } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosAPIInstance } from '@/api/axios-config.ts';

import CalendarPage from './calendar';


import DefaultLayout from '@/layouts/default';

interface Props {
    children: React.ReactNode;
}

export default function Post(props: Props) {
    // const location = useLocation();
    // const { event } = location.state as { event: Event };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [backdrop, setBackdrop] = React.useState<
        'opaque' | 'transparent' | 'blur'
    >('opaque');

    const handleOpen = (backdrop: 'opaque' | 'transparent' | 'blur') => {
        setBackdrop(backdrop);
        onOpen();
    };
    // let { eventid } = useParams();

    function memberPage() {
        navigate(`/workspace/${event._id}/members`);   
    }

    return (
        <DefaultLayout>
            <div className="flex mb-4 text-left ml">
                <h2 className="flex-col m-0 text-4xl font-bold w-11/12 text-zinc-600 capitalize">
                    {/* {event.eventName} */}
                </h2>
                <Dropdown className="flex justify-end">
                    <DropdownTrigger>
                        <div
                            className="flex-col text-2xl mt-2 text-zinc-600 cursor-pointer"
                            role="button"
                        >
                            <LuMoreHorizontal />
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem className="text-zinc-600" onClick={memberPage}>
                            Member
                        </DropdownItem>
                        <DropdownItem
                            key="leave"
                            className="text-danger"
                            color="danger"
                            onPress={() => handleOpen('opaque')}
                        >
                            Leave Event
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="">
                <Tabs
                    key="secondary"
                    fullWidth
                    color="secondary"
                    size="md"
                    style={{ fontWeight: 'bold' }}
                    variant="underlined"
                >
                    <Tab key="Post" title="Post">
                        {props.children}
                    </Tab>
                    <Tab key="Calendar" title="Calendar">
                        <CalendarPage />
                    </Tab>
                    <Tab key="Notification" title="Notifications">
                        <CalendarPage />
                    </Tab>
                </Tabs>
            </div>
            <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Leave Event Confirmation
                            </ModalHeader>
                            <ModalBody className="flex flex-row">
                                Do you want to leave event?
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
                                    color="primary"
                                    onPress={() => {
                                        onClose();
                                    }}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </DefaultLayout>
    );
}
