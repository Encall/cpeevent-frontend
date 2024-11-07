import type { PostEventProps } from '@/types/index';

import { IoAdd } from 'react-icons/io5';
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    Image,
    Button,
    Input,
    Select,
    SelectItem,
    Kbd,
    useDisclosure,
    Modal,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';

import { SearchIcon } from '../icons';

import CreatePostModal from './createPost/createPostModal.tsx';

import voteImage from '@/images/Vote.png';
import formImage from '@/images/Form.png';
import postImage from '@/images/Post.png';
import pollImage from '@/images/Poll.png';

export default function AllPostEvent({ posts }: { posts: PostEventProps[] }) {
    const [sortedEvents, setSortedPosts] = useState<PostEventProps[]>(posts);
    // const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');

    const [filterOption, setFilterOption] = useState<string>('all');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    // const sortEvents = (option: string) => {
    //     let sortedArray = [...posts];

    //     switch (option) {
    //         case 'DateASC':
    //             sortedArray.sort((a, b) => {
    //                 const dateComparison =
    //                     new Date(a.postDate).getTime() -
    //                     new Date(b.postDate).getTime();

    //                 if (dateComparison !== 0) return dateComparison;

    //                 return a.title.localeCompare(b.title);
    //             });
    //             break;
    //         case 'DateDSC':
    //             sortedArray.sort((a, b) => {
    //                 const dateComparison =
    //                     new Date(b.postDate).getTime() -
    //                     new Date(a.postDate).getTime();

    //                 if (dateComparison !== 0) return dateComparison;

    //                 return b.title.localeCompare(a.title);
    //             });
    //             break;
    //         case 'NameASC':
    //             sortedArray.sort((a, b) => a.title.localeCompare(b.title));
    //             break;
    //         case 'NameDSC':
    //             sortedArray.sort((a, b) => b.title.localeCompare(a.title));
    //             break;
    //         default:
    //             break;
    //     }
    //     setSortedPosts(sortedArray);
    // };

    // useEffect(() => {
    //     sortEvents(sortOption);
    // }, [sortOption, posts]);

    useEffect(() => {
        const filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchInput.toLowerCase()),
        );

        setSortedPosts(filteredPosts);
    }, [searchInput, posts]);

    useEffect(() => {
        filterEvents(filterOption);
    }, [filterOption, posts]);

    const displayPostStatus = (kind: string) => {
        switch (kind) {
            case 'poll':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-green-500" />
                        <span className="text-zinc-600 text-sm font-semibold">
                            Poll
                        </span>
                    </span>
                );
            case 'post':
                return (
                    <span className="flex flex-row ">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-violet-700" />
                        <span className="text-violet-700 text-sm font-semibold">
                            Post
                        </span>
                    </span>
                );
            case 'vote':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-yellow-400" />
                        <span className="text-yellow-500 text-sm font-semibold">
                            Vote
                        </span>
                    </span>
                );
            case 'form':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-blue-500" />
                        <span className="text-zinc-600 text-sm font-medium">
                            Form
                        </span>
                    </span>
                );
            default:
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-gray-500" />
                        <span className="text-gray-500 text-sm">
                            Not specified
                        </span>
                    </span>
                );
        }
    };

    const getBackgroundImage = (kind: string) => {
        switch (kind) {
            case 'vote':
                return voteImage;
            case 'form':
                return formImage;
            case 'post':
                return postImage;
            case 'poll':
                return pollImage;
            default:
                return '';
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime() + 7 * 60 * 60 * 1000;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            if (diffHours === 0) {
                return `${diffMinutes} minutes ago`;
            }

            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays === -1) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString();
        }
    };

    const filterEvents = (option: string) => {
        let filteredArray = [...posts];

        switch (option) {
            case 'poll':
                filteredArray = posts.filter((post) => post.kind === 'poll');
                break;
            case 'vote':
                filteredArray = posts.filter((post) => post.kind === 'vote');
                break;
            case 'post':
                filteredArray = posts.filter((post) => post.kind === 'post');
                break;
            case 'form':
                filteredArray = posts.filter((post) => post.kind === 'form');
                break;
            default:
                break;
        }

        setSortedPosts(filteredArray);
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 my-8 items-center ">
                <div className="flex content-center w-8/12 mx-auto">
                    <div className="mr-1 mt-2 items-center text-sm text-zinc-600 font-bold">
                        Filter
                    </div>
                    <div className="flex justify-center w-3/4 mx-auto">
                        <Select
                            disallowEmptySelection
                            isRequired
                            aria-label="Filter"
                            className="max-w-xs"
                            style={{ backgroundColor: '#DED1FF' }}
                            variant="bordered"
                            onChange={(e) =>
                                setFilterOption(e.target.value as string)
                            }
                        >
                            <SelectItem key="all" value="all">
                                All
                            </SelectItem>
                            <SelectItem key="poll" value="poll">
                                Poll
                            </SelectItem>
                            <SelectItem key="vote" value="vote">
                                Vote
                            </SelectItem>
                            <SelectItem key="post" value="post">
                                Post
                            </SelectItem>
                            <SelectItem key="form" value="form">
                                Form
                            </SelectItem>
                        </Select>
                    </div>
                </div>
                {/* Search bar */}
                <div className="flex justify-center items-center content-center">
                    <Input
                        aria-label="Search"
                        classNames={{
                            inputWrapper: 'bg-white shadow-lg w-4/5 mx-auto',
                            input: 'text-sm',
                        }}
                        endContent={
                            <Kbd
                                className="hidden lg:inline-block"
                                keys={['command']}
                            >
                                K
                            </Kbd>
                        }
                        labelPlacement="outside"
                        placeholder="Search"
                        startContent={
                            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        type="search"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Sort by */}
                <div className="flex content-center w-8/12 mx-auto">
                    <div className="w-1/4 mr-4 mt-2 items-center text-sm text-zinc-600 font-bold">
                        Sort by
                    </div>
                    <Select
                        disallowEmptySelection
                        isRequired
                        aria-label="Sort by"
                        className="max-w-xs"
                        // selectedKeys={[sortOption]}
                        style={{
                            boxShadow: '0 8px 10px rgba(82, 82, 91, 0.1)',
                        }}
                        variant="bordered"
                        // onChange={(e) =>
                        //     // setSortOption(e.target.value as string)
                        // }
                    >
                        <SelectItem key="all" value="all">
                            All
                        </SelectItem>
                        <SelectItem key="poll" value="poll">
                            Poll
                        </SelectItem>
                        <SelectItem key="vote" value="vote">
                            Vote
                        </SelectItem>
                        <SelectItem key="post" value="post">
                            Post
                        </SelectItem>
                        <SelectItem key="form" value="form">
                            Form
                        </SelectItem>

                        <SelectItem key="divider" isDisabled>
                            ──────────────────
                        </SelectItem>

                        {/* <SelectItem key="datepostASC" value="datepostASC">
                            Date Post (Ascending)
                        </SelectItem>
                        <SelectItem key="datepostDSC" value="datepostDSC">
                            Date Post (Descending)
                        </SelectItem> */}
                    </Select>
                </div>
            </div>

            {/* card */}
            <div className="max-w-full gap-6 grid grid-cols-12 grid-rows-2 px-8 my-8">
                <Card
                    className="col-span-12 sm:col-span-4 h-[300px]"
                    style={{ backgroundColor: '#efefef' }}
                >
                    <Button
                        className="flex flex-col w-full h-full justify-center items-center text-xl bg-transparent"
                        onPress={onOpen}
                    >
                        <IoAdd className="text-6xl" />
                        Add new post
                    </Button>
                    <Modal
                        isOpen={isOpen}
                        scrollBehavior="outside"
                        size="lg"
                        onOpenChange={onOpenChange}
                    >
                        <CreatePostModal />
                    </Modal>
                </Card>
                {sortedEvents.map((post) => (
                    <Card
                        key={post._id}
                        className="col-span-12 sm:col-span-4 h-[300px]"
                    >
                        <CardHeader className="absolute z-10 top-1 flex-col items-start">
                            <div className="flex flex-row w-full">
                                <p className="flex items-center px-2 py-1 ">
                                    {displayPostStatus(post.kind)}
                                </p>
                                <p className="w-7/12" />
                                <p className="flex text-zinc-600 text-tiny items-center">
                                    {formatDate(post.postDate)}
                                </p>
                            </div>
                            <div className="flex flex-row w-full">
                                <h4 className="text-zinc-600 font-bold text-large w-full">
                                    {post.title}
                                </h4>
                                <p className="flex  text-sm bg-gray-50 text-rose-600 px-1 h-6 items-center rounded-lg">
                                    {post.assignTo}
                                </p>
                            </div>
                            <p className="text-tiny text-zinc-600/80">
                                {post.description}
                            </p>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover"
                            src={getBackgroundImage(post.kind)}
                        />
                        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                            <div>
                                <p className="text-black text-tiny">
                                    End Date:{' '}
                                    {post.endDate
                                        ? new Date(post.endDate) >= new Date() // Check if end date is in the future
                                            ? formatDate(post.endDate)
                                            : 'Ended'
                                        : 'Uncertain'}
                                </p>
                            </div>
                            <Button
                                className="text-tiny"
                                color="primary"
                                radius="full"
                                size="sm"
                            >
                                Learn More
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
