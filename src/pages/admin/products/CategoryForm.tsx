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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Save, ArrowLeft, Upload, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // States for form fields
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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
      if (categoryData.imageUrl) {
        setImagePreview(categoryData.imageUrl);
      }
    }
  }, [isEditMode, categoryData]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!name.trim()) errors.name = "Category name is required";
    if (!isEditMode && !image) errors.image = "Please select a category image";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("fileImage", image);
    }

    try {
      if (isEditMode && id) {
        await updateCategory({ id, data: formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      navigate("/admin/categories");
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const isLoading = isCreating || isUpdating;
  const hasError = createError || updateError;

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Card className="shadow-md dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {isEditMode ? "Edit Category" : "Add New Category"}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {isEditMode
                  ? "Update category information"
                  : "Add a new category to the system"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/categories")}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to save category. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên danh mục */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>

            {/* Hình ảnh */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-base font-medium">
                Image {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={clearImage}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload size={16} />
                      <span>Choose image</span>
                    </Button>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
                {formErrors.image && (
                  <p className="text-red-500 text-sm">{formErrors.image}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                <span>
                  {isLoading
                    ? isEditMode
                      ? "Saving..."
                      : "Creating..."
                    : isEditMode
                    ? "Save changes"
                    : "Create category"}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
