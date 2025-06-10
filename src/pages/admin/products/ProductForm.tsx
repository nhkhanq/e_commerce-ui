import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAdminCategoriesQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/services/admin/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Save,
  ArrowLeft,
  Upload,
  X,
  Package,
  Grid3X3,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // States for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // API hooks
  const { data: categoriesData } = useGetAdminCategoriesQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  const { data: productData } = useGetAdminProductByIdQuery(id as string, {
    skip: !isEditMode,
  });

  const [createProduct, { isLoading: isCreating, isError: createError }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating, isError: updateError }] =
    useUpdateProductMutation();

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && productData) {
      setName(productData.name);
      setPrice(productData.price);
      setDescription(productData.description || "");
      setQuantity(productData.quantity);
      setCategoryId(productData.category.id);
      if (productData.imageUrl) {
        setImagePreview(productData.imageUrl);
      }
    }
  }, [isEditMode, productData]);

  const validateForm = () => {
    if (!name.trim()) return false;
    if (!price || Number(price) <= 0) return false;
    if (!quantity || Number(quantity) < 0) return false;
    if (!categoryId) return false;
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
    formData.append("price", price.toString());
    formData.append("description", description.trim());
    formData.append("quantity", quantity.toString());
    formData.append("categoryId", categoryId);

    if (image) {
      formData.append("fileImage", image);
    }

    try {
      if (isEditMode) {
        await updateProduct({ id: id as string, data: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      navigate("/admin/products");
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
              onClick={() => navigate("/admin/products")}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "Update product information"
              : "Create a new product for your catalog"}
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
                  Unable to save product. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Essential product details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="price"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Price (VND)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50000"
                    required
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
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
                    placeholder="Enter product description"
                    rows={4}
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Category and Inventory Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Category & Inventory
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Categorization and stock information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="categoryId"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Category
                  </Label>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => setCategoryId(value)}
                  >
                    <SelectTrigger className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.items.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="quantity"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    Stock Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter stock quantity"
                    required
                    className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Product Image Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Product Image
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload product image
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
                  onClick={() => navigate("/admin/products")}
                  className="border-gray-200 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? "Update Product" : "Create Product"}
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

export default ProductForm;
