import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAdminCategoriesQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/api/admin/adminApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, ArrowLeft, Upload, X } from "lucide-react";
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // API hooks
  const { data: categoriesData } = useGetAdminCategoriesQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  const { data: productData, isLoading: isLoadingProduct } =
    useGetAdminProductByIdQuery(id as string, { skip: !isEditMode });

  const [
    createProduct,
    { isLoading: isCreating, isError: createError, error: createErrorDetails },
  ] = useCreateProductMutation();

  const [
    updateProduct,
    { isLoading: isUpdating, isError: updateError, error: updateErrorDetails },
  ] = useUpdateProductMutation();

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
    const errors: { [key: string]: string } = {};

    if (!name.trim()) errors.name = "Tên sản phẩm không được để trống";
    if (!price) errors.price = "Giá sản phẩm không được để trống";
    if (Number(price) <= 0) errors.price = "Giá sản phẩm phải lớn hơn 0";
    if (!quantity) errors.quantity = "Số lượng không được để trống";
    if (Number(quantity) < 0) errors.quantity = "Số lượng không được âm";
    if (!categoryId) errors.categoryId = "Vui lòng chọn danh mục";
    if (!isEditMode && !image) errors.image = "Vui lòng chọn ảnh sản phẩm";

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
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("quantity", String(quantity));
    formData.append("categoryId", categoryId);

    if (image) {
      formData.append("fileImage", image);
    }

    try {
      if (isEditMode && id) {
        await updateProduct({ id, data: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
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
                {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {isEditMode
                  ? "Cập nhật thông tin sản phẩm"
                  : "Thêm một sản phẩm mới vào hệ thống"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>
                Không thể lưu sản phẩm. Vui lòng thử lại sau.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên sản phẩm */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Tên sản phẩm <span className="text-red-500">*</span>
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

              {/* Giá */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-medium">
                  Giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  className={formErrors.price ? "border-red-500" : ""}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm">{formErrors.price}</p>
                )}
              </div>

              {/* Số lượng */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base font-medium">
                  Số lượng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  className={formErrors.quantity ? "border-red-500" : ""}
                />
                {formErrors.quantity && (
                  <p className="text-red-500 text-sm">{formErrors.quantity}</p>
                )}
              </div>

              {/* Danh mục */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value)}
                >
                  <SelectTrigger
                    id="category"
                    className={formErrors.categoryId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.items.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-sm">
                    {formErrors.categoryId}
                  </p>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            {/* Hình ảnh */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Hình ảnh{" "}
                {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={clearImage}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Chọn ảnh
                      </span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                {formErrors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.image}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/products")}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-1">
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <Save size={16} />
                <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
