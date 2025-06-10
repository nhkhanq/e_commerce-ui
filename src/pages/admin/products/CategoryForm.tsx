import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/services/admin/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Save,
  ArrowLeft,
  Upload,
  X,
  Grid3X3,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // States for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // API hooks
  const { data: categoryData } = useGetCategoryByIdQuery(id as string, {
    skip: !isEditMode,
  });

  const [createCategory, { isLoading: isCreating, isError: createError }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating, isError: updateError }] =
    useUpdateCategoryMutation();

  // Load category data if in edit mode
  useEffect(() => {
    if (isEditMode && categoryData) {
      setName(categoryData.name);
      setDescription(categoryData.description || "");
      if (categoryData.imageUrl) {
        setImagePreview(categoryData.imageUrl);
      }
    }
  }, [isEditMode, categoryData]);

  const validateForm = () => {
    if (!name.trim()) return false;
    if (!isEditMode && !image) return false;
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());

    if (image) {
      formData.append("fileImage", image);
    }

    try {
      if (isEditMode) {
        await updateCategory({ id: id as string, data: formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const hasError = createError || updateError;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/categories")}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "Update category information"
              : "Create a new product category"}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Error Alert */}
          {hasError && (
            <div className="mb-12">
              <Alert variant="destructive" className="border-0 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Unable to save category. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Category details and settings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Category Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    required
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Category Image Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Category Image
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload category icon or image
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="image"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Image Upload
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto object-cover rounded-lg"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image")?.click()
                            }
                            className="border-gray-200 dark:border-gray-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Image
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setImagePreview(null);
                              setImage(null);
                            }}
                            className="border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image")?.click()
                            }
                            className="border-gray-200 dark:border-gray-700"
                          >
                            Upload Image
                          </Button>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            PNG, JPG, JPEG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/categories")}
                  className="border-gray-200 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? "Update Category" : "Create Category"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
