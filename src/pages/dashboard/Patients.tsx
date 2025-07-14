import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type Patient = {
  name: string;
  id: string;
  phone: string;
  dob: string;
  visits: string;
  insurance: string;
  avatar: string;
};

const Patients = () => {
  const { searchTerm } = useOutletContext<ContextType>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState<Patient>({
    name: '',
    id: '',
    phone: '',
    dob: '',
    visits: '',
    insurance: '',
    avatar: '',
  });

  const patients: Patient[] = [
    {
      name: 'Jane Smith',
      id: 'P123456',
      phone: '123-456-7890',
      dob: '1990-05-20',
      visits: '4',
      insurance: 'Yes',
      avatar: 'https://via.placeholder.com/100',
    },
    {
      name: 'Mark Johnson',
      id: 'P789012',
      phone: '987-654-3210',
      dob: '1985-09-15',
      visits: '7',
      insurance: 'No',
      avatar: 'https://via.placeholder.com/100',
    },
  ];

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const updateScreen = () => setIsSmallScreen(mq.matches);
    updateScreen();
    mq.addEventListener('change', updateScreen);
    return () => mq.removeEventListener('change', updateScreen);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedPatient(null);
      }
    };
    if (selectedPatient) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedPatient]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (patient: Patient) => {
    setIsEditMode(true);
    setEditData({ ...patient });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      name: '',
      id: '',
      phone: '',
      dob: '',
      visits: '',
      insurance: '',
      avatar: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).id === 'overlay') handleCloseModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-[103%] bg-gradient-to-r from-black to-gray-700 shadow-lg px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">The Patients</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Patient
          </button>
        </div>
      </div>

      {/* Table */}
      {!isSmallScreen && (
        <div className="-mt-14 w-[108%] bg-white shadow-md rounded-md px-6 py-8 z-10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Name</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Phone No</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">DOB</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">No. of Visits</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Insurance</th>
                <th className="pt-6 pb-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-800">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{patient.phone}</td>
                  <td className="py-4 px-4">{patient.dob}</td>
                  <td className="py-4 px-4">{patient.visits}</td>
                  <td className="py-4 px-4">{patient.insurance}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEditClick(patient)}
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
      )}

      {/* Small Screen List View */}
      {isSmallScreen && (
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-12 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Patients List</h2>
          <ul className="space-y-2">
            {filteredPatients.map((patient, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="w-full text-left text-blue-600 hover:underline"
                >
                  {patient.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <div className="text-center space-y-2">
              <img
                src={selectedPatient.avatar}
                alt={selectedPatient.name}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
              <p className="text-sm text-gray-500">{selectedPatient.id}</p>
              <p><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p><strong>DOB:</strong> {selectedPatient.dob}</p>
              <p><strong>Visits:</strong> {selectedPatient.visits}</p>
              <p><strong>Insurance:</strong> {selectedPatient.insurance}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div id="overlay" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4" onClick={handleOutsideClick}>
          <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Patient Info' : 'Add Patient'}</h2>
            <form className="space-y-4">
              <input type="text" name="name" placeholder="Name" value={editData.name} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm" />
              <input type="text" name="id" placeholder="ID" value={editData.id} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm" />
              <input type="text" name="phone" placeholder="Phone" value={editData.phone} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm" />
              <input type="date" name="dob" value={editData.dob} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm" />
              <input type="number" name="visits" placeholder="Visits" value={editData.visits} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm" />
              <select name="insurance" value={editData.insurance} onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                  {isEditMode ? 'Save Changes' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
