import { useGetMyProfileQuery } from "@/services/user/userApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/loading";
import { Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { data, error, isLoading } = useGetMyProfileQuery();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-500">
          Unable to load information
        </h2>
        <p className="text-gray-500 mb-6">
          An error occurred while loading user information. Please try again
          later.
        </p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const userInfo = data?.result;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Information</h1>

        <Card className="mb-8">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {userInfo && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 text-xl font-bold">
                    {userInfo.firstName ? userInfo.firstName.charAt(0) : "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {userInfo.firstName} {userInfo.lastName}
                    </h3>
                    <div className="flex items-center text-gray-500 mt-1">
                      <User size={16} className="mr-1" />
                      <span>
                        {userInfo.roles?.map((role) => role.name).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">First Name</p>
                    <p className="font-medium">
                      {userInfo.firstName || "Not updated"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Name</p>
                    <p className="font-medium">
                      {userInfo.lastName || "Not updated"}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <div className="flex items-center">
                      <Mail
                        size={16}
                        className="mr-2 text-green-600 dark:text-green-400"
                      />
                      <p className="font-medium">{userInfo.email}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {userInfo.roles?.flatMap((role) =>
                      role.permissions.map((perm) => (
                        <span
                          key={perm.name}
                          className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm"
                        >
                          {perm.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
