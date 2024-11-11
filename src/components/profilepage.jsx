import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: {
                        Authorization: `Token ${token}`, // Include the token in the headers
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

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <div>
           
            <p>Username: {profile.username}</p>
            {profile.projects && profile.projects.length > 0 ? (
                <div>
                    <h3>Projects</h3>
                    <ul>
                        {profile.projects.map((project) => (
                            <li key={project.id}>{project.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No projects available</p>
            )}
        </div>
    );
}

export default ProfilePage;
