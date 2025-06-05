import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetMyProfileQuery,
  useUpdateUserInfoMutation,
  useChangePasswordMutation,
} from "@/services";
import type {
  UpdateUserInfoRequest,
  ChangePasswordRequest,
} from "@/types/user";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // Profile Info State
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
  });

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Messages State
  const [messages, setMessages] = useState({
    success: "",
    error: "",
  });

  // API Hooks
  const { data: profileResponse, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const [updateUserInfo, { isLoading: isUpdatingInfo }] =
    useUpdateUserInfoMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const userProfile = profileResponse?.result;

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
      });
    }
  }, [userProfile]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (messages.success || messages.error) {
      const timer = setTimeout(() => {
        setMessages({ success: "", error: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setMessages({ success: "", error: "Please fill in all fields" });
      return;
    }

    try {
      const request: UpdateUserInfoRequest = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      };

      await updateUserInfo(request).unwrap();
      setMessages({ success: "Profile updated successfully!", error: "" });
    } catch (error: any) {
      setMessages({
        success: "",
        error: error?.data?.message || "Failed to update profile",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessages({ success: "", error: "Please fill in all password fields" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessages({ success: "", error: "New passwords don't match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessages({
        success: "",
        error: "New password must be at least 6 characters",
      });
      return;
    }

    try {
      const request: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      };

      await changePassword(request).unwrap();
      setMessages({ success: "Password changed successfully!", error: "" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessages({
        success: "",
        error: error?.data?.message || "Failed to change password",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-700 p-6 rounded-xl"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your account information and security settings
          </p>
        </div>
      </div>

      {/* Current Profile Info Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <User className="h-6 w-6" />
            Current Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Full Name
              </label>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {userProfile?.firstName && userProfile?.lastName
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : "Not set"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Email Address
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white break-all">
                {userProfile?.email || "Not available"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Account Role
              </label>
              <div className="flex flex-wrap gap-2">
                {userProfile?.roles && userProfile.roles.length > 0 ? (
                  userProfile.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {role.name.replace("ROLE_", "")}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Account Status
              </label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      {(messages.success || messages.error) && (
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {messages.success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-300">
                  {messages.success}
                </span>
              </div>
            )}
            {messages.error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-300">
                  {messages.error}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Forms Section */}
      <div className="bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8 justify-center">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                  activeTab === "info"
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="h-5 w-5 inline mr-2" />
                Edit Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                  activeTab === "password"
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Lock className="h-5 w-5 inline mr-2" />
                Change Password
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "info" && (
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Update Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Update your first name and last name. Your email address
                  cannot be changed.
                </p>
                <form onSubmit={handleUpdateInfo} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full p-4 text-lg border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 shadow-sm"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full p-4 text-lg border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 shadow-sm"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile?.email || ""}
                      disabled
                      className="w-full p-4 text-lg border-0 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdatingInfo}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {isUpdatingInfo ? "Updating..." : "Update Information"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Change Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Enter your current password and choose a new secure password.
                </p>
                <form onSubmit={handleChangePassword} className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-4 text-lg border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 shadow-sm"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full p-4 text-lg border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 shadow-sm"
                        placeholder="Enter your new password"
                        minLength={6}
                        required
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full p-4 text-lg border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 shadow-sm"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    >
                      <Lock className="h-5 w-5 mr-2" />
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
