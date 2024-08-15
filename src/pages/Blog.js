import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { db } from "../firebase/firebase-config";

const categories = [
  "All",
  "Technology",
  "Design",
  "Culture",
  "Business",
  "Politics",
  "Opinion",
  "Science",
  "Health",
];

export const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(blogs);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const filteredBlogPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-12 font-domine">
          Our Blog
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p>Loading...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && blogPosts.length === 0 && (
          <div className="text-center py-20">
            <h2>No blogs available</h2>
          </div>
        )}

        {/* Blog List */}
        {!loading && blogPosts.length > 0 && (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 md:pr-6">
              {filteredBlogPosts.map((post) => (
                <div key={post.id} className="mb-8 flex flex-col md:flex-row">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full md:w-48 h-auto object-cover mb-4 md:mb-0 md:mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                    <div className="text-gray-500 mb-2">
                      <span>
                        {new Date(
                          post.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </span>{" "}
                      | <span>{post.author}</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {post.excerpt.length > 100
                        ? `${post.excerpt.substring(0, 100)}...`
                        : post.excerpt}
                    </p>
                    <button
                      onClick={() => openModal(post)}
                      className="text-primaryBtn font-semibold"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/3">
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`text-primaryBtn hover:underline ${
                          selectedCategory === category ? "font-bold" : ""
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal for Full Blog Content */}
      {isModalOpen && selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={closeModal} />
      )}
      <Footer />
    </section>
  );
};

const BlogModal = ({ blog, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-100">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
        <div className="text-gray-500 mb-2">
          <span>
            {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
          </span>{" "}
          | <span>{blog.author}</span>
        </div>
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-auto object-cover mb-4"
        />
        <p className="text-gray-700">{blog.excerpt}</p>
        <div className="mt-4">
          <p className="text-gray-700">{blog.fullContent}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-primaryBtn text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
