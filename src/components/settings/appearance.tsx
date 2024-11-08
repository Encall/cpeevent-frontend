import { useState, useEffect } from 'react';
import { Divider, Select, SelectItem } from '@nextui-org/react';

import { useTheme } from '@/hooks/use-theme';

const ThemeProps = {
    key: 'theme',
    light: 'light',
    dark: 'dark',
} as const;

type Theme = typeof ThemeProps.light | typeof ThemeProps.dark;

export default function Appearance() {
    const { theme, setLightTheme, setDarkTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme]);

    const handleThemeChange = (newTheme: Theme) => {
        if (newTheme === 'light') {
            setLightTheme();
        } else if (newTheme === 'dark') {
            setDarkTheme();
        }
        setSelectedTheme(newTheme);
    };

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-foreground-600">
                Appearance
            </h3>
            <p className="text-foreground-400">
                Customize the appearance settings.
            </p>
            <Divider className="my-3" />

            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Font
                </h4>
                <Select
                    disallowEmptySelection
                    defaultSelectedKeys={['Noto']}
                    description="Set the font you want to use."
                >
                    <SelectItem key="Noto">Noto Sans</SelectItem>
                </Select>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Theme
                </h4>
                <p className="text-tiny text-foreground-400">
                    Select the theme for the website.
                </p>
                <div className="mt-4 flex gap-4">
                    <button
                        className={`border p-4 rounded-md cursor-pointer ${
                            selectedTheme === 'light'
                                ? 'border-violet-700'
                                : 'border-gray-300'
                        }`}
                        onClick={() => handleThemeChange('light')}
                    >
                        <h5 className="text-lg font-semibold text-foreground-600">
                            Light Theme
                        </h5>
                        <p className="text-foreground-400">Bright and clear.</p>
                    </button>
                    <button
                        className={`border p-4 rounded-md cursor-pointer ${
                            selectedTheme === 'dark'
                                ? 'border-violet-700'
                                : 'border-gray-300'
                        }`}
                        onClick={() => handleThemeChange('dark')}
                    >
                        <h5 className="text-lg font-semibold text-foreground-600">
                            Dark Theme
                        </h5>
                        <p className="text-foreground-400">
                            Dark and soothing.
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
