import { Divider, Input, Button, Avatar, ButtonGroup } from '@nextui-org/react';
import { TbSignature } from 'react-icons/tb';

export default function Profile() {
    return (
        <div className="flex flex-col">
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
                    <Input
                        placeholder="Username"
                        startContent={<TbSignature />}
                    />
                </div>
            </div>

            <div className="mt-6">
                <Button className="bg-violet-700 text-white">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
