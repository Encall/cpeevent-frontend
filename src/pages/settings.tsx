import { useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Divider, Link as NavLink } from '@nextui-org/react';

import DefaultLayout from '@/layouts/default';
import Profile from '@/components/settings/profile';
import Security from '@/components/settings/security';
import Appearance from '@/components/settings/appearance';
import Account from '@/components/settings/account';

const sections = ['Profile', 'Account', 'Security', 'Appearance'];

interface SectionNavLinkProps {
    section: string;
    selectedSection: string;
    onClick: (section: string) => void;
}

const SectionNavLink = ({
    section,
    selectedSection,
    onClick,
}: SectionNavLinkProps): ReactNode => (
    <NavLink
        className={`text-xl font-semibold text-foreground-600 cursor-pointer rounded-md pl-3 mb-1 ${
            selectedSection === section ? 'bg-default-100' : ''
        }`}
        onClick={() => onClick(section)}
    >
        {section}
    </NavLink>
);

interface SectionContentProps {
    selectedSection: string;
}

const SectionContent = ({
    selectedSection,
}: SectionContentProps): ReactNode => {
    switch (selectedSection) {
        case 'Profile':
            return <Profile />;
        case 'Security':
            return <Security />;
        case 'Appearance':
            return <Appearance />;
        case 'Account':
            return <Account />;
        default:
            return <Profile />;
    }
};

export default function SettingsPage() {
    const { section } = useParams<{ section: string }>();
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState('Profile');

    useEffect(() => {
        if (section) {
            setSelectedSection(
                section.charAt(0).toUpperCase() + section.slice(1),
            );
        }
    }, [section]);

    const handleSectionChange = (newSection: string) => {
        setSelectedSection(newSection);
        navigate(`/settings/${newSection.toLowerCase()}`);
    };

    return (
        <DefaultLayout>
            <div className="flex flex-col mb-4 text-left gap-1">
                <h2 className="text-4xl font-bold text-foreground-600 capitalize">
                    Settings
                </h2>
                <p className="text-foreground-400">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Divider />
            <div className="flex flex-row gap-6 mt-4">
                <div className="w-1/4">
                    <div className="flex flex-col gap-2">
                        {sections.map((section) => (
                            <SectionNavLink
                                key={section}
                                section={section}
                                selectedSection={selectedSection}
                                onClick={handleSectionChange}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-3/4">
                    <SectionContent selectedSection={selectedSection} />
                </div>
            </div>
        </DefaultLayout>
    );
}
