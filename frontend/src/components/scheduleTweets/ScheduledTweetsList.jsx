import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTimesCircle,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";
import ScheduledPostCard from "./ScheduledPostCard";

const platforms = [
  { key: "all", icon: faGlobe, label: "All" },
  { key: "twitter", icon: faTwitter, label: "Twitter" },
  { key: "facebook", icon: faFacebookF, label: "Facebook" },
  { key: "instagram", icon: faInstagram, label: "Instagram" },
  { key: "reddit", icon: faReddit, label: "Reddit" },
];
const statuses = [
  { key: "all", label: "All" },
  { key: "posted", label: "Posted" },
  { key: "unposted", label: "Unposted" },
];

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
      // Animate posts as they are loaded in
      gsap.from(".post-card", {
        opacity: 0,
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
      const results = await Promise.all(
        endpoints.map((ep) =>
          fetchData(ep.url).then((res) => ({
            platform: ep.platform,
            data: res.data,
          }))
        )
      );
      const combined = results.flatMap((result) => {
        const key = Object.keys(result.data)[0];
        return (result.data[key] || []).map((post) => ({
          ...post,
          platform: result.platform,
        }));
      });
      setPosts(combined);
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

  const clearFilters = () => {
    gsap.to(".filter-btn", {
      opacity: 0.6,
      duration: 0.2,
      stagger: 0.1,
    });

    setTimeout(() => {
      setFilterStatus("all");
      setFilterPlatform("all");

      gsap.to(".filter-btn", {
        opacity: 1,
        duration: 0.3,
      });

      gsap.to(".post-card", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
      });
    }, 200);
  };

  const handleFilterChange = () => {
    // Add animation when the filters change
    gsap.to(".post-card", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.1,
      onComplete: () => {
        gsap.to(".post-card", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
        });
      },
    });
  };

  return (
    <div className="p-6 px-24 w-full bg-gradient-to-br from-pink-100 via-blue-100 to-white rounded-md mx-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Scheduled Posts
      </h1>

      {/* Filter Section with Animations */}
      <div className="filters flex mx-auto gap-x-6 mb-8">
        {/* Status Toggle */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {statuses.map((s) => (
              <button
                key={s.key}
                className="filter-btn px-4 py-2 rounded-full text-sm font-medium transition 
                hover:bg-indigo-500 hover:text-white"
                style={{
                  backgroundColor: filterStatus === s.key ? "#fff" : "#f0f0f0",
                  color: filterStatus === s.key ? "#4c51bf" : "#000",
                  boxShadow:
                    filterStatus === s.key
                      ? "0 0 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                }}
                onClick={() => {
                  setFilterStatus(s.key);
                  handleFilterChange();
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Toggle */}
        <div className="flex justify-center items-center mb-4">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {platforms.map((p) => (
              <button
                key={p.key}
                className="filter-btn px-3 py-2 rounded-full text-sm font-medium transition flex items-center gap-1
                hover:bg-indigo-500 hover:text-white"
                style={{
                  backgroundColor:
                    filterPlatform === p.key ? "#fff" : "#f0f0f0",
                  color: filterPlatform === p.key ? "#4c51bf" : "#000",
                  boxShadow:
                    filterPlatform === p.key
                      ? "0 0 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                }}
                onClick={() => {
                  setFilterPlatform(p.key);
                  handleFilterChange();
                }}
              >
                <FontAwesomeIcon icon={p.icon} />
              </button>
            ))}
          </div>

          <button
            onClick={clearFilters}
            className="ml-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faTimesCircle} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Posts Masonry-style Gallery */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-indigo-500"
          />
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-gray-400">No scheduled posts found.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={`${post.platform}-${post.id}`}
              className="post-card break-inside-avoid"
            >
              <ScheduledPostCard
                post={post}
                isExpanded={expandedPostId === `${post.platform}-${post.id}`}
                onExpand={() =>
                  setExpandedPostId((prev) =>
                    prev === `${post.platform}-${post.id}`
                      ? null
                      : `${post.platform}-${post.id}`
                  )
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledPostsList;
