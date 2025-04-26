import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";
import ScheduledPostCard from "./ScheduledPostCard";

const ScheduledPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchAllScheduledPosts();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.from(".post-card", {
        opacity: 1,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
      });
    }
  }, [loading, posts]);

  const fetchAllScheduledPosts = async () => {
    try {
      setLoading(true);
      const endpoints = [
        {
          platform: "twitter",
          url: `/twitter/scheduled-tweets?user_id=${userId}`,
        },
        {
          platform: "facebook",
          url: `/meta/facebook/scheduled-facebook-posts?user_id=${userId}`,
        },
        {
          platform: "instagram",
          url: `/meta/instagram/scheduled-instagram-posts?user_id=${userId}`,
        },
        {
          platform: "reddit",
          url: `/reddit/scheduled-reddit-posts?user_id=${userId}`,
        },
      ];

      const fetchPromises = endpoints.map((endpoint) =>
        fetchData(endpoint.url).then((res) => ({
          platform: endpoint.platform,
          data: res.data,
        }))
      );

      const results = await Promise.all(fetchPromises);
      const combinedPosts = results.flatMap((result) => {
        const key = Object.keys(result.data)[0];
        return (
          result.data[key]?.map((post) => ({
            ...post,
            platform: result.platform,
          })) || []
        );
      });

      setPosts(combinedPosts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const statusMatch =
      filterStatus === "all"
        ? true
        : filterStatus === "posted"
        ? post.posted
        : !post.posted;

    const platformMatch =
      filterPlatform === "all" ? true : post.platform === filterPlatform;

    return statusMatch && platformMatch;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-700">
        📅 Scheduled Posts
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="flex gap-6">
          {"all posted unposted".split(" ").map((status) => (
            <button
              key={status}
              className={`px-5 py-2 rounded-full font-semibold border border-gray-300 transition-all hover:shadow-md text-sm ${
                filterStatus === status
                  ? "bg-indigo-500 text-white transform scale-105"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {"all twitter facebook instagram reddit"
            .split(" ")
            .map((platform) => (
              <button
                key={platform}
                className={`px-5 py-2 rounded-full font-semibold border border-gray-300 transition-all hover:shadow-md text-sm ${
                  filterPlatform === platform
                    ? "bg-green-500 text-white transform scale-105"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setFilterPlatform(platform)}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-indigo-500 animate-spin"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No scheduled posts found.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <div className="post-card hover:shadow-lg transition-all duration-300">
                <ScheduledPostCard
                  key={`${post.platform}-${post.id}`}
                  post={post}
                  isExpanded={expandedPostId === `${post.platform}-${post.id}`}
                  onExpand={() =>
                    setExpandedPostId(
                      expandedPostId === `${post.platform}-${post.id}`
                        ? null
                        : `${post.platform}-${post.id}`
                    )
                  }
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledPostsList;
