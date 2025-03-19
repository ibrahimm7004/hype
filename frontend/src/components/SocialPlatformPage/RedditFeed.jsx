import React, { useEffect, useState } from "react";
import RedditFeedPost from "./RedditFeedPost";
import fetchData from "../../utils/fetchData";

const RedditFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        let storedPosts = localStorage.getItem("posts");

        if (storedPosts) {
          storedPosts = JSON.parse(storedPosts);
        } else {
          const response = await fetchData(
            `/reddit/posts?user_id=${user_id}`,
            "GET"
          );
          storedPosts = response.data?.data || [];
          localStorage.setItem("posts", JSON.stringify(storedPosts));
        }

        if (Array.isArray(storedPosts.children)) {
          console.log(storedPosts.children);
          setPosts(storedPosts.children);
        }
      } catch (error) {
        console.error("Error fetching Reddit posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      {posts.length > 0 ? (
        posts.map((post) => (
          <RedditFeedPost key={post.data.id} post={post.data} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No posts available.</p>
      )}
    </div>
  );
};

export default RedditFeed;
