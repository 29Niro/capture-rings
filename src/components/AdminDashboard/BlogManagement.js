import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/firebase-config';

export const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      setBlogs(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchBlogs();
  }, []);

  const handleAddEditBlog = async (data) => {
    if (editBlog) {
      await updateDoc(doc(db, 'blogs', editBlog.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'blogs'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    setIsModalOpen(false);
    setEditBlog(null);
    await fetchBlogs(); // Reload blogs to reflect the new changes
  };

  const handleDeleteBlog = async (id) => {
    await deleteDoc(doc(db, 'blogs', id));
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const openModal = (blog = null) => {
    setEditBlog(blog);
    setIsModalOpen(true);
  };

  const fetchBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    setBlogs(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Blogs</h2>
      <button
        className="bg-primaryBtn text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => openModal()}
      >
        Add New Blog
      </button>
      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td className="border px-4 py-2">{blog.title}</td>
              <td className="border px-4 py-2">{blog.author}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2"
                  onClick={() => openModal(blog)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  onClick={() => handleDeleteBlog(blog.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <BlogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditBlog}
          blog={editBlog}
        />
      )}
    </div>
  );
};

const BlogModal = ({ isOpen, onClose, onSave, blog }) => {
  const [title, setTitle] = useState(blog?.title || '');
  const [author, setAuthor] = useState(blog?.author || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(blog?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFile) {
      const storageRef = ref(storage, `blogImages/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      setUploading(true);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Handle progress updates here
        },
        (error) => {
          console.error(error);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadURL);

            const blogData = {
              title,
              author,
              excerpt,
              imageUrl: downloadURL,
            };

            await onSave(blogData);
            setUploading(false);
            onClose(); // Close the modal after upload and save
          } catch (error) {
            console.error('Error saving blog:', error);
            setUploading(false);
          }
        }
      );
    } else {
      const blogData = { title, author, excerpt, imageUrl };
      await onSave(blogData);
      onClose(); // Close the modal if no image upload is required
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{blog ? 'Edit Blog' : 'Add New Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border p-2 w-full"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="border p-2 w-full"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="border p-2 w-full"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-gray-500 mt-2">Uploading image...</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 mr-2"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
              }`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : blog ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
