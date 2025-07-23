import React, { useState, useRef } from 'react';
import './Register.css'; // Import the CSS file

const Register: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [admissionsOpen, setAdmissionsOpen] = useState<boolean>(false);
    const newUserRef = useRef<HTMLDivElement | null>(null);
    const returningUserRef = useRef<HTMLDivElement | null>(null);
    const admissionsRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<boolean[]>(Array(4).fill(false)); // Example for 4 partitions

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as Node;
        if (newUserRef.current && !newUserRef.current.contains(target)) {
            setActiveLayer(null);
        }
        if (returningUserRef.current && !returningUserRef.current.contains(target)) {
            setActiveLayer(null);
        }
        if (admissionsRef.current && !admissionsRef.current.contains(target)) {
            setAdmissionsOpen(false);
        }
    };

    const handleSave = () => {
        // Add save logic here
        setActiveLayer(null);
    };

    const togglePartition = (index: number) => {
        setSelected((prev) => {
            const newSelected = [...prev];
            newSelected[index] = !newSelected[index];
            return newSelected;
        });
    };

    return (
        <div className="register-container" onClick={handleOutsideClick}>
            <div className="layered-divs">
                <div
                    className={`layer ${activeLayer === 'new' ? 'active' : ''}`}
                    onClick={() => setActiveLayer('new')}
                >
                    New User
                </div>
                <div
                    className={`layer ${activeLayer === 'returning' ? 'active' : ''}`}
                    onClick={() => setActiveLayer('returning')}
                >
                    Returning User
                </div>
                <div
                    className="layer"
                    onClick={() => setAdmissionsOpen(true)}
                >
                    Admissions
                </div>
            </div>

            {activeLayer === 'new' && (
                <div className="form-modal" ref={newUserRef}>
                    <h2>New User Registration</h2>
                    <form>
                        {/* Add your form fields here */}
                        <button type="button" onClick={handleSave}>Save</button>
                    </form>
                </div>
            )}

            {activeLayer === 'returning' && (
                <div className="form-modal" ref={returningUserRef}>
                    <h2>Returning User Registration</h2>
                    <form>
                        {/* Add your form fields here */}
                        <button type="button" onClick={handleSave}>Save</button>
                    </form>
                </div>
            )}

            {admissionsOpen && (
                <div className="form-modal" ref={admissionsRef}>
                    <h2>Admissions</h2>
                    <div className="partitions">
                        {selected.map((isSelected, index) => (
                            <div
                                key={index}
                                className={`partition ${isSelected ? 'active' : ''}`}
                                onClick={() => togglePartition(index)}
                            >
                                Partition {index + 1}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;