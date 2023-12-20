import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ajax_or_login } from '../../ajax';
import { useAuth } from "../../hooks/useAuth";

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
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState("");
  const [createError, setCreateError] = useState("");
  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState(0);
  const [userInfoError, setUserInfoError] = useState("");
  const { user }= useAuth();

  useEffect(() => {
    // Fetch comments or conversation history
    fetchComments();

  }, [appId]);

  useEffect(() => {
    try {
      let usertype = localStorage.getItem("user");
      const userid = localStorage.getItem("userID");
      if (!usertype || !userid){
        return ;
      }
      setUserType(usertype);
      setUserID(parseInt(userid ?? "", 10));
    } catch (error) {
      setUserInfoError("failed to get user information: " + error);
    }


  }, [user]);

  const fetchComments = () => {
    ajax_or_login(`/comments/applications/${appId}/all/`, { method: 'GET' }, navigate)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((json) => {
        setComments(json.results);
      })
      .catch(error => setFetchError(error));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform the POST request to add a new comment
    ajax_or_login(`/comments/applications/${appId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: newComment }),
    }, navigate)
      .then(response => {
        if (response.ok) {
          setNewComment('');
          fetchComments(); // Refresh comments after adding a new comment
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => setCreateError(error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-4">
        {[...comments].reverse().map(comment => (
          <div key={comment.id} className={`p-2 mb-2 ${userID === comment.user ? 'border-4 border-indigo-200 border-l-indigo-500' : 'border-4 border-orange-200 border-l-orange-500'}`}>
            <p className="font-bold">{userID===comment.user ? userType : (userType==="seeker"?"shelter":"seeker")}</p>
            <p>{comment.body}</p>
            <p className="text-xs text-gray-500">{(new Date(comment.created_at)).toLocaleString()}</p>
          </div>
        ))}
        <p>{fetchError}</p>
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
        <p>{createError}</p>
      </form>
    </div>
  );
};

export default AppReply;