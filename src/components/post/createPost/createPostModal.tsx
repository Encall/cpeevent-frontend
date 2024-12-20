import type { PostEventProps } from '@/types';

import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Checkbox,
    DatePicker,
} from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLocalTimeZone, now } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import PostKindPost from './postKindPost';
import PostKindVote from './postKindVote';
import PostKindForm from './postKindForm';

import { AuthContext } from '@/context/AuthContext';
import { axiosAPIInstance } from '@/api/axios-config';

export default function CreatePostModal({
    onPostChange,
    onOpenChange,
}: {
    onPostChange: () => void;
    onOpenChange: () => void;
}) {
    const { user } = useContext(AuthContext);
    const { eventid } = useParams<{ eventid: string }>();
    const [disableEndDate, setDisableEndDate] = useState<boolean>(true);
    const [markdown, setMarkdown] = useState<string>('');
    const [voteQuestions, setVoteQuestions] = useState<{
        question: string;
        options: string[];
    }>({
        question: '', // Default question value
        options: [], // Default empty options array
    });
    const [formQuestions, setFormQuestions] = useState<
        {
            question: string;
            inputType: string;
            maxSel?: string;
            options: string[];
        }[]
    >([]);

    const fetchPostsRole = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/allRole/${eventid}`,
        );

        response.data.data.push('everyone');

        return response.data.data;
    };

    const { data: role = [] } = useQuery<string[]>({
        queryKey: ['role', eventid],
        queryFn: fetchPostsRole,
    });

    const [newPost, setNewPost] = useState<PostEventProps>({
        kind: 'post',
        assignTo: ['everyone'],
        title: '',
        description: '',
        public: false,
        postDate: new Date().toISOString(),
        endDate: null,
        author: user as string,
    });

    useEffect(() => {
        if (newPost.kind === 'form') {
            setVoteQuestions({
                question: '',
                options: [],
            });
            setMarkdown('');
            setDisableEndDate(false);
            setNewPost({
                ...newPost,
                endDate: new Date().toISOString(),
            });
        } else if (newPost.kind === 'post') {
            setVoteQuestions({
                question: '',
                options: [],
            });
            setFormQuestions([]);
        } else if (newPost.kind === 'vote') {
            setFormQuestions([]);
            setMarkdown('');
            setDisableEndDate(false);
            setNewPost({
                ...newPost,
                endDate: new Date().toISOString(),
            });
        }
    }, [newPost.kind]);

    function checkDateValidation(startDate: string, endDate: string) {
        if (new Date(endDate) < new Date(startDate)) {
            return true;
        }

        return false;
    }

    const createPostMutation = useMutation({
        mutationFn: async (updatedPost: PostEventProps) => {
            const eventid = window.location.pathname.split('/')[2];
            const finalPayload = {
                eventID: eventid,
                updatedPost: { ...updatedPost },
            };
            const response = await axiosAPIInstance.post(
                'v1/posts/create',
                finalPayload,
            );

            return response.data;
        },
        onSuccess: () => {
            toast.success('Post created successfully!');
            onPostChange();
            onOpenChange();
        },
        onError: () => {
            toast.error('Failed to create post.');
        },
    });

    async function postToAPI(updatedPost: PostEventProps) {
        createPostMutation.mutate(updatedPost);
    }

    function completePost(kind: string) {
        let updatedPost = { ...newPost, postDate: new Date().toISOString() };

        if (newPost.public) {
            updatedPost.assignTo = [];
        }

        updatedPost.postDate = new Date(
            new Date().getTime() + 7 * 60 * 60 * 1000,
        ).toISOString();

        if (updatedPost.endDate) {
            updatedPost.endDate = new Date(
                new Date(updatedPost.endDate).getTime() + 7 * 60 * 60 * 1000,
            ).toISOString();
        }

        if (kind === 'post') {
            updatedPost.markdown = markdown;
        } else if (kind === 'vote') {
            updatedPost.voteQuestions = voteQuestions;
        } else if (kind === 'form') {
            updatedPost.formQuestions = formQuestions;
        }

        if (updatedPost.assignTo.includes('everyone')) {
            updatedPost.assignTo = ['everyone'];
        }

        postToAPI(updatedPost);
    }

    return (
        <>
            <ModalContent>
                {(onClose) => (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            completePost(newPost.kind);
                        }}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Create New Post
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                className="pr-1"
                                errorMessage="This field is required"
                                label="Post Name"
                                type="Text"
                                validationBehavior="native"
                                onChange={(e) =>
                                    setNewPost({
                                        ...newPost,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Input
                                isRequired
                                errorMessage="This field is required"
                                label="Post Description"
                                type="text"
                                validationBehavior="native"
                                onChange={(e) =>
                                    setNewPost({
                                        ...newPost,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <div className="flex flex-row">
                                <Select
                                    isRequired
                                    className="pr-1 w-2/5"
                                    errorMessage="This field is required"
                                    isInvalid={newPost.kind === ''}
                                    label="Post Kind"
                                    selectedKeys={[newPost.kind]}
                                    onChange={(e) =>
                                        setNewPost({
                                            ...newPost,
                                            kind: e.target.value,
                                        })
                                    }
                                >
                                    <SelectItem key="form" value="form">
                                        Form
                                    </SelectItem>
                                    <SelectItem key="post" value="post">
                                        Post
                                    </SelectItem>
                                    <SelectItem key="vote" value="vote">
                                        Vote
                                    </SelectItem>
                                </Select>
                                <div className="flex flex-col w-full">
                                    <Select
                                        isRequired
                                        className="pl-1"
                                        errorMessage="This field is required"
                                        isDisabled={newPost.public}
                                        isInvalid={newPost.assignTo[0] === ''}
                                        label="Assign To"
                                        selectedKeys={newPost.assignTo.filter(
                                            (key) => role.includes(key),
                                        )}
                                        selectionMode="multiple"
                                        value={newPost.assignTo}
                                        onChange={(e) =>
                                            setNewPost({
                                                ...newPost,
                                                assignTo: Array.isArray(
                                                    e.target.value,
                                                )
                                                    ? e.target.value
                                                    : e.target.value
                                                          .split(',')
                                                          .map((value) =>
                                                              value.trim(),
                                                          ),
                                            })
                                        }
                                    >
                                        {role.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Checkbox
                                        className="pl-4"
                                        color="default"
                                        defaultSelected={newPost.public}
                                        size="sm"
                                        onChange={() => {
                                            setNewPost({
                                                ...newPost,
                                                public: !newPost.public,
                                            });
                                        }}
                                    >
                                        Post as Public
                                    </Checkbox>
                                </div>
                            </div>

                            {newPost.kind === 'form' ? (
                                <PostKindForm
                                    formQuestions={formQuestions}
                                    setFormQuestions={setFormQuestions}
                                />
                            ) : null}

                            {newPost.kind === 'post' ? (
                                <>
                                    <PostKindPost setMarkdown={setMarkdown} />
                                </>
                            ) : null}

                            {newPost.kind === 'vote' ? (
                                <PostKindVote
                                    setVoteQuestions={setVoteQuestions}
                                    voteQuestions={voteQuestions}
                                />
                            ) : null}
                            <DatePicker
                                hideTimeZone
                                showMonthAndYearPickers
                                className="pr-1"
                                defaultValue={now(getLocalTimeZone())}
                                errorMessage={'Date is invalid'}
                                hourCycle={24}
                                isDisabled={disableEndDate}
                                isInvalid={
                                    newPost.endDate &&
                                    checkDateValidation(
                                        newPost.postDate,
                                        newPost.endDate,
                                    )
                                        ? true
                                        : false
                                }
                                label="End Date"
                                onChange={(date) => {
                                    let isoDate = null;

                                    if (date && date.toDate) {
                                        const jsDate = date.toDate();

                                        if (!isNaN(jsDate.getTime())) {
                                            isoDate = jsDate.toISOString();
                                        }
                                    }
                                    setNewPost({
                                        ...newPost,
                                        endDate: isoDate,
                                    });
                                }}
                            />
                            <div className="flex flex-row items-center">
                                <Checkbox
                                    defaultSelected
                                    className="pl-4 h-4"
                                    color="default"
                                    isDisabled={
                                        newPost.kind === 'form' ||
                                        newPost.kind === 'vote'
                                    }
                                    isSelected={disableEndDate}
                                    size="sm"
                                    onChange={() => {
                                        setDisableEndDate(!disableEndDate);
                                        if (!disableEndDate) {
                                            setNewPost({
                                                ...newPost,
                                                endDate:
                                                    new Date().toISOString(),
                                            });
                                        } else {
                                            setNewPost({
                                                ...newPost,
                                                endDate: null,
                                            });
                                        }
                                    }}
                                >
                                    <div>Disable End Date</div>
                                </Checkbox>
                                {newPost.kind !== 'post' ? (
                                    newPost.kind !== 'form' ? (
                                        <div className="ml-1 text-red-500 text-xs">
                                            ( Vote must have end date )
                                        </div>
                                    ) : (
                                        <div className="ml-1 text-red-500 text-xs">
                                            ( Form must have end date )
                                        </div>
                                    )
                                ) : (
                                    <></>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-violet-700 text-white"
                                type="submit"
                            >
                                Create Post
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </>
    );
}
