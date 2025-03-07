import {
    School,
    fetchAllSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  } from "../../utils/api";
  import { useState, useEffect, useMemo } from "react";
  
  export default function Schools() {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newSchool, setNewSchool] = useState({ name: "", city: "" });
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});
  
    // Fetch schools
    useEffect(() => {
      const fetchSchools = async () => {
        try {
          const response = await fetchAllSchools();
          setSchools(response);
        } catch (err) {
          setError("Failed to fetch schools. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchSchools();
    }, []);
  
    // Group schools by city
    const groupedSchools = useMemo(() => {
      return schools.reduce((acc: Record<string, School[]>, school) => {
        if (!acc[school.city]) {
          acc[school.city] = [];
        }
        acc[school.city].push(school);
        return acc;
      }, {});
    }, [schools]);
  
    // Handle new school creation
    const handleCreateSchool = async () => {
      if (!newSchool.name || !newSchool.city) {
        alert("Both name and city are required!");
        return;
      }
      try {
        const createdSchool = await createSchool(newSchool.name, newSchool.city);
        setSchools([...schools, createdSchool]);
        setNewSchool({ name: "", city: "" });
      } catch (err) {
        alert("Failed to create school. Please try again.");
      }
    };
  
    // Handle school updates
    const handleUpdateSchool = async () => {
      if (!editingSchool) return;
      try {
        const updatedSchool = await updateSchool(editingSchool.id, {
          name: editingSchool.name,
          city: editingSchool.city,
        });
        setSchools(
          schools.map((school) =>
            school.id === updatedSchool.id ? updatedSchool : school
          )
        );
        setEditingSchool(null);
      } catch (err) {
        alert("Failed to update school. Please try again.");
      }
    };
  
    // Handle school deletion
    const handleDeleteSchool = async (schoolId: number) => {
      try {
        await deleteSchool(schoolId);
        setSchools(schools.filter((school) => school.id !== schoolId));
      } catch (err) {
        alert("Failed to delete school. Please try again.");
      }
    };
  
    // Handle dropdown toggle
    const toggleCityExpansion = (city: string) => {
      setExpandedCities((prev) => ({
        ...prev,
        [city]: !prev[city], // Toggle the city state
      }));
    };
  
    // Scroll to top on editing
    const handleEditSchool = (school: School) => {
      setEditingSchool(school);
      window.scrollTo(0, 0); // Scroll to the top
    };
  
    return (
      <div className="p-6 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Schools Directory</h1>
  
        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 dark:border-blue-300"></div>
          </div>
        )}
  
        {/* Error Handling */}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
  
        {/* Add New School Form */}
        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Add New School</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="School Name"
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                className="border rounded p-2 flex-1 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
              <input
                type="text"
                placeholder="City"
                value={newSchool.city}
                onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                className="border rounded p-2 flex-1 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
              <button
                onClick={handleCreateSchool}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        )}
  
        {/* Edit School Form */}
        {editingSchool && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={editingSchool.name}
                onChange={(e) =>
                  setEditingSchool({ ...editingSchool, name: e.target.value })
                }
                className="border rounded p-2 flex-1 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
              <input
                type="text"
                value={editingSchool.city}
                onChange={(e) =>
                  setEditingSchool({ ...editingSchool, city: e.target.value })
                }
                className="border rounded p-2 flex-1 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
              <button
                onClick={handleUpdateSchool}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSchool(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* Grouped Schools List */}
        {!loading && !error && schools.length > 0 && (
          <div>
            {Object.keys(groupedSchools).map((city) => (
              <div key={city} className="mb-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
                    {city}
                  </h2>
                  <button
                    onClick={() => toggleCityExpansion(city)}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    {expandedCities[city] ? "Collapse" : "Expand"}
                  </button>
                </div>
                {expandedCities[city] && (
                  <ul className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-2">
                    {groupedSchools[city].map((school) => (
                      <li
                        key={school.id}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {school.name}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSchool(school)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchool(school.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
  
        {/* No Schools Message */}
        {!loading && !error && schools.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No schools available to display.
          </p>
        )}
      </div>
    );
  }
  