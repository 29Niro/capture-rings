import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { db, storage } from '../../firebase/firebase-config';

Modal.setAppElement('#root'); // Set root element for accessibility

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    setProducts(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const handleAddEditProduct = async (data) => {
    if (editProduct) {
      await updateDoc(doc(db, 'products', editProduct.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'products'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    setIsModalOpen(false);
    setEditProduct(null);
    await fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const openModal = (product = null) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <button
        className="bg-primaryBtn text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => openModal()}
      >
        Add New Product
      </button>
      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">
                {/* Display the first image in the table */}
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
              </td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2"
                  onClick={() => openModal(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditProduct}
          product={editProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(product?.imageUrls || []);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newImageUrls = [...imageUrls];

    if (imageFiles.length > 0) {
      setUploading(true);
      for (const file of imageFiles) {
        const storageRef = ref(storage, `productImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Optional: Handle progress updates here
            },
            (error) => {
              console.error(error);
              setUploading(false);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                newImageUrls.push(downloadURL);
                resolve();
              } catch (error) {
                console.error('Error uploading image:', error);
                reject(error);
              }
            }
          );
        });
      }

      setUploading(false);
    }

    const productData = {
      name,
      price: parseFloat(price),
      description,
      imageUrls: newImageUrls,
    };

    await onSave(productData);
    onClose();
  };

  const handleRemoveImage = async (url) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
      setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Product Form"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full rounded"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full rounded"
              disabled={uploading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            {imageUrls.map((url, index) => (
              <div key={index} className="relative mb-2">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleRemoveImage(url)}
                >
                  X
                </button>
              </div>
            ))}
            <input
              type="file"
              onChange={(e) =>
                setImageFiles([...imageFiles, ...e.target.files])
              }
              className="border p-2 w-full rounded"
              disabled={uploading}
              multiple
            />
            {uploading && (
              <p className="text-gray-500 mt-2">Uploading images...</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primaryBtn text-white px-4 py-2 rounded-lg"
              disabled={uploading}
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
