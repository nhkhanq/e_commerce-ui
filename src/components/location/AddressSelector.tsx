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
} from "@/services/location/locationApi";
import { AddressChangeEvent } from "@/types/location";

interface AddressSelectorProps {
  onAddressChange: (address: AddressChangeEvent) => void;
  onPartialAddressChange?: (partialAddr: string) => void;
  defaultValues?: {
    provinceId?: number;
    districtId?: number;
    wardId?: number;
  };
}

const AddressSelector = ({
  onAddressChange,
  onPartialAddressChange,
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
    // Find the selected items to get their names
    const province = provincesData?.find((p) => p.id === selectedProvinceId);
    const district = districtsData?.find((d) => d.id === selectedDistrictId);
    const ward = wardsData?.find((w) => w.id === selectedWardId);

    // Update the labels
    if (province) setProvinceLabel(province.name);
    if (district) setDistrictLabel(district.name);
    if (ward) setWardLabel(ward.name);

    // Build partial address as we select
    let partialAddr = "";
    if (province) {
      partialAddr = province.name;
      if (district) {
        partialAddr = `${district.name}, ${partialAddr}`;
        if (ward) {
          partialAddr = `${ward.name}, ${partialAddr}`;
        }
      }
    }

    // Call partial address callback whenever we have at least province
    if (partialAddr && onPartialAddressChange) {
      onPartialAddressChange(partialAddr);
    }

    // Only call the full callback when we have all three selections
    if (
      selectedProvinceId &&
      selectedDistrictId &&
      selectedWardId &&
      province &&
      district &&
      ward
    ) {
      const fullAddress = `${ward.name}, ${district.name}, ${province.name}`;
      onAddressChange({
        provinceId: selectedProvinceId,
        districtId: selectedDistrictId,
        wardId: selectedWardId,
        fullAddress,
      });
    }
  }, [
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    provincesData,
    districtsData,
    wardsData,
    onAddressChange,
    onPartialAddressChange,
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
    <div className="space-y-6">
      <div className="space-y-3">
        <Label
          htmlFor="province"
          className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
          Province/City
        </Label>
        <Select
          value={selectedProvinceId ? selectedProvinceId.toString() : ""}
          onValueChange={handleProvinceChange}
          disabled={isLoadingProvinces}
        >
          <SelectTrigger
            id="province"
            className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >
            <SelectValue placeholder="Select a province">
              {isLoadingProvinces ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600 dark:text-green-400" />
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
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

      <div className="space-y-3">
        <Label
          htmlFor="district"
          className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          District
        </Label>
        <Select
          value={selectedDistrictId ? selectedDistrictId.toString() : ""}
          onValueChange={handleDistrictChange}
          disabled={!selectedProvinceId || isLoadingDistricts}
        >
          <SelectTrigger
            id="district"
            className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >
            <SelectValue placeholder="Select a district">
              {isLoadingDistricts ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600 dark:text-green-400" />
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
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

      <div className="space-y-3">
        <Label
          htmlFor="ward"
          className="text-base font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
          Ward
        </Label>
        <Select
          value={selectedWardId ? selectedWardId.toString() : ""}
          onValueChange={(value) => setSelectedWardId(Number(value))}
          disabled={!selectedDistrictId || isLoadingWards}
        >
          <SelectTrigger
            id="ward"
            className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >
            <SelectValue placeholder="Select a ward">
              {isLoadingWards ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-green-600 dark:text-green-400" />
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <div className="flex flex-wrap gap-2 mt-4">
          {provinceLabel && (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/30">
              <MapPin className="mr-2 h-4 w-4" />
              {provinceLabel}
            </span>
          )}
          {districtLabel && (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
              <Building2 className="mr-2 h-4 w-4" />
              {districtLabel}
            </span>
          )}
          {wardLabel && (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">
              <Home className="mr-2 h-4 w-4" />
              {wardLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
