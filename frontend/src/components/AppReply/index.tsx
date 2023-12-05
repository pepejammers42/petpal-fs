import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ajax } from '../../ajax';

interface AppReplyProps {}

interface Comment {
  id: number;
  user: number;
  body: string;
  created_at: string;
  object_id: number;
  content_type: number;
}

const AppReply: React.FC<AppReplyProps> = () => {
  const { appId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    // Fetch comments or conversation history
    fetchComments();
  }, [appId]);

  const fetchComments = () => {
    ajax(`/comments/applications/${appId}/all/`, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((json: Comment[]) => {
        setComments(json);
      })
      .catch(error => console.error('Error fetching comments:', error));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform the POST request to add a new comment
    ajax(`/comments/applications/${appId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: newComment }),
    })
      .then(response => {
        if (response.ok) {
          setNewComment('');
          fetchComments(); // Refresh comments after adding a new comment
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => console.error('Error submitting comment:', error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="border p-2 mb-2">
            <p className="font-bold">{comment.user}</p>
            <p>{comment.body}</p>
            <p className="text-xs text-gray-500">{comment.created_at}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommentSubmit}>
        <label className="block text-sm font-medium text-gray-700">New Comment:</label>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          rows={4}
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default AppReply;