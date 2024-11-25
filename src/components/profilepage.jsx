import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [figmaUrl, setFigmaUrl] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for responsive menu

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('https://fig-hub.onrender.com/api/profile/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError('You are not authorized to view this profile.');
                } else {
                    setError('Could not fetch profile data');
                }
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    const handleAddProject = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://fig-hub.onrender.com/api/add_project/', {
                project_name: projectName,
                figma_url: figmaUrl,
                
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setProfile((prevProfile) => ({
                ...prevProfile,
                projects: [...(prevProfile.projects || []), response.data],
            }));
            setShowModal(false);
            setProjectName('');
            setFigmaUrl('');
            
            console.log('Project added:', response.data);
        } catch (err) {
            console.error('Error adding project:', err);
            setError('Failed to add project');
        }
    };

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white py-4 px-16 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden text-white focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <ul className={`sm:flex space-y-4 sm:space-y-0 sm:space-x-8 text-lg ${
                    isMenuOpen ? 'block' : 'hidden'
                } sm:block absolute sm:static bg-gray-800 sm:bg-transparent w-full sm:w-auto top-16 sm:top-auto left-0 sm:left-auto p-6 sm:p-0`}>
                    <li><button onClick={() => setShowModal(true)} className="hover:text-gray-300">Add Project</button></li>
                    <li className="hover:text-gray-300">About</li>
                    <li className="hover:text-gray-300">Search User</li>
                    <li className="hover:text-gray-300">Log Out</li>
                </ul>
            </nav>

            <div className="container mx-auto px-16 py-8">
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="border p-2 w-full mb-4"
                            />
                            <input
                                type="text"
                                placeholder="Figma URL"
                                value={figmaUrl}
                                onChange={(e) => setFigmaUrl(e.target.value)}
                                className="border p-2 w-full mb-4"
                            />
                            <button
                                onClick={handleAddProject}
                                className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Add Project
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {profile.projects && profile.projects.length > 0 ? (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Projects</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {profile.projects.map((project) => (
                                <div key={project.id} className="bg-white flex flex-col justify-center items-center w-3/5y p-16 rounded shadow hover:shadow-lg transition">
                                    <h4 className="text-lg font-bold mb-2">{project.name}</h4>
                                    <div className="flex space-x-4">
                                        <a
                                            href={project.figma_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                        >
                                            View in Figma
                                        </a>
                                        <a
                                            href={project.image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                        >
                                            View Here
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="mt-6 text-gray-600">No projects available</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
