import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import fetchData from "../../utils/fetchData";

const STORAGE_KEY = "fb_page_info";

const FacebookProfile = () => {
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  const loadFromStorage = () => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setPageInfo(data);
      } catch {
        console.error("Failed to parse cached Facebook data");
      }
    }
  };

  const fetchFromBackend = async () => {
    setLoading(true);
    try {
      const data = await fetchData("/meta/facebook/page/info");
      setPageInfo(data.data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
    } catch (error) {
      console.error("Failed to fetch Facebook data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setPageInfo(data);
        setLoading(false);
      } catch {
        console.error("Failed to parse cached Facebook data");
        fetchFromBackend();
      }
    } else {
      fetchFromBackend();
    }
  }, []);

  useEffect(() => {
    if (pageInfo) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [pageInfo]);

  if (loading && !pageInfo)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (!pageInfo)
    return (
      <div className="text-center mt-10 text-red-500">Failed to load data.</div>
    );

  const {
    name,
    about,
    username,
    link,
    category,
    category_list,
    fan_count,
    followers_count,
    website,
    location,
    emails,
    phone,
    picture,
    cover,
  } = pageInfo;

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden text-gray-700 relative"
    >
      {/* Refresh Button */}
      <button
        onClick={fetchFromBackend}
        className="absolute top-4 right-4 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
        title="Refresh from Facebook"
      >
        🔄 Refresh
      </button>

      {/* Cover Image */}
      {cover?.source && (
        <img
          src={cover.source}
          alt="Cover"
          className="w-full h-60 object-cover"
        />
      )}

      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-6 -mt-16">
          {picture?.data?.url && (
            <img
              src={picture.data.url}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            {username && <p className="text-gray-500 text-sm">@{username}</p>}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
          {about && (
            <div>
              <span className="font-medium">About:</span> {about}
            </div>
          )}
          {category && (
            <div>
              <span className="font-medium">Category:</span> {category}
            </div>
          )}
          {category_list?.length > 0 && (
            <div>
              <span className="font-medium">Tags:</span>{" "}
              {category_list.map((cat) => cat.name).join(", ")}
            </div>
          )}
          {followers_count !== undefined && (
            <div>
              <span className="font-medium">Followers:</span> {followers_count}
            </div>
          )}
          {fan_count !== undefined && (
            <div>
              <span className="font-medium">Likes:</span> {fan_count}
            </div>
          )}
          {phone && (
            <div>
              <span className="font-medium">Phone:</span> {phone}
            </div>
          )}
          {emails?.length > 0 && (
            <div>
              <span className="font-medium">Email:</span> {emails[0]}
            </div>
          )}
          {location && (
            <div>
              <span className="font-medium">Location:</span>{" "}
              {[location.street, location.zip].filter(Boolean).join(", ")}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-4 space-y-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              🌐 Visit Website
            </a>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block"
            >
              🔗 View on Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacebookProfile;
