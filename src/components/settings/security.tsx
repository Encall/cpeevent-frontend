import { Divider, Input, Button, Switch, cn } from '@nextui-org/react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useState } from 'react';

interface InputFieldProps {
    label: string;
    placeholder: string;
}

const InputPasswordField = ({ label, placeholder }: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <p className="text-foreground-500">{label}</p>
            <Input
                endContent={
                    <button
                        className="text-xl"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </button>
                }
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
            />
        </div>
    );
};

export default function Security() {
    return (
        <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-foreground-600">Security</h3>
            <p className="text-foreground-400">
                Manage your account security settings to keep your information
                safe.
            </p>
            <Divider className="my-3" />

            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Password
                </h4>
                <div className="flex flex-col gap-6 mt-4">
                    <InputPasswordField
                        label="Current Password"
                        placeholder="Current Password"
                    />
                    <InputPasswordField
                        label="New Password"
                        placeholder="New Password"
                    />
                    <InputPasswordField
                        label="Confirm New Password"
                        placeholder="Confirm New Password"
                    />
                </div>
                <div className="mt-6">
                    <Button className="bg-violet-700 text-white">
                        Change Password
                    </Button>
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Two-Factor Authentication
                </h4>
                <div className="mt-4">
                    <Switch
                        classNames={{
                            base: cn(
                                'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center',
                                'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                                'data-[selected=true]:border-primary',
                            ),
                            wrapper: 'p-0 h-4 overflow-visible',
                            thumb: cn(
                                'w-6 h-6 border-2 shadow-lg',
                                'group-data-[hover=true]:border-primary',
                                //selected
                                'group-data-[selected=true]:ml-6',
                                // pressed
                                'group-data-[pressed=true]:w-7',
                                'group-data-[selected]:group-data-[pressed]:ml-4',
                            ),
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-medium">
                                Enable Two-Factor Authentication
                            </p>
                            <p className="text-tiny text-default-400">
                                Add an extra layer of security to your account.
                            </p>
                        </div>
                    </Switch>
                </div>
            </div>
        </div>
    );
}
