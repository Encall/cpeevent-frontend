import { Input } from '@nextui-org/input';
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar';
import { VscBell, VscAccount, VscChevronDown } from 'react-icons/vsc';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Link,
    Modal,
    ModalContent,
    ModalBody,
    Autocomplete,
    AutocompleteItem,
    Kbd,
} from '@nextui-org/react';
import { useState, useContext, useEffect } from 'react';
// eslint-disable-next-line import/order
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';
import { SearchIcon } from '@/components/icons';

export const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [searchContent, setSearchContent] = useState('');
    const [items] = useState(['Home', 'About', 'Services', 'Contact']);
    const [filteredItems, setFilteredItems] = useState(items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;

        setSearchContent(query);
        setFilteredItems(
            items.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase()),
            ),
        );
    };

    const handleInputClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        toast.promise(logout(), {
            pending: 'Logging out...',
            success: 'Logout successful',
            error: 'An error occurred. Please try again.',
        });
    };

    const searchInput = (
        <button
            aria-label="Open search modal"
            className="bg-transparent border-none p-0 m-0 cursor-pointer"
            onClick={handleInputClick}
        >
            <Input
                readOnly
                aria-label="Search"
                endContent={
                    <Kbd className="hidden lg:inline-block" keys={['command']}>
                        K
                    </Kbd>
                }
                labelPlacement="outside"
                placeholder="Search..."
                startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="search"
                value={searchContent}
                onChange={handleSearchChange}
            />
        </button>
    );

    //dummy noti
    const notification = {
        Noti1: 'Notification 1',
        Noti2: 'Notification 2',
    };

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    return (
        <NextUINavbar
            className={clsx(scrolled ? 'shadow' : '', 'flex flex-col')}
            maxWidth="full"
            position="sticky"
        >
            <NavbarBrand>
                <p className="font-bold text-inherit" />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {searchInput}
                <Modal
                    classNames={{ closeButton: 'hidden' }}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                >
                    <ModalContent>
                        <ModalBody>
                            <div className="w-full min-h-16 flex justify-center">
                                <Autocomplete
                                    aria-label="Search"
                                    className="my-auto"
                                    endContent={
                                        <Kbd className="hidden lg:inline-block">
                                            ESC
                                        </Kbd>
                                    }
                                    labelPlacement="outside"
                                    placeholder="Search..."
                                    startContent={
                                        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    type="search"
                                    value={searchContent}
                                    onChange={handleSearchChange}
                                >
                                    {filteredItems.map((item, index) => (
                                        <AutocompleteItem key={index}>
                                            {item}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                {user ? (
                    <div className="flex items-center space-x-4">
                        <NavbarItem className="hidden lg:flex text-lg">
                            <Dropdown>
                                <DropdownTrigger>
                                    <button>
                                        <VscBell />
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    {Object.entries(notification).map(
                                        ([key, value]) => (
                                            <DropdownItem key={key}>
                                                {value}
                                            </DropdownItem>
                                        ),
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                        <NavbarItem className="hidden lg:flex">
                            <div className="my-auto">{user}</div>
                            <VscAccount className="text-2xl m-2" />
                            <Dropdown>
                                <DropdownTrigger>
                                    <button>
                                        <VscChevronDown />
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem
                                        key="ViewProfile"
                                        onClick={() =>
                                            navigate('/settings/profile')
                                        }
                                    >
                                        View Profile
                                    </DropdownItem>
                                    <DropdownItem
                                        key="Setting"
                                        onClick={() =>
                                            navigate('/settings/account')
                                        }
                                    >
                                        Setting
                                    </DropdownItem>
                                    <DropdownItem
                                        key="SignOut"
                                        className="text-danger"
                                        color="danger"
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link
                            className="px-2 cursor-pointer text-sm"
                            color="foreground"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Link>
                        <Button
                            className="bg-violet-700 text-white text-sm"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </NavbarContent>
            <ToastContainer position="top-center" />
        </NextUINavbar>
    );
};
