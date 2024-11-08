import type { UserAccountType } from '@/types/index';

import { Divider, Input, Button } from '@nextui-org/react';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TiTick, TiTimes } from 'react-icons/ti';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface InputFieldProps {
    label: string;
    placeholder: string;
    name: string;
    control: any;
    rules?: any;
    error?: string;
    type?: string;
}

interface UserAccountUpdate {
    firstName: string;
    lastName: string;
    year: number;
    email: string;
    phoneNumber: string;
}

const InputField = ({
    label,
    placeholder,
    name,
    control,
    rules,
    error,
    type = 'text',
}: InputFieldProps) => (
    <div className="flex flex-col gap-2">
        <p className="text-foreground-500">{label}</p>
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    errorMessage={error}
                    isInvalid={!!error}
                    placeholder={placeholder}
                    type={type}
                />
            )}
            rules={rules}
        />
    </div>
);

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    year: z.coerce.number().min(1, 'Year is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .refine((val) => !isNaN(Number(val)), {
            message: 'Phone number must be a number',
        }),
});

export default function Account() {
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
        const response = await axiosAPIInstance.get('v1/account');

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

    const updateProfile = async (data: UserAccountUpdate) => {
        const response = await axiosAPIInstance.patch('v1/account', data);

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
            <h3 className="text-2xl font-bold text-foreground-600">Account</h3>
            <p className="text-foreground-400">Update your account details.</p>
            <Divider className="my-3" />

            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Student ID
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <Input
                        isDisabled
                        isReadOnly
                        description="You can't change your student ID."
                        placeholder="Student ID"
                        value={userData?.studentID || ''}
                    />
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Personal Information
                </h4>
                <div className="w-full flex flex-row gap-2 gap-x-4 mt-4">
                    <div className="w-1/2">
                        <InputField
                            control={control}
                            error={errors.firstName?.message}
                            label="Name"
                            name="firstName"
                            placeholder="Name"
                        />
                    </div>
                    <div className="w-1/2">
                        <InputField
                            control={control}
                            error={errors.lastName?.message}
                            label="Last Name"
                            name="lastName"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <InputField
                        control={control}
                        error={errors.year?.message}
                        label="Year"
                        name="year"
                        placeholder="Year"
                        type="number"
                    />
                </div>
                <div className="mt-4">
                    <InputField
                        control={control}
                        error={errors.email?.message}
                        label="Email"
                        name="email"
                        placeholder="Email"
                    />
                </div>
                <div className="mt-4">
                    <InputField
                        control={control}
                        error={errors.phoneNumber?.message}
                        label="Phone Number"
                        name="phoneNumber"
                        placeholder="Phone Number"
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
