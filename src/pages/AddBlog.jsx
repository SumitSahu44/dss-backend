import React, { useState, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const quillRef = useRef();

  // Custom Image Handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await axios.post("http://localhost:5000/api/blogs/upload", formData);
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current.getEditor().insertEmbed(range.index, "image", res.data.url);
        } catch (err) {
          console.error("Image upload failed:", err);
          alert("Image upload failed");
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"]
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const handleSubmit = async () => {
    if (!thumbnail) return alert("Please upload a thumbnail");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("thumbnail", thumbnail);

    try {
      await axios.post("http://localhost:5000/api/blogs", formData);
      alert("Blog added successfully!");
      // Reset form or redirect
    } catch (err) {
      console.error("Failed to add blog:", err);
      alert("Failed to add blog");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>📝 Added New Blog Post</h2>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Blog Title</b></label>
        <input
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Meta Title (SEO)</b></label>
        <input
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          placeholder="Enter meta title..."
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Meta Description (SEO)</b></label>
        <textarea
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" }}
          placeholder="Enter meta description..."
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Thumbnail Image</b></label>
        <input
          type="file"
          style={{ display: "block", marginTop: "5px" }}
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <label><b>Content</b></label>
        <div style={{ marginTop: "5px", background: "white" }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "300px", marginBottom: "50px" }} // Added margin bottom for toolbar space
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "15px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "20px"
        }}
        onMouseOver={(e) => e.target.style.background = "#218838"}
        onMouseOut={(e) => e.target.style.background = "#28a745"}
      >
        Publish Blog
      </button>
    </div>
  );
};

export default AddBlog;
