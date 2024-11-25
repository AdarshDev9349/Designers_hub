import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [figmaUrl, setFigmaUrl] = useState('');

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
        } catch (err) {
            console.error('Error adding project:', err);
            setError('Failed to add project');
        }
    };

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <p className="text-lg font-bold">Username: {profile.username}</p>
            
            {/* Add Project Button */}
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
                Add Project
            </button>

            {/* Project Modal */}
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

            {/* Projects List */}
            {profile.projects && profile.projects.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Projects</h3>
                    <div className="grid gap-4 mt-4">
                        {profile.projects.map((project) => (
                            <div key={project.id} className="border p-4 rounded shadow">
                                <h4 className="font-bold">{project.name}</h4>
                                <div className="flex space-x-4 mt-2">
                                    <a
                                        href={project.figma_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 text-white py-1 px-3 rounded"
                                    >
                                        View in Figma
                                    </a>
                                    <a
                                        href={project.image_url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 text-white py-1 px-3 rounded"
                                    >
                                        View Here
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-4">No projects available</p>
            )}
        </div>
    );
}

export default ProfilePage;
