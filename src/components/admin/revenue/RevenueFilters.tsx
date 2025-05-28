import React, { useState } from "react";
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
import { Calendar, Filter } from "lucide-react";
import { format } from "date-fns";

interface RevenueFiltersProps {
  onDateRangeFilter: (startDate: string, endDate?: string) => void;
  onYearFilter: (year: number) => void;
  onMonthFilter: (month: number, year: number) => void;
  loading?: boolean;
}

const RevenueFilters: React.FC<RevenueFiltersProps> = ({
  onDateRangeFilter,
  onYearFilter,
  onMonthFilter,
  loading = false,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [filterType, setFilterType] = useState<"dateRange" | "year" | "month">(
    "dateRange"
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Helper function to convert date input (yyyy-MM-dd) to API format (dd-MM-yyyy HH:mm:ss)
  const convertToApiFormat = (dateString: string, isEndDate = false) => {
    if (!dateString) return undefined;

    const date = new Date(dateString);
    if (isEndDate) {
      // Set to end of day for end date
      date.setHours(23, 59, 59, 999);
    } else {
      // Set to start of day for start date
      date.setHours(0, 0, 0, 0);
    }

    return format(date, "dd-MM-yyyy HH:mm:ss");
  };

  const handleApplyFilter = () => {
    if (filterType === "dateRange") {
      if (startDate) {
        const formattedStartDate = convertToApiFormat(startDate);
        const formattedEndDate = endDate
          ? convertToApiFormat(endDate, true)
          : undefined;

        onDateRangeFilter(formattedStartDate!, formattedEndDate);
      }
    } else if (filterType === "year") {
      onYearFilter(selectedYear);
    } else if (filterType === "month") {
      onMonthFilter(selectedMonth, selectedYear);
    }
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  return (
    <div className="bg-card p-6 rounded-lg border space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Revenue Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="filterType">Filter Type</Label>
          <Select
            value={filterType}
            onValueChange={(value: any) => setFilterType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateRange">Date Range</SelectItem>
              <SelectItem value="month">By Month</SelectItem>
              <SelectItem value="year">By Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filterType === "dateRange" && (
          <>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </>
        )}

        {filterType === "month" && (
          <>
            <div>
              <Label htmlFor="month">Month</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {filterType === "year" && (
          <div>
            <Label htmlFor="year">Year</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-end">
          <Button
            onClick={handleApplyFilter}
            disabled={loading}
            className="w-full"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {loading ? "Loading..." : "Apply"}
          </Button>
        </div>
      </div>

      {filterType === "dateRange" && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange(7)}
          >
            Last 7 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange(30)}
          >
            Last 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange(90)}
          >
            Last 90 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange(365)}
          >
            Last year
          </Button>
        </div>
      )}
    </div>
  );
};

export default RevenueFilters;
