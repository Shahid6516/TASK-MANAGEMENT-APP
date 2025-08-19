import React, { useState } from "react";
import { z } from "zod";
import { showToast } from "../helper/showToast";

const HomePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  // Zod schema
  const taskSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long" }),
    description: z
      .string()
      .min(3, { message: "Description must be at least 3 characters long" })
      .max(500, { message: "Description is too long (max 500 characters)" })
  });

  // Input handler
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // clear error for this field
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = taskSchema.safeParse(formData);

    if (result.success) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/task/create-task`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();

        // ✅ Reset form safely
        setFormData({ title: "", description: "" });
        setErrors({});

        showToast("success", responseData.message || "Task created successfully");
        console.log("✅ Task created:", responseData);

      } catch (err) {
        console.error("❌ Submission error:", err.message);
        showToast("error", err.message);
      }
    } else {
      // Collect validation errors
      const formattedErrors = result.error.issues.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(formattedErrors);
    }
  };

  return (
    <div className="pt-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Add Task</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            onChange={handleInput}
            type="text"
            name="title"
            value={formData.title}
            className={`bg-gray-50 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="Task title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            onChange={handleInput}
            name="description"
            rows="4"
            value={formData.description}
            className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Task description..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                     focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto 
                     px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default HomePage;
