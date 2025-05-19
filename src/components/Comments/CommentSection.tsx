import React, { useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

interface Comment {
  id: number;
  treeId: string;
  nodeLeft: number;
  nodeRight: number;
  user: {
    id: string;
    userName: string;
    avatar: string;
  };
  content: string;
  replies?: Comment[]; // Nested replies
}

interface CommentComponentProps {
  idPost: number; // Post ID to fetch comments for
}

const CommentComponent: React.FC<CommentComponentProps> = ({ idPost }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<{ [key: number]: string }>({});
  const { account: user } = useSelector((state: State) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}`
        );
        const commentsData = response.data.result;
        const groupedComments = groupCommentsByTreeId(commentsData);
        setComments(groupedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [idPost]);

  const groupCommentsByTreeId = (comments: Comment[]) => {
    const grouped: { [key: string]: Comment[] } = {};

    comments.forEach((comment) => {
      if (!grouped[comment.treeId]) {
        grouped[comment.treeId] = [];
      }
      grouped[comment.treeId].push(comment);
    });

    Object.keys(grouped).forEach((treeId) => {
      grouped[treeId] = grouped[treeId].sort((a, b) => a.nodeLeft - b.nodeLeft);
    });

    return Object.values(grouped).flatMap((group) => {
      const rootComment = group[0];
      const replies = group.slice(1);
      rootComment.replies = replies;
      return rootComment;
    });
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}/post`,
          {
            content: newComment,
            treeId: null,
            parentId: null,
          }
        );
        setNewComment("");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}/blog`
        );
        const updatedComments = groupCommentsByTreeId(response.data.result);
        setComments(updatedComments);
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const handleAddReply = async (commentId: number, treeId: string) => {
    const replyContent = newReply[commentId];
    if (replyContent && replyContent.trim()) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}/post`,
          {
            content: replyContent,
            treeId,
            parentId: commentId,
          }
        );
        setNewReply((prev) => ({ ...prev, [commentId]: "" }));
        setReplyingTo(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}/blog`
        );
        const updatedComments = groupCommentsByTreeId(response.data.result);
        setComments(updatedComments);
      } catch (error) {
        console.error("Failed to add reply:", error);
      }
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent({ ...editContent, [comment.id]: comment.content });
  };

  const handleSaveEdit = async (commentId: number) => {
    const updatedContent = editContent[commentId];
    if (updatedContent.trim()) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${commentId}`,
          { content: updatedContent }
        );
        setEditingComment(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/comments/${idPost}/blog`
        );
        const updatedComments = groupCommentsByTreeId(response.data.result);
        setComments(updatedComments);
      } catch (error) {
        console.error("Failed to update comment:", error);
      }
    }
  };

  return (
    <div className="mt-8 bg-gray-50 container dark:bg-gray-900 ">
      <h3 className="text-lg font-semibold text-secondary border-b border-gray-300 pb-4">
        Bình luận bài viết
      </h3>
      <div className="mt-6 space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="space-y-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
          >
            <div className="flex items-start">
              {comment.user.avatar ? (
                <img
                  src={comment.user.avatar || "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"}
                  alt={`${comment.user.userName}'s avatar`}
                  className="w-10 h-10 rounded-full mr-4"
                />
              ) : (
                <FaUserCircle className="text-3xl text-primary mr-4" />
              )}

              <div className="flex-grow">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {comment.user.userName}
                </p>

                {editingComment === comment.id ? (
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={editContent[comment.id] || ""}
                      onChange={(e) =>
                        setEditContent({
                          ...editContent,
                          [comment.id]: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg p-2 flex-grow dark:bg-gray-700 dark:text-white mr-2"
                    />
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-150"
                    >
                      <IoIosSend size={20} />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {comment.content}
                  </p>
                )}

                {/* Reply Section */}
                <div className="ml-12 mt-4">
                  {comment.replies?.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex items-start mt-2 space-x-4"
                    >
                      <img
                        src={reply.user.avatar || "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"}
                        alt={`${reply.user.userName}'s avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {reply.user.userName}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons (Reply/Edit) */}
                <div className="flex items-center mt-3 space-x-4">
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }
                    className="text-primary hover:underline"
                  >
                    Trả lời
                  </button>

                  {replyingTo === comment.id && (
                    <div className="flex items-center ml-3">
                      <input
                        type="text"
                        value={newReply[comment.id] || ""}
                        onChange={(e) =>
                          setNewReply({
                            ...newReply,
                            [comment.id]: e.target.value,
                          })
                        }
                        placeholder="Viết trả lời..."
                        className="border border-gray-300 rounded-lg p-2 flex-grow dark:bg-gray-700 dark:text-white mr-2"
                      />
                      <button
                        onClick={() =>
                          handleAddReply(comment.id, comment.treeId)
                        }
                        className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-150"
                      >
                        <IoIosSend size={20} />
                      </button>
                    </div>
                  )}

                  {user?.id === comment.user.id && (
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="text-blue-500 hover:underline"
                    >
                      Sửa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add new comment */}
        <div className="flex items-center mt-6">
          {user && (
            <>
              {user?.avatar ? (
                <div className="w-10 h-10 mr-4 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    src={user.avatar || "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <FaUserCircle size={50} className="mr-4" />
              )}
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận"
                className="border border-gray-300 rounded-lg p-2 flex-grow dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddComment}
                className="ml-2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-150"
              >
                <IoIosSend size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
