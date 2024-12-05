import type { PostEventProps, Event } from '@/types/index';

import { IoAdd } from 'react-icons/io5';
import { useState, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Kbd,
    useDisclosure,
    Modal,
    Divider,
    CardBody,
    Chip,
    Skeleton,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { IoFilter } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { SearchIcon } from '../icons.tsx';

import CreatePostModal from './createPost/createPostModal.tsx';
import EditPost from './editPost.tsx';

import voteImage from '@/images/Vote.png';
import formImage from '@/images/Form.png';
import postImage from '@/images/Post.png';
import { axiosAPIInstance } from '@/api/axios-config';
import { AuthContext } from '@/context/AuthContext.ts';

const selectItems = [
    { key: 'all', value: 'all', label: 'All' },
    { key: 'vote', value: 'vote', label: 'Vote' },
    { key: 'post', value: 'post', label: 'Post' },
    { key: 'form', value: 'form', label: 'Form' },
];

export default function AllPostEvent() {
    const { user, access } = useContext(AuthContext);
    const { eventid } = useParams<{ eventid: string }>();
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/${eventid}/posts`,
        );

        return response.data.data;
    };

    const {
        data: posts = [],
        isLoading,
        isError,
        error,
    } = useQuery<PostEventProps[]>({
        queryKey: ['posts', eventid, refreshKey],
        queryFn: fetchPosts,
    });

    if (isError) {
        toast.error(error.message);
    }

    const fetchEventByEventID = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/getEvent/${eventid}`,
        );

        return response.data.data;
    };

    const { data: currentEvent = {} as Event } = useQuery<Event>({
        queryKey: ['currentEvent'],
        queryFn: fetchEventByEventID,
    });

    const [isStaff, setIsStaff] = useState<boolean>(false);

    useEffect(() => {
        if (currentEvent.staff) {
            setIsStaff(
                currentEvent.staff.some((staff) => staff.stdID === user),
            );
        }
    }, [currentEvent]);

    const [searchInput, setSearchInput] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [sortedAndSearchEvents, setSortedAndSearchEvents] = useState<
        PostEventProps[]
    >([]);
    const [filterOption, setFilterOption] = useState<string>('all');
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const { user, access } = useContext(AuthContext);

    useEffect(() => {
        setSortedAndSearchEvents(
            sortedAndSearchEventsFunc(sortOption, searchInput, filterOption),
        );
    }, [sortOption, searchInput, filterOption, posts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    function sortedAndSearchEventsFunc(
        option: string,
        searchTerm: string,
        filter: string,
    ): PostEventProps[] {
        let newSortedArray = Array.isArray(posts) ? [...posts] : [];

        switch (option) {
            case 'DateASC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(a.postDate).getTime() -
                        new Date(b.postDate).getTime();

                    return dateComparison;
                });
                break;
            case 'DateDSC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(b.postDate).getTime() -
                        new Date(a.postDate).getTime();

                    return dateComparison;
                });
                break;
            case 'NameASC':
                newSortedArray.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'NameDSC':
                newSortedArray.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                break;
        }

        if (filter !== 'all') {
            newSortedArray = newSortedArray.filter(
                (post) => post.kind === filter,
            );
        }

        return newSortedArray.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    const displayPostStatus = (kind: string) => {
        switch (kind) {
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
                        <span className="text-blue-500 text-sm font-semibold">
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
            default:
                return '';
        }
    };

    function diffDateVal(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime() + 7 * 60 * 60 * 1000;

        return diff;
    }

    const formatDate = (dateString: string, Kinddate: string) => {
        let date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime() + 7 * 60 * 60 * 1000;
        let diffMinutes = diff / (1000 * 60);
        let diffHours = diff / (1000 * 60 * 60);
        let diffDays = diff / (1000 * 60 * 60 * 24);

        if (diffMinutes < 0 && diffMinutes > -1) {
            diffMinutes = 0;
        } else {
            diffMinutes = Math.floor(diffMinutes);
        }

        if (diffHours < 0 && diffHours > -1) {
            diffHours = 0;
        } else {
            diffHours = Math.floor(diffHours);
        }

        if (diffDays < 0 && diffDays > -1) {
            diffDays = 0;
        } else {
            diffDays = Math.floor(diffDays);
        }

        if (diff > 0 && Kinddate === 'end') {
            return 'Ended';
        }

        if (diffDays === 0) {
            if (diffHours === 0) {
                if (diffMinutes < 0) {
                    diffMinutes = -diffMinutes;
                }

                return `${diffMinutes} minutes`;
            }
            if (diffHours < 0) {
                diffHours = -diffHours;
            }

            return `${diffHours} hours`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays === -2) {
            return 'Tomorrow';
        } else {
            date = new Date(date.getTime() - 7 * 60 * 60 * 1000);

            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }
    };

    const onPostChange = () => {
        setRefreshKey((oldKey) => oldKey + 1);
    };

    return (
        <div className="w-full ">
            <div className="grid grid-cols-4 gap-4 mt-4 items-center px-8  ">
                {/* Search bar */}
                <div className="flex justify-center items-center content-center">
                    <Input
                        aria-label="Search"
                        classNames={{
                            inputWrapper: 'bg-white shadow-lg mx-auto',
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
                {/* Filter */}
                <div className="flex col-start-3">
                    <div className="flex flex-row mr-4 ">
                        <div className="flex mr-2 items-center text-sm text-zinc-600 font-bold">
                            Filter
                        </div>
                        <div className="content-center">
                            <IoFilter className="flex" />
                        </div>
                    </div>
                    <div className="flex justify-center w-3/4 mx-auto">
                        <Select
                            disallowEmptySelection
                            isRequired
                            aria-label="Filter"
                            className="max-w-xs"
                            defaultSelectedKeys={[filterOption]}
                            selectedKeys={[filterOption]}
                            style={{ backgroundColor: '#DED1FF' }}
                            variant="bordered"
                            onChange={(e) =>
                                setFilterOption(e.target.value as string)
                            }
                        >
                            {selectItems.map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
                {/* Sort by */}
                <div className="flex items-center">
                    <div className="w-1/4 mr-4 items-center text-sm text-zinc-600 font-bold">
                        Sort by
                    </div>
                    <Select
                        disallowEmptySelection
                        isRequired
                        aria-label="Sort by"
                        className="max-w-xs"
                        selectedKeys={[sortOption]}
                        style={{
                            boxShadow: '0 8px 10px rgba(82, 82, 91, 0.1)',
                        }}
                        variant="bordered"
                        onChange={(e) =>
                            setSortOption(e.target.value as string)
                        }
                    >
                        <SelectItem key="DateDSC" value="DateDSC">
                            Date ( Descending )
                        </SelectItem>
                        <SelectItem key="DateASC" value="DateASC">
                            Date ( Ascending )
                        </SelectItem>
                        <SelectItem key="NameASC" value="NameASC">
                            Name ( A-Z )
                        </SelectItem>
                        <SelectItem key="NameDSC" value="NameDSC">
                            Name ( Z-A )
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <Skeleton isLoaded={!isLoading}>
                <div className="max-w-full gap-6 grid grid-cols-12 px-8 my-8">
                    {isStaff ||
                    (parseInt(access) === 2 &&
                        user === currentEvent.president) ||
                    parseInt(access) > 2 ? (
                        <Card
                            className="col-span-12 sm:col-span-4 w-full min-h-[369px]"
                            style={{ backgroundColor: '#efefef' }}
                        >
                            <Button
                                className="flex flex-col w-full h-full justify-center items-center text-xl bg-transparent"
                                onPress={onOpen}
                            >
                                <div className="flex rounded-full bg-violet-500">
                                    <IoAdd className="text-6xl text-slate-200" />
                                </div>
                                <div className="text-zinc-600">
                                    Add new post
                                </div>
                            </Button>
                            <Modal
                                isOpen={isOpen}
                                scrollBehavior="outside"
                                size="lg"
                                onOpenChange={onOpenChange}
                            >
                                <CreatePostModal
                                    onOpenChange={onOpenChange}
                                    onPostChange={onPostChange}
                                />
                            </Modal>
                        </Card>
                    ) : null}
                    {sortedAndSearchEvents.length > 0 &&
                        sortedAndSearchEvents.map((post) => {
                            return (
                                <Card
                                    key={post._id}
                                    isPressable
                                    className="col-span-12 sm:col-span-4 w-full"
                                    onPress={() => {
                                        post.kind === 'post'
                                            ? navigate(
                                                  `/workspace/${eventid}/post/${post._id}`,
                                              )
                                            : post.kind === 'vote'
                                            ? navigate(
                                                  `/workspace/${eventid}/vote/${post._id}`,
                                              )
                                            : navigate(
                                                  `/workspace/${eventid}/form/${post._id}`,
                                              );
                                    }}
                                >
                                    <CardHeader className="flex flex-col bg-zinc-75  items-start">
                                        <div className="flex flex-row w-full justify-between mt-1 mb-1">
                                            <p className="flex items-center px-2">
                                                {displayPostStatus(post.kind)}
                                            </p>

                                            <p className="flex text-zinc-600 mr-4 font-semibold text-xs">
                                                {formatDate(
                                                    post.postDate,
                                                    'post',
                                                )}
                                            </p>
                                            {parseInt(access) === 3 || post.author === user ? (
                                                <EditPost
                                                event={currentEvent}
                                                post={post}
                                                onPostChange={onPostChange}
                                            />) : null}
                                        </div>
                                        <div className="mx-2.5 flex justify-start flex-wrap">
                                            {post.assignTo.map(
                                                (assignee, index) => (
                                                    <Chip
                                                        key={index}
                                                        className="mr-1 mb-1"
                                                        color={
                                                            assignee ===
                                                            'everyone'
                                                                ? 'danger'
                                                                : 'secondary'
                                                        }
                                                        variant="flat"
                                                    >
                                                        {assignee}
                                                    </Chip>
                                                ),
                                            )}
                                        </div>
                                    </CardHeader>
                                    <Divider className="bg-violet-100" />
                                    <CardBody
                                        className="min-h-72"
                                        style={{
                                            backgroundImage: `url(${getBackgroundImage(
                                                post.kind,
                                            )})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        <div className="flex flex-row w-full">
                                            <h4 className="text-zinc-600 font-bold text-large w-full">
                                                {post.title}
                                            </h4>
                                        </div>
                                        <p className="text-tiny text-zinc-600/80">
                                            {post.description}
                                        </p>
                                    </CardBody>
                                    <CardFooter className="absolute bg-white/50 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                                        <div>
                                            <p className="text-small text-zinc-600 font-bold">
                                                End Date:{' '}
                                                <span
                                                    className={
                                                        post.endDate &&
                                                        diffDateVal(
                                                            post.endDate,
                                                        ) > 0
                                                            ? 'text-rose-500'
                                                            : 'text-blue-500'
                                                    }
                                                >
                                                    {post.endDate
                                                        ? post.timeUp
                                                            ? 'Ended'
                                                            : formatDate(
                                                                  post.endDate,
                                                                  'end',
                                                              )
                                                        : 'No end date'}
                                                    !
                                                </span>
                                            </p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                </div>
            </Skeleton>
        </div>
    );
}
