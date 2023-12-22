import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ajax, ajax_or_login } from '../../ajax';
import { useAuth } from "../../hooks/useAuth";



interface Comment {
  id: number;
  rating: number;
  user: number;
  body: string;
  created_at: string;
  object_id: number;
  content_type: number;
}

const ShelterReview = () => {
  const { shelterId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentRating, setNewCommentRating] = useState(1);
  const [newCommentBody, setNewCommentBody] = useState<string>('');
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState("");
  const [createError, setCreateError] = useState("");

  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState(0);
  const [userInfoError, setUserInfoError] = useState("");

  const { user }= useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);
  const query = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '1', 10)
}), [searchParams]);

  useEffect(() => {
    // Fetch comments or conversation history
    fetchComments();

  }, [shelterId, query]);

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
    const {page} = query;
    ajax(`/comments/shelters/${shelterId}/all/?page=${page}`, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((json) => {
        setComments(json.results);
        setCount(json.count);
      })
      .catch(error => setFetchError(error));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform the POST request to add a new comment
    ajax_or_login(`/comments/shelters/${shelterId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: newCommentBody, rating: newCommentRating }),
    }, navigate)
      .then(response => {
        if (response.ok) {
          setNewCommentBody('');
          setNewCommentRating(1);
          fetchComments(); // Refresh comments after adding a new comment
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => setCreateError(error));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({page: newPage.toString()});
};

  return (
    <div className="container mx-auto mt-8 max-w-5xl pt-16">
      <h2 className="text-3xl font-bold pb-4">Comments</h2>
      <div className="mb-4">
        {[...comments].reverse().map(comment => (
          <div key={comment.id} className='p-2 mb-2 border-4 border-l-indigo-500'>
            {
                comment.rating === 1
                ?
                <p>★☆☆☆☆</p>
                :
                comment.rating===2
                ?
                <p>★★☆☆☆</p>
                :
                comment.rating===3
                ?
                <p>★★★☆☆</p>
                :
                comment.rating===4
                ?
                <p>★★★★☆</p>
                :
                comment.rating===5
                ?
                <p>★★★★★</p>
                :
                ''
            }
            <p>{comment.body}</p>
            <p className="text-xs text-gray-500">{(new Date(comment.created_at)).toLocaleString()}</p>
          </div>
        ))}
        <p>{fetchError}</p>
        <div className='flex gap-2 justify-end' >
                    {(query.page >= (count / 5) )?<button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page + 1)} disabled={true}>Prev</button>:<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page + 1)}>Prev</button>}
                    {query.page===1? <button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Next</button> :<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={query.page === 1}>Next</button>}
                </div>
      </div>

      <form onSubmit={handleCommentSubmit} >
        <label className="block font-medium text-gray-700">New Comment:</label>
        <span>Rate: </span>
        <select
                       value={newCommentRating}
                       onChange={(e) => {
                          setNewCommentRating(parseInt(e.target.value));
                       }}
                    >
                       <option value="1">1</option>
                       <option value="2">2</option>
                       <option value="3">3</option>
                       <option value="4">4</option>
                       <option value="5">5</option>
                    </select>
        <textarea
          value={newCommentBody}
          onChange={e => setNewCommentBody(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          rows={4}
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded font-bold  ">
          Send
        </button>
        <p>{createError}</p>
      </form>
    </div>
  );
};

export default ShelterReview;