import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }
        const response = await axios.get(
          "https://fig-hub.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("You are not authorized to view this profile.");
        } else {
          setError("Could not fetch profile data");
        }
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://fig-hub.onrender.com/api/add_project/",
        {
          project_name: projectName,
          figma_url: figmaUrl,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        projects: [...(prevProfile.projects || []), response.data],
      }));
      setShowModal(false);
      setProjectName("");
      setFigmaUrl("");
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to add project");
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  if (error) return <p className="text-red-500 text-center text-xl mt-10">{error}</p>;
  if (!profile) return <p className="text-gray-500 text-center text-xl mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <motion.nav
        className="bg-gradient-to-r bg-blue-900 text-white py-4 px-6 shadow-lg"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          <button
            className="text-2xl md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <ul
            className={`list-none py-5 cursor-pointer flex-col md:flex-row flex gap-6 text-lg items-center ${
              menuOpen ? 'flex absolute top-16 left-0 right-0 bg-blue-800 p-4 md:relative md:bg-transparent md:p-0' : 'hidden'
            } md:flex transition-all duration-300 ease-in-out`}
          >
            <motion.li whileHover={{ scale: 1.1 }} className="hover:text-blue-200 transition-colors">About</motion.li>
            <motion.li whileHover={{ scale: 1.1 }} className="hover:text-blue-200 transition-colors">
              <button onClick={() => setShowModal(true)}>Add Project</button>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }} className="hover:text-blue-200 transition-colors">Search User</motion.li>
            <motion.li whileHover={{ scale: 1.1 }} className="hover:text-blue-200 transition-colors">Log Out</motion.li>
          </ul>
        </div>
      </motion.nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Figma URL"
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              className="border border-gray-300 p-3 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Project
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Projects */}
      <div className="container mx-auto px-4 py-10">
        <motion.div className="text-center mb-12"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-600 mt-2">Your creative journey starts here</p>
        </motion.div>
        <motion.div
          className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {profile.projects && profile.projects.length > 0 ? (
            profile.projects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <h4 className="font-bold text-xl mb-3 text-gray-800">{project.name}</h4>
                  <div className="flex space-x-4">
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex-1 text-center"
                    >
                      View in Figma
                    </a>
                    <a
                      href={project.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex-1 text-center"
                    >
                      View Here
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">No projects available</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;

