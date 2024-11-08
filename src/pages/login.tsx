import { Input, Button, Checkbox, Image } from '@nextui-org/react';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserAccountType } from '@/types/index';

import { FcGoogle } from 'react-icons/fc';
import eventImg from '@/images/event.png';
import { Logo } from '@/components/icons';

import { useLogin } from '@/hooks/use-login';
interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
    isVisible: boolean;
}

const EyeIcon: React.FC<EyeIconProps> = ({ isVisible, ...props }) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        {isVisible ? (
            <>
                <path
                    d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
                    fill="currentColor"
                />
                <path
                    d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
                    fill="currentColor"
                />
            </>
        ) : (
            <>
                <path
                    d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
                    fill="currentColor"
                />
                <path
                    d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
                    fill="currentColor"
                />
                <path
                    d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
                    fill="currentColor"
                />
                <path
                    d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
                    fill="currentColor"
                />
                <path
                    d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
                    fill="currentColor"
                />
            </>
        )}
    </svg>
);

interface InputFieldProps {
    label: string;
    name: string;
    control: any;
    rules?: any;
    error?: string;
    type?: string;
    endContent?: React.ReactNode;
}

const InputField = ({
    label,
    name,
    control,
    rules,
    error,
    type = 'text',
    endContent,
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
                    size="sm"
                    endContent={endContent}
                />
            )}
            rules={rules}
        />
    </div>
);

export default function LoginPage() {
    interface UserLogin {
        studentID: string;
        password: string;
    }

    const schema = z.object({
        studentID: z
            .string()
            .length(11, 'Student ID must be 11 digits')
            .refine((val) => !isNaN(Number(val)), {
                message: 'Student ID must be a number',
            }),
        password: z.string().min(6, 'Password must be at least 6 characters'),
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
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = React.useState(false);
    const { login, loading, error } = useLogin();

    const onSubmit = (data: UserLogin) => {
        login(data.studentID, data.password)
            .then(() => {
                navigate('/'); // Navigate to home page on successful login
            })
            .catch((error) => {
                console.error('Login failed:', error);
                // Handle login failure (e.g., show an error message)
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10  lg:bg-violet-700 drop-shadow-lg flex justify-center flex-1 rounded-lg">
                {/* Left Section */}
                <div className="hidden lg:flex flex-col gap-3 mx-auto lg:w-3/5 p-6 sm:p-12 justify-center items-center">
                    <Image src={eventImg} alt="event" />
                </div>
                {/* Right Section */}
                <div className="flex flex-col items-center mx-auto bg-white lg:w-2/5 sm:rounded-lg lg:rounded-r-lg lg:rounded-l-none">
                    <Logo className="w-32 h-32 mt-14" />
                    <div className="flex flex-col w-full flex-grow">
                        {/* Sign In */}
                        <div className="my-6 mx-8">
                            <p className="text-2xl font-bold text-zinc-600 my-2">
                                Welcome Back!
                            </p>
                            <p className="text-lg text-zinc-500 my-2">
                                Enter your student ID and password to continue.
                            </p>
                        </div>
                        <form
                            className="w-full max-w-md flex flex-col gap-4 mx-auto px-6 xl:px-0"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="">
                                <InputField
                                    control={control}
                                    label="Student ID"
                                    name="studentID"
                                    rules={schema.pick({ studentID: true })}
                                    error={errors.studentID?.message}
                                />
                            </div>
                            <div className="">
                                <InputField
                                    control={control}
                                    label="Password"
                                    name="password"
                                    rules={schema.pick({ password: true })}
                                    error={errors.password?.message}
                                    type={isVisible ? 'text' : 'password'}
                                    endContent={
                                        <button
                                            aria-label="toggle password visibility"
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={() =>
                                                setIsVisible(!isVisible)
                                            }
                                        >
                                            <EyeIcon
                                                className="text-2xl text-default-400 pointer-events-none"
                                                isVisible={isVisible}
                                            />
                                        </button>
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Checkbox size="sm">Remember me</Checkbox>
                                <Link
                                    className="text-violet-800 text-sm"
                                    to="/forgot-password"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Button
                                className="bg-violet-800 hover:bg-violet-900 text-white font-bold rounded-xl"
                                isLoading={loading}
                                type="submit"
                            >
                                {loading ? 'Login...' : 'Login'}
                            </Button>
                            {error && <p className="text-red-500">{error}</p>}
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
                                    Don&apos;t have an account? &nbsp;{' '}
                                </div>
                                <Link className="text-violet-800" to="/signup">
                                    Sign up here
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
