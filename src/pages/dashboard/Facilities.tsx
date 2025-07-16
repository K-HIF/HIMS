import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type Facility = {
  id?: number;
  name: string;
  count: number;
  occupied: number;
};

const Facilities = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  //const BASE_URL = 'https://healthmgmt-7ztg.onrender.com';
  const BASE_URL = 'http://127.0.0.1:8000';

  const [editData, setEditData] = useState<Facility>({
    name: '',
    count: 0,
    occupied: 0,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handleResize = () => setIsSmallScreen(mq.matches);
    handleResize();
    mq.addEventListener('change', handleResize);
    return () => mq.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setSelectedFacility(null);
      }
    };
    if (isModalOpen || selectedFacility) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedFacility]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/facilities`);
      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({ name: '', count: 0, occupied: 0 });
    setIsModalOpen(true);
  };

  const handleEditClick = (facility: Facility) => {
    setIsEditMode(true);
    setEditData({
      id: facility.id,
      name: facility.name,
      count: facility.count,
      occupied: facility.occupied,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacility(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    setModalLoading(true);
    try {
      if (isEditMode && editData.id) {
        await fetch(`${BASE_URL}/api/users/facilities/${editData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });
      } else {
        await fetch(`${BASE_URL}/api/users/facilities/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });
      }
      await fetchFacilities();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving facility:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Facilities</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Facility
          </button>
        </div>
      </div>

      {/* Table View */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Loading facilities...</span>
        </div>
      ) : (
        !isSmallScreen && (
          <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Facility</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Count</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Occupied</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Deficit</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4 font-medium text-gray-800">{facility.name}</td>
                    <td className="py-4 px-4">{facility.count}</td>
                    <td className="py-4 px-4">{facility.occupied}</td>
                    <td className="py-4 px-4">{facility.count - facility.occupied}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEditClick(facility)}
                        className="text-blue-500 hover:text-blue-700 transform transition-transform duration-200 hover:scale-110"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Mobile View */}
      {isSmallScreen && (
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-12 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Facilities List</h2>
          <ul className="space-y-2">
            {filteredFacilities.map((f, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedFacility(f)}
                  className="w-full text-left text-blue-600 hover:underline"
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {(isModalOpen || selectedFacility) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Facility' : selectedFacility ? 'Facility Details' : 'Add Facility'}
            </h2>
            {modalLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-600">Saving...</span>
              </div>
            ) : selectedFacility ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedFacility.name}</p>
                <p><strong>Count:</strong> {selectedFacility.count}</p>
                <p><strong>Occupied:</strong> {selectedFacility.occupied}</p>
                <p><strong>Deficit:</strong> {selectedFacility.count - selectedFacility.occupied}</p>
              </div>
            ) : (
              <form className="space-y-4">
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Facility Name" className="w-full border rounded-md px-3 py-2" />
                <input type="number" name="count" value={editData.count} onChange={handleChange} placeholder="Count" className="w-full border rounded-md px-3 py-2" />
                <input type="number" name="occupied" value={editData.occupied} onChange={handleChange} placeholder="Occupied" className="w-full border rounded-md px-3 py-2" />
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    disabled={modalLoading}
                  >
                    {isEditMode ? 'Save Changes' : 'Add Facility'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Facilities;
