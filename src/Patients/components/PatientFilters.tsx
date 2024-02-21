import Button from "@/components/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import cx from "classnames";
import { usePatients } from "context/PatientContext";
import { Dispatch, SetStateAction, useMemo } from "react";
import { inputClass } from "utils/classes";

interface Props {
  filterCounter: number;
  showFilters: boolean;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
}

const PatientFilters: React.FC<Props> = ({
  filterCounter,
  showFilters,
  setShowFilters,
}) => {
  const { patients, filters, setFilters } = usePatients();

  const counters = useMemo(
    () => ({
      inquiry: patients?.filter((patient) => patient.status === "inquiry"),
      onboarding: patients?.filter(
        (patient) => patient.status === "onboarding"
      ),
      active: patients?.filter((patient) => patient.status === "active"),
      churned: patients?.filter((patient) => patient.status === "churned"),
    }),
    [patients]
  );

  const handleFilterChange = (
    category: "status" | "cities" | "provinces",
    value: string
  ) => {
    const updatedFilters: any = {
      ...filters,
    };

    // Remove item from filters
    if (filters?.[category].includes(value as TStatusFilterOption)) {
      updatedFilters[category] = updatedFilters[category].filter(
        (filter: string) => filter !== value
      );
    } else {
      // Add item
      updatedFilters[category] = [
        ...filters[category],
        value,
      ] as TStatusFilterOption[];
    }

    setFilters(updatedFilters);
  };

  const handleDobFilterChange = (fromOrTo: "from" | "to", value: string) => {
    const updatedFilters = {
      ...filters,
      dob: [...filters.dob] as string[],
    };

    if (fromOrTo === "from") {
      updatedFilters.dob[0] = value;
      updatedFilters.dob[1] = filters.dob[1];
    }
    if (fromOrTo === "to") {
      updatedFilters.dob[0] = filters.dob[0];
      updatedFilters.dob[1] = value;
    }

    setFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      dob: [],
      cities: [],
      provinces: [],
    });
  };

  const cityOptions = Array.from(
    new Set(
      patients?.flatMap((patient) =>
        patient.addresses?.map((address) => address.city)
      )
    )
  ).map((city) => ({
    label: city,
    value: city,
  }));

  const stateOptions = Array.from(
    new Set(
      patients?.flatMap((patient) =>
        patient.addresses?.map((address) => address.province)
      )
    )
  ).map((province) => ({
    label: province,
    value: province,
  }));

  return (
    <div
      id="filterDropdown"
      className={cx(
        showFilters ? "absolute inset-0 max-h-screen" : "hidden",
        "flex flex-col h-full justify-between z-10 w-48 py-3 bg-white rounded-lg shadow dark:bg-gray-700"
      )}
    >
      <div>
        <div className="flex justify-between w-full mb-4 px-4">
          <h2 className="text-lg font-semibold">Filters</h2>

          <Button variant="none" onClick={() => setShowFilters(false)}>
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-auto px-4 pb-4">
          <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Status
          </h6>

          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            <li className="flex items-center">
              <input
                id="inquiry"
                type="checkbox"
                value="inquiry"
                checked={filters.status.includes("inquiry")}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                onChange={() => handleFilterChange("status", "inquiry")}
              />
              <label
                htmlFor="inquiry"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Inquiry ({counters.inquiry?.length || 0})
              </label>
            </li>
            <li className="flex items-center">
              <input
                id="onboarding"
                type="checkbox"
                value="onboarding"
                checked={filters.status.includes("onboarding")}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                onChange={() => handleFilterChange("status", "onboarding")}
              />
              <label
                htmlFor="onboarding"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Onboarding ({counters.onboarding?.length || 0})
              </label>
            </li>
            <li className="flex items-center">
              <input
                id="active"
                type="checkbox"
                value="active"
                checked={filters.status.includes("active")}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                onChange={() => handleFilterChange("status", "active")}
              />
              <label
                htmlFor="active"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Active ({counters.active?.length || 0})
              </label>
            </li>
            <li className="flex items-center">
              <input
                id="churned"
                type="checkbox"
                value="churned"
                checked={filters.status.includes("churned")}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                onChange={() => handleFilterChange("status", "churned")}
              />
              <label
                htmlFor="churned"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Churned ({counters.churned?.length || 0})
              </label>
            </li>
          </ul>

          <h6 className="mt-8 mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Date of Birth
          </h6>

          <div className="flex flex-col">
            <div>
              <label
                htmlFor="fromDate"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                From
              </label>
              <input
                id="fromDate"
                type="date"
                className={inputClass}
                value={filters?.dob?.[0]}
                onChange={({ target: { value } }) =>
                  handleDobFilterChange("from", value)
                }
              />
            </div>

            <div className="mt-2">
              <label
                htmlFor="toDate"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                To
              </label>
              <input
                id="toDate"
                type="date"
                className={inputClass}
                value={filters?.dob?.[1]}
                onChange={({ target: { value } }) =>
                  handleDobFilterChange("to", value)
                }
              />
            </div>
          </div>

          <h6 className="mt-8 mb-3 text-sm font-medium text-gray-900 dark:text-white">
            City
          </h6>

          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {cityOptions.map((city, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`cityCheckbox-${index}`}
                  value={city?.value}
                  checked={filters.cities?.includes(city.value as string)}
                  onChange={() =>
                    handleFilterChange("cities", city.value as string)
                  }
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={`cityCheckbox-${index}`}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {city.label}
                </label>
              </div>
            ))}
          </ul>

          <h6 className="mt-8 mb-3 text-sm font-medium text-gray-900 dark:text-white">
            State
          </h6>

          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {stateOptions.map((province, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`provinceCheckbox-${index}`}
                  value={province?.value}
                  checked={filters.provinces?.includes(
                    province.value as string
                  )}
                  onChange={() =>
                    handleFilterChange("provinces", province.value as string)
                  }
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={`provinceCheckbox-${index}`}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {province.label}
                </label>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4 px-3">
        <Button
          variant="primary"
          onClick={() => setShowFilters(false)}
          fullWidth
          disabled={filterCounter === 0}
        >
          Apply
        </Button>

        <Button variant="secondary" onClick={handleClearFilters} fullWidth>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default PatientFilters;
