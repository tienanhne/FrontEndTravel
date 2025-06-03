import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
import axios from "axios";

const WriteBlog: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const { account } = useSelector((state: State) => state.user);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/categories?page=1&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const categoryNames = response.data.result.data.map(
          (item: { name: string }) => item.name
        );
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleDropdown = (dropdown: string) => {
    if (dropdown === "category") {
      setCategoryDropdownOpen(!categoryDropdownOpen);
      setTagDropdownOpen(false);
    } else {
      setTagDropdownOpen(!tagDropdownOpen);
      setCategoryDropdownOpen(false);
    }
  };

  const handleSelect = (item: string, type: "category" | "tag") => {
    if (type === "category") {
      setSelectedCategories((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setSelectedTags((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag)) {
      setSelectedTags((prev) => [...prev, newTag]);
      setNewTag("");
    }
  };

  const handleCreateCategory = async () => {
    if (newCategory.trim()) {
      try {
        await axios.post(`${import.meta.env.VITE_BASE_API}/blog/categories`, {
          name: newCategory,
        });
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/blog/categories?page=1&limit=6`
        );
        const categoryNames = response.data.result.data.map(
          (item: { name: string }) => item.name
        );
        setCategories(categoryNames);
        setSelectedCategories((prev) => [...prev, newCategory]);
        setNewCategory("");
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/blog/blogs/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("upload image", response);
      const imageId = response.data.result.id;
      return imageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    console.log("Blog content:", content);
    console.log("Selected categories:", selectedCategories);
    console.log("Selected tags:", selectedTags);

    let imageId = null;

    if (selectedImage) {
      imageId = await uploadImage(selectedImage);
      if (!imageId) {
        console.error("Failed to upload image.");
        toast.error("Image upload failed.");
        return;
      }
    }

    const blogData = {
      title,
      content,
      tags: selectedTags,
      categories: selectedCategories,
      imageId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/blog/blogs`,
        blogData
      );
      console.log("Blog created successfully:", response.data);
      toast.success("Đăng bài viết thành công!");

      setTitle("");
      setContent("");
      setSelectedTags([]);
      setSelectedCategories([]);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Error creating blog. Please try again.");
    }
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "color", "image"],
      [{ "code-block": true }],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "indent",
    "image",
    "code-block",
    "color",
  ];
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-4 mt-5 py-10 container dark:bg-slate-500">
      <section className="w-full lg:w-1/2 bg-white dark:bg-slate-600 rounded-lg shadow p-6">
        <h1 className="mb-6 border-l-8 border-primary/50 dark:border-dark/50 py-2 pl-4 text-3xl dark:text-white font-extrabold text-gray-700">
          Viết về chuyến đi của{" "}
          <span className="text-secondary dark:text-dark">
            {account?.firstName + " " + account?.lastName}
          </span>
        </h1>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block mb-2 dark:text-white font-medium ">
            Tiêu đề bài viết:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="border rounded-md p-2 w-full bg-gray-100"
          />
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-medium dark:text-white text-gray-700">
            Chọn danh mục:
          </label>
          <div className="relative">
            <div
              className={`border rounded-md p-2 cursor-pointer bg-gray-100 transition-colors duration-300 ${
                selectedCategories.length > 0 ? "text-primary" : ""
              }`}
              onClick={() => toggleDropdown("category")}
            >
              {selectedCategories.length > 0
                ? selectedCategories.join(", ")
                : "Chọn thể loại..."}
            </div>
            {categoryDropdownOpen && (
              <div className="absolute z-10 bg-white border mt-1 rounded-md shadow-lg">
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <div
                      key={category}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        selectedCategories.includes(category)
                          ? "text-primary font-semibold"
                          : ""
                      }`}
                      onClick={() => handleSelect(category, "category")}
                    >
                      {category}
                    </div>
                  ))}
                <div className="p-2 border-t cursor-pointer hover:bg-gray-100">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nhập danh mục mới..."
                    className="border rounded-md p-1 w-full"
                  />
                  <button
                    onClick={handleCreateCategory}
                    className="bg-secondary text-white rounded-md mt-2 px-2 py-1"
                  >
                    Tạo danh mục mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tag Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-medium dark:text-white text-gray-700">
            Chọn thẻ:
          </label>
          <div className="relative">
            <div
              className={`border rounded-md p-2 cursor-pointer bg-gray-100 transition-colors duration-300 ${
                selectedTags.length > 0 ? "text-primary" : ""
              }`}
              onClick={() => toggleDropdown("tag")}
            >
              {selectedTags.length > 0
                ? selectedTags.join(", ")
                : "Chọn thẻ..."}
            </div>
            {tagDropdownOpen && (
              <div className="absolute z-10 bg-white border mt-1 rounded-md shadow-lg">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedTags.includes(tag)
                        ? "text-primary font-semibold"
                        : ""
                    }`}
                    onClick={() => handleSelect(tag, "tag")}
                  >
                    {tag}
                  </div>
                ))}
                <div className="p-2 border-t cursor-pointer hover:bg-gray-100">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập thẻ mới..."
                    className="border rounded-md p-1 w-full"
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-secondary text-white rounded-md mt-2 px-2 py-1"
                  >
                    Thêm thẻ mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Tải lên hình ảnh:
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
            >
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4a2 2 0 012-2h6a2 2 0 012 2v12M5 12h14m-5 5h-4m-2 2h8"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click để tải lên</span> hoặc
                    kéo và thả
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF (MAX. 5MB)
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {selectedImage && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Xóa hình ảnh
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700 dark:text-white">
            Nội dung bài viết:
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="w-full z-30 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition duration-300"
          />
          {/* <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bài tại đây..."
            className="w-full h-48 p-4 text-base text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition duration-300 resize-none"
          /> */}
          <p className="mt-5 text-sm text-gray-500 dark:text-secondary">
            Hãy viết nội dung bài viết của bạn ở đây. Tối thiểu 200 từ.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary text-white rounded-md px-4 py-2"
        >
          Đăng bài
        </button>
      </section>
      <section className="max-w-3xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 rounded-xl shadow">
        {/* Ảnh bìa */}
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Cover"
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        )}

        {/* Tiêu đề */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>

        {/* Danh mục & thẻ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((cat, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              {cat}
            </span>
          ))}
          {selectedTags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Nội dung */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {parse(content)}
        </article>
      </section>
    </div>
  );
};

export default WriteBlog;
