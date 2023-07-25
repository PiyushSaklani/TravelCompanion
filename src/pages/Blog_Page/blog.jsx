import React, { useEffect, useState } from 'react';
import "../main-page/main_page.css";
import App_Bar from "../../components/appbar/appbar";
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await axios.post('/api/posts', { title, content });
      fetchPosts(); // Refresh the blog posts after creating a new one
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
        
      <h1>Blog</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
