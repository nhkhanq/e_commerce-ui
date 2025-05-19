import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Building2, Home } from "lucide-react";
import {
  useGetProvincesQuery,
  useGetDistrictsByProvinceIdQuery,
  useGetWardsByDistrictIdQuery,
  Province,
  District,
  Ward,
} from "@/api/location/locationApi";
import { AddressChangeEvent } from "@/interfaces/location";

interface AddressSelectorProps {
  onAddressChange: (address: AddressChangeEvent) => void;
  defaultValues?: {
    provinceId?: number;
    districtId?: number;
    wardId?: number;
  };
}

const AddressSelector = ({
  onAddressChange,
  defaultValues,
}: AddressSelectorProps) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(
    defaultValues?.provinceId || 0
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(
    defaultValues?.districtId || 0
  );
  const [selectedWardId, setSelectedWardId] = useState<number>(
    defaultValues?.wardId || 0
  );

  // Fetch provinces
  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    error: provincesError,
  } = useGetProvincesQuery();

  // Fetch districts based on selected province
  const {
    data: districtsData,
    isLoading: isLoadingDistricts,
    error: districtsError,
  } = useGetDistrictsByProvinceIdQuery(selectedProvinceId, {
    skip: !selectedProvinceId,
  });

  // Fetch wards based on selected district
  const {
    data: wardsData,
    isLoading: isLoadingWards,
    error: wardsError,
  } = useGetWardsByDistrictIdQuery(selectedDistrictId, {
    skip: !selectedDistrictId,
  });

  // Get the label data
  const [provinceLabel, setProvinceLabel] = useState<string>("");
  const [districtLabel, setDistrictLabel] = useState<string>("");
  const [wardLabel, setWardLabel] = useState<string>("");

  // Update form data when selections change
  useEffect(() => {
    if (selectedProvinceId && selectedDistrictId && selectedWardId) {
      // Find the selected items to get their names
      const province = provincesData?.find((p) => p.id === selectedProvinceId);
      const district = districtsData?.find((d) => d.id === selectedDistrictId);
      const ward = wardsData?.find((w) => w.id === selectedWardId);

      // Update the labels
      if (province) setProvinceLabel(province.name);
      if (district) setDistrictLabel(district.name);
      if (ward) setWardLabel(ward.name);

      // Only call the callback when we have all three selections
      if (province && district && ward) {
        const fullAddress = `${ward.name}, ${district.name}, ${province.name}`;
        onAddressChange({
          provinceId: selectedProvinceId,
          districtId: selectedDistrictId,
          wardId: selectedWardId,
          fullAddress,
        });
      }
    }
  }, [
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    provincesData,
    districtsData,
    wardsData,
    onAddressChange,
  ]);

  // Reset dependent fields when parent selection changes
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(Number(provinceId));
    setSelectedDistrictId(0);
    setSelectedWardId(0);
    setDistrictLabel("");
    setWardLabel("");
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(Number(districtId));
    setSelectedWardId(0);
    setWardLabel("");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="province"
          className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
        >
          <MapPin className="h-4 w-4 text-orange-500 dark:text-orange-400" />
          Province/City
        </Label>
        <Select
          value={selectedProvinceId ? selectedProvinceId.toString() : ""}
          onValueChange={handleProvinceChange}
          disabled={isLoadingProvinces}
        >
          <SelectTrigger
            id="province"
            className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950/20"
          >
            <SelectValue placeholder="Select a province">
              {isLoadingProvinces ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-orange-600 dark:text-orange-400" />
                  Loading...
                </div>
              ) : (
                provinceLabel || "Select a province"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {provincesError ? (
              <SelectItem value="error" disabled>
                Error loading provinces
              </SelectItem>
            ) : provincesData && provincesData.length > 0 ? (
              provincesData?.map((province: Province) => (
                <SelectItem
                  key={`province-${province.id}`}
                  value={province.id.toString()}
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {province.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                No provinces found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="district"
          className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
        >
          <Building2 className="h-4 w-4 text-orange-500 dark:text-orange-400" />
          District
        </Label>
        <Select
          value={selectedDistrictId ? selectedDistrictId.toString() : ""}
          onValueChange={handleDistrictChange}
          disabled={!selectedProvinceId || isLoadingDistricts}
        >
          <SelectTrigger
            id="district"
            className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950/20"
          >
            <SelectValue placeholder="Select a district">
              {isLoadingDistricts ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-orange-600 dark:text-orange-400" />
                  Loading...
                </div>
              ) : (
                districtLabel || "Select a district"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {districtsError ? (
              <SelectItem value="error" disabled>
                Error loading districts
              </SelectItem>
            ) : !selectedProvinceId ? (
              <SelectItem value="select-province" disabled>
                Select a province first
              </SelectItem>
            ) : districtsData && districtsData.length > 0 ? (
              districtsData?.map((district: District) => (
                <SelectItem
                  key={`district-${district.id}`}
                  value={district.id.toString()}
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {district.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                No districts found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="ward"
          className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
        >
          <Home className="h-4 w-4 text-orange-500 dark:text-orange-400" />
          Ward
        </Label>
        <Select
          value={selectedWardId ? selectedWardId.toString() : ""}
          onValueChange={(value) => setSelectedWardId(Number(value))}
          disabled={!selectedDistrictId || isLoadingWards}
        >
          <SelectTrigger
            id="ward"
            className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950/20"
          >
            <SelectValue placeholder="Select a ward">
              {isLoadingWards ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-orange-600 dark:text-orange-400" />
                  Loading...
                </div>
              ) : (
                wardLabel || "Select a ward"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {wardsError ? (
              <SelectItem value="error" disabled>
                Error loading wards
              </SelectItem>
            ) : !selectedDistrictId ? (
              <SelectItem value="select-district" disabled>
                Select a district first
              </SelectItem>
            ) : wardsData && wardsData.length > 0 ? (
              wardsData?.map((ward: Ward) => (
                <SelectItem
                  key={`ward-${ward.id}`}
                  value={ward.id.toString()}
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {ward.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                No wards found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Hiển thị địa chỉ đã chọn dưới dạng badge */}
      {provinceLabel && (
        <div className="flex flex-wrap gap-2 mt-2">
          {provinceLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300">
              <MapPin className="mr-1 h-3 w-3" />
              {provinceLabel}
            </span>
          )}
          {districtLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-300">
              <Building2 className="mr-1 h-3 w-3" />
              {districtLabel}
            </span>
          )}
          {wardLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300">
              <Home className="mr-1 h-3 w-3" />
              {wardLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
