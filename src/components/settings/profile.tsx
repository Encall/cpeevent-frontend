import type { UserAccountType } from '@/types/index';

import { Divider, Input, Button, Avatar, ButtonGroup } from '@nextui-org/react';
import { TbSignature } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';

import { axiosAPIInstance } from '@/api/axios-config.ts';
interface InputFieldProps {
    placeholder: string;
    name: string;
    control: any;
    rules?: any;
    error?: string;
    type?: string;
    startContent?: React.ReactNode;
}

interface UserProfileUpdate {
    username: string;
}

const InputField = ({
    placeholder,
    name,
    control,
    rules,
    error,
    type = 'text',
    startContent,
}: InputFieldProps) => (
    <div className="flex flex-col gap-2">
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    errorMessage={error}
                    isInvalid={!!error}
                    placeholder={placeholder}
                    startContent={startContent}
                    type={type}
                />
            )}
            rules={rules}
        />
    </div>
);

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
});

export default function Profile() {
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<UserAccountType>({
        resolver: zodResolver(schema),
        defaultValues: {
            studentID: '',
            firstName: '',
            lastName: '',
            year: 1,
            imgProfile: '',
            email: '',
            password: '',
            phoneNumber: '',
            username: '',
            created_at: new Date(),
        },
    });

    const fetchProfile = async () => {
        const response = await axiosAPIInstance.get('v1/account/profile');

        return response.data.data;
    };

    const { data: userData } = useQuery<UserAccountType>({
        queryKey: ['studentid'],
        queryFn: fetchProfile,
    });

    useEffect(() => {
        if (userData) {
            reset(userData);
        }
    }, [userData, setValue]);

    const updateProfile = async (data: UserProfileUpdate) => {
        const response = await axiosAPIInstance.post(
            'v1/account/profile',
            data,
        );

        return response.data;
    };

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: updateProfile,
    });

    const onSubmit = (data: UserAccountType) => {
        mutate(data, { onSuccess: () => reset(data) });
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-2xl font-bold text-foreground-600">Profile</h3>
            <p className="text-foreground-400">Manage your profile settings.</p>
            <Divider className="my-3" />
            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Profile Picture
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-row items-center gap-4">
                        <Avatar
                            className="w-24 h-24"
                            src="https://i.pravatar.cc/300"
                        />
                        <ButtonGroup>
                            <Button>Upload</Button>
                            <Button className="bg-red-400">Remove</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Username
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <InputField
                        control={control}
                        error={errors.username?.message}
                        name="username"
                        placeholder="Username"
                        startContent={<TbSignature />}
                        type="text"
                    />
                </div>
            </div>
            <div className="mt-6 flex flex-row">
                <Button
                    className={`text-white ${
                        isError
                            ? 'bg-danger-500'
                            : isSuccess
                            ? 'bg-success-500'
                            : 'bg-primary'
                    }`}
                    isDisabled={!isDirty}
                    isLoading={isPending}
                    startContent={
                        isError ? <TiTimes /> : isSuccess ? <TiTick /> : null
                    }
                    type="submit"
                >
                    {isError
                        ? 'Error updating profile'
                        : isSuccess
                        ? 'Profile updated successfully'
                        : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
