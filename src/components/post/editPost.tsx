import type { PostEventProps } from '@/types';
import type { Event } from '@/types';

import {
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
    Modal,
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
import { LuMoreHorizontal } from 'react-icons/lu';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import { getLocalTimeZone, now } from '@internationalized/date';

import UpdatePost from './updatePost/updatePost.tsx';
import UpdateForm from './updatePost/updateForm.tsx';
import UpdateVote from './updatePost/updateVote.tsx';

import { AuthContext } from '@/context/AuthContext';
import { axiosAPIInstance } from '@/api/axios-config.ts';


export default function PostModal(post: PostEventProps) {


    const onEdit = () => {
        console.log('Edit post clicked 1 hello');
        if (post.kind == 'post') {

            // <UpdatePost />
            onOpen()
        }
        else if (post.kind == 'form') {
            // <UpdateForm />
            onOpen()

        }
        else if (post.kind == 'vote') {
            // <UpdateVote />
            onOpen()
        }

        console.log('Edit post clicked 2');
    };

    const onDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost();
        }
    };

    const { user } = useContext(AuthContext);
    const location = useLocation();

    const { isOpen, onOpenChange, onOpen } = useDisclosure();

    const { event, existingPost } = location.state as {
        event: Event;
        existingPost?: PostEventProps;
    };

    const [disableEndDate, setDisableEndDate] = useState<boolean>(
        !existingPost?.endDate
    );
    const [markdown, setMarkdown] = useState<string>(existingPost?.markdown || post.markdown || '');

    const [voteQuestions, setVoteQuestions] = useState(
        existingPost?.voteQuestions || post.voteQuestions ||
        { question: 'post.question', options: [] }
    );

    const [formQuestions, setFormQuestions] = useState(
        existingPost?.formQuestions || post.formQuestions || []
    );


    const [postDetails, setPostDetails] = useState<PostEventProps>({
        kind: existingPost?.kind || post.kind,
        assignTo: existingPost?.assignTo || (Array.isArray(post.assignTo) ? post.assignTo : [post.assignTo]),
        title: existingPost?.title || post.title,
        description: existingPost?.description || post.description,
        public: existingPost?.public || false,
        postDate: existingPost?.postDate || new Date().toISOString(),
        endDate: existingPost?.endDate || null,
        author: existingPost?.author || (user as string),
        markdown: existingPost?.markdown || post.markdown,
        formQuestions: existingPost?.formQuestions || post.formQuestions || [],
        voteQuestions: existingPost?.voteQuestions || post.voteQuestions || { question: 'post.question', options: [] },
        _id: existingPost?._id || post._id, // Fixed here
    });

    useMemo(() => {
        setPostDetails({
            ...postDetails,
            voteQuestions: voteQuestions
        })
        console.log('debug', postDetails);
    }, [voteQuestions]);


    useMemo(() => {
        setPostDetails({
            ...postDetails,
            formQuestions: formQuestions
        })
        console.log('debug', postDetails);
    }, [formQuestions]);



    useEffect(() => {
        if (event && event.role && !event.role.includes('everyone')) {
            event.role.push('everyone');
        }
    }, [event]);

    function checkDateValidation(startDate: string, endDate: string) {
        return new Date(endDate) < new Date(startDate);
    }

    async function savePostToAPI(updatedPost: PostEventProps) {


        const finalPayload = {
            data: { ...updatedPost, postID: updatedPost._id },
        };

        console.log('postID', finalPayload.data.postID);
        console.log('finalPayload', finalPayload);
        try {
            const response = await axiosAPIInstance.patch('v1/posts/update', finalPayload.data);
            console.log(
                `${existingPost ? 'Post updated' : 'Post created'} successfully:`,
                response.data
            );
            alert(`${existingPost ? 'Updated' : 'Created'} successfully!`);
        } catch (error) {
            console.error(
                `Error ${existingPost ? 'updating' : 'creating'} post:`,
                error
            );
            alert(`Failed to ${existingPost ? 'update' : 'create'} post.`);
        } finally {
            window.location.reload();
        }
    }

    async function deletePost() {
        const eventID = window.location.pathname.split('/')[2];
        const postID = existingPost?._id || post._id; // Fixed here

        if (!postID) {
            console.error('Cannot delete: No post ID provided.');
            alert('Error: No post ID provided.');
            return;
        }
        try {
            const response = await axiosAPIInstance.delete(
                'v1/posts/delete', {
                data: {
                    eventID,
                    postID,
                },
            });

            console.log('Post deleted successfully:', response.data);
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post.');
        } finally {
            window.location.reload();
        }
    }

    function completePost(kind: string) {
        let updatedPost = {
            ...postDetails,
            postDate: new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString(),
        };

        if (postDetails.public) {
            updatedPost.assignTo = [];
        }

        if (updatedPost.endDate) {
            updatedPost.endDate = new Date(
                new Date(updatedPost.endDate).getTime() + 7 * 60 * 60 * 1000
            ).toISOString();
        }

        switch (kind) {
            case 'post':
                updatedPost.markdown = markdown;
                delete updatedPost.voteQuestions;
                delete updatedPost.formQuestions;
                break;
            case 'vote':
                updatedPost.voteQuestions = voteQuestions;
                delete updatedPost.markdown;
                delete updatedPost.formQuestions;
                break;
            case 'form':
                updatedPost.formQuestions = formQuestions;
                delete updatedPost.markdown;
                delete updatedPost.voteQuestions;
                break;
            default:
                // Handle unsupported kind
                throw new Error(`Unsupported kind: ${kind}`);
        }

        savePostToAPI(updatedPost);
    }


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
                <ModalContent>
                    {(onClose) => (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                completePost(postDetails.kind);
                            }}
                        >
                            <ModalHeader className="flex flex-col gap-1">
                                {existingPost ? 'Edit Post' : 'Edit Post'}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    className="pr-1"
                                    errorMessage="This field is required"
                                    label="Post name"
                                    type="text"
                                    validationBehavior="native"
                                    defaultValue={postDetails.title}
                                    onChange={(e) =>
                                        setPostDetails({
                                            ...postDetails,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    errorMessage="This field is required"
                                    label='Post description'
                                    type="text"
                                    validationBehavior="native"
                                    defaultValue={postDetails.description}
                                    onChange={(e) =>
                                        setPostDetails({
                                            ...postDetails,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                <div className="flex flex-row">
                                    <Select
                                        className="pr-1 w-2/5"
                                        errorMessage="This field is required"
                                        label="Post Kind"
                                        selectedKeys={[postDetails.kind]}
                                        isDisabled={true}
                                        onChange={(e) =>
                                            setPostDetails({
                                                ...postDetails,
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
                                            className="pl-1"
                                            errorMessage="This field is required"
                                            label={"Assign To"}
                                            selectedKeys={postDetails.assignTo}
                                            selectionMode="multiple"
                                            onChange={(e) => {
                                                const selectedValues = Array.isArray(e.target.value)
                                                    ? e.target.value
                                                    : e.target.value.split(',').map((value) => value.trim());

                                                setPostDetails({
                                                    ...postDetails,
                                                    assignTo: selectedValues,
                                                });
                                            }}
                                        >
                                            {event.role && event.role.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Checkbox
                                            className="pl-4"
                                            color="default"
                                            defaultSelected={postDetails.public}
                                            size="sm"
                                            onChange={() => {
                                                setPostDetails({
                                                    ...postDetails,
                                                    public: !postDetails.public,
                                                });
                                            }}
                                        >
                                            Post as Public
                                        </Checkbox>
                                    </div>
                                </div>

                                {postDetails.kind === 'form' ? (
                                    <UpdateForm
                                        formQuestions={postDetails.formQuestions || []}
                                        setFormQuestions={setFormQuestions}
                                    />
                                ) : []}

                                {postDetails.kind === 'post' ? (
                                    <UpdatePost
                                        markdown={postDetails.markdown}
                                        setMarkdown={setMarkdown}
                                    />
                                ) : []}


                                {postDetails.kind === 'vote' ? (
                                    <UpdateVote
                                        voteQuestions={postDetails.voteQuestions || { question: '', options: [] }}
                                        setVoteQuestions={setVoteQuestions}
                                    />
                                ) : []}

                                <DatePicker
                                    hideTimeZone
                                    showMonthAndYearPickers
                                    className="pr-1"
                                    defaultValue={
                                        postDetails.endDate
                                            ? now(getLocalTimeZone()).set({
                                                year: new Date(postDetails.endDate).getFullYear(),
                                                month: new Date(postDetails.endDate).getMonth() + 1,
                                                day: new Date(postDetails.endDate).getDate(),
                                                hour: new Date(postDetails.endDate).getHours(),
                                                minute: new Date(postDetails.endDate).getMinutes(),
                                                second: new Date(postDetails.endDate).getSeconds(),
                                            })
                                            : now(getLocalTimeZone())
                                    }
                                    errorMessage="Date is invalid"
                                    hourCycle={24}
                                    isDisabled={!disableEndDate}
                                    isInvalid={
                                        postDetails.endDate
                                            ? checkDateValidation(
                                                postDetails.postDate,
                                                postDetails.endDate
                                            )
                                            : undefined
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
                                        setPostDetails({
                                            ...postDetails,
                                            endDate: isoDate,
                                        });
                                    }}
                                />
                                <Checkbox
                                    defaultSelected={!postDetails.endDate}
                                    className="pl-4 h-4"
                                    color="default"
                                    size="sm"
                                    onChange={() => {
                                        setDisableEndDate(!disableEndDate);
                                        setPostDetails({
                                            ...postDetails,
                                            endDate: disableEndDate
                                                ? null
                                                : new Date().toISOString(),
                                        });
                                    }}
                                >
                                    Disable End Date
                                </Checkbox>
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
                                    {existingPost ? 'Update Post' : 'Update Post'}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
            <Dropdown className="flex justify-end" >
                <DropdownTrigger>
                    <div
                        className="flex-col text-xl mr-2 text-zinc-600 cursor-pointer"
                        role="button"
                    >
                        <LuMoreHorizontal />
                    </div>
                </DropdownTrigger>

                <DropdownMenu>
                    <DropdownItem
                        key="edit"
                        className="text-primary"
                        onPress={onEdit}
                    >
                        Edit Post
                    </DropdownItem>

                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        onPress={onDelete}
                    >
                        Delete Post
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown >
        </>
    );
}