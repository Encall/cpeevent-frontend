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
} from '@nextui-org/react';
import { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '@/context/AuthContext';
import { SearchIcon } from '@/components/icons';

export const Navbar = () => {
   const [searchContent, setSearchContent] = useState('');
   const { logout } = useContext(AuthContext);

   const handleLogout = async () => {
      toast.promise(logout(), {
         pending: 'Logging out...',
         success: 'Logout successful',
         error: 'An error occurred. Please try again.',
      });
   };

   console.log(searchContent);

   const searchInput = (
      <Input
         aria-label="Search"
         classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm',
         }}
         labelPlacement="outside"
         placeholder="Search..."
         startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
         }
         type="search"
         value={searchContent}
         onChange={(e) => setSearchContent(e.target.value)}
      />
   );

   //dummy noti
   const notification = {
      Noti1: 'Notification 1',
      Noti2: 'Notification 2',
   };

   return (
      <NextUINavbar className="flex flex-col" maxWidth="full" position="sticky">
         <NavbarBrand>
            <p className="font-bold text-inherit" />
         </NavbarBrand>
         <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {searchInput}
         </NavbarContent>
         <NavbarContent
            className="hidden sm:flex basis-1/5 sm:basis-full"
            justify="end"
         >
            <div className="flex items-center space-x-4">
               <NavbarItem className="hidden lg:flex text-lg">
                  <Dropdown>
                     <DropdownTrigger>
                        <button>
                           <VscBell />
                        </button>
                     </DropdownTrigger>
                     <DropdownMenu aria-label="Static Actions">
                        {Object.entries(notification).map(([key, value]) => (
                           <DropdownItem key={key}>{value}</DropdownItem>
                        ))}
                     </DropdownMenu>
                  </Dropdown>
               </NavbarItem>
               <NavbarItem className="hidden lg:flex">
                  <VscAccount className="text-2xl m-2" />

                  <Dropdown>
                     <DropdownTrigger>
                        <button>
                           <VscChevronDown />
                        </button>
                     </DropdownTrigger>
                     <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="ViewProfile">
                           View Profile
                        </DropdownItem>
                        <DropdownItem key="Setting">Setting</DropdownItem>
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
         </NavbarContent>
         <ToastContainer position="top-center" />
      </NextUINavbar>
   );
};
