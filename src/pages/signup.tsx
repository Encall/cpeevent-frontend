import { Input, Button, Image } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserAccountType } from '@/types/index';

import { FcGoogle } from 'react-icons/fc';
import { useSignup } from '@/hooks/use-signup';
import { Logo } from '@/components/icons';
import eventImg from '@/images/event.png';

interface InputFieldProps {
    label: string;
    name: string;
    control: any;
    rules?: any;
    error?: string;
    type?: string;
}

const InputField = ({
    label,
    name,
    control,
    rules,
    error,
    type = 'text',
}: InputFieldProps) => (
    <div className="flex flex-col gap-2 w-full">
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    label={label}
                    errorMessage={error}
                    isInvalid={!!error}
                    type={type}
                    size='sm'
                />
            )}
            rules={rules}
        />
    </div>
);

export default function SignupPage() {
    interface UserSignup {
        studentID: string;
        password: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }

    const schema = z.object({
        studentID: z
            .string()
            .length(11, 'Student ID must be 11 digits')
            .refine((val) => !isNaN(Number(val)), {
                message: 'Student ID must be a number',
            }),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        phoneNumber: z
            .string()
            .min(1, 'Phone number is required')
            .refine((val) => !isNaN(Number(val)), {
                message: 'Phone number must be a number',
            }),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<UserAccountType>({
        resolver: zodResolver(schema),
        defaultValues: {
            studentID: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
        },
    });

    const onSubmit = (data: UserSignup) => {
        const year =
            new Date().getFullYear() -
            (1956 + parseInt(data.studentID.substring(0, 2), 10));
        const username = data.email.split('@')[0];

        signup(
            data.studentID,
            data.email,
            data.password,
            data.firstName,
            data.lastName,
            data.phoneNumber,
            year,
            username,
        )
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Sign up failed:', error);
                // Handle Sign up failure (e.g., show an error message)
            });
    };

    const navigate = useNavigate();
    const { signup, loading, error } = useSignup();

    const [slideIn, setSlideIn] = useState(false);

    useEffect(() => {
        setSlideIn(true);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10  lg:bg-violet-700 drop-shadow-lg flex justify-center flex-1 rounded-lg">
                {/* Left Section */}
                <div
                    className={`flex flex-col items-center mx-auto bg-white lg:w-2/5 sm:rounded-lg lg:rounded-l-lg lg:rounded-r-none transform transition-transform duration-{100ms} ${
                        slideIn ? 'lg:translate-x-0' : 'lg:translate-x-full'
                    }`}
                >
                    <Logo className="w-32 h-32 mt-8" />
                    <div className="flex flex-col w-full flex-grow">
                        {/* Sign Up */}
                        <div className="my-6 ml-8">
                            <p className="text-2xl font-bold text-zinc-600 my-2">
                                Create an account
                            </p>
                            <p className="text-lg text-zinc-500 my-2">
                                Enter your student ID and password to continue.
                            </p>
                        </div>
                        <form
                            className="w-full max-w-md flex flex-col gap-2 mx-auto px-6 xl:px-0"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className={errors.studentID ? "" : "mb-2"}>
                                <InputField
                                    label='Student ID'
                                    control={control}
                                    error={errors.studentID?.message}
                                    name="studentID"
                                />
                            </div>
                            <div className={errors.password ? "" : "mb-2"}>
                                <InputField
                                    label='Password'
                                    control={control}
                                    error={errors.password?.message}
                                    name="password"
                                    type="password"
                                />
                            </div>
                            <div className={(errors.firstName || errors.lastName) ? "flex gap-2" : "flex gap-2 mb-2"}>
                                <InputField
                                    label='First Name'
                                    control={control}
                                    error={errors.firstName?.message}
                                    name="firstName"
                                />
                                <InputField
                                    label='Last Name'
                                    control={control}
                                    error={errors.lastName?.message}
                                    name="lastName"
                                />
                            </div>
                            <div className={errors.email ? "" : "mb-2"}>
                                <InputField
                                    label='Email'
                                    control={control}
                                    error={errors.email?.message}
                                    name="email"
                                />
                            </div>
                            <div className={errors.phoneNumber ? "" : "mb-2"}>
                                <InputField
                                    label='Phone Number'
                                    control={control}
                                    error={errors.phoneNumber?.message}
                                    name="phoneNumber"
                                />
                            </div>
                            <Button
                                className="bg-violet-800 hover:bg-violet-900 text-white font-bold rounded-xl mt-2"
                                isLoading={loading}
                                type="submit"
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </Button>
                            {error && (
                                <p className="text-red-500">
                                    {error ===
                                    'Request failed with status code 409'
                                        ? 'This student ID is already registered'
                                        : 'Sign up failed'}
                                </p>
                            )}
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-gray-400" />
                                <span className="flex-shrink mx-4 text-sm text-gray-400">
                                    Or Login with
                                </span>
                                <div className="flex-grow border-t border-gray-400" />
                            </div>
                            <Button className="bg-white hover:bg-gray-100 border-2 text-gray-800 rounded-xl mt-2 flex items-center justify-center">
                                <FcGoogle className="w-5 h-5 mr-2" />
                                Sign up with Google
                            </Button>
                            <div className="text-sm flex justify-center">
                                <div className="">
                                    Already have an account? &nbsp;{' '}
                                </div>
                                <Link className="text-violet-800" to="/login">
                                    Login here
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right Section */}
                <div className="hidden lg:flex flex-col gap-3 mx-auto lg:w-3/5 p-6 sm:p-12 justify-center items-center">
                    <Image alt="event" src={eventImg} />
                </div>
            </div>
        </div>
    );
}
