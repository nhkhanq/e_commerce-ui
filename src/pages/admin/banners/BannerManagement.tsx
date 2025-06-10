import React, { useState } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/services";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types/banner";

const BannerManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    file: null as File | null,
  });

  const { data: bannersResponse, isLoading } = useGetBannersQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = bannersResponse?.items || [];

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ name: banner.name, file: null });
    } else {
      setEditingBanner(null);
      setFormData({ name: "", file: null });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({ name: "", file: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a banner name");
      return;
    }

    if (!editingBanner && !formData.file) {
      alert("Please select an image file");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    if (formData.file) {
      formDataToSend.append("fileImage", formData.file);
    }

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner.id,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createBanner(formDataToSend).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error saving banner. Please try again.");
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(bannerId).unwrap();
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("Error deleting banner. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Banner Management
        </h1>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner: Banner) => (
          <div
            key={banner.id}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="relative h-48">
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  onClick={() => handleOpenModal(banner)}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 rounded-full"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => handleDelete(banner.id)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 rounded-full disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {banner.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {banners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No banners yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by adding your first banner to showcase on the homepage.
          </p>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Add Banner
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingBanner ? "Edit Banner" : "Add Banner"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-8 w-8"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter banner name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required={!editingBanner}
                />
                {editingBanner && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
