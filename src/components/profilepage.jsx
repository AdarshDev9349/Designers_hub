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

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div >
      {/* Navbar */}
      <motion.nav
        className="flex justify-between px-10 items-center bg-gray-800 text-white py-7  md:flex-row flex-col"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-3xl">{profile.username}</h1>
          <button
            className="text-xl md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
        <ul
          className={`list-none cursor-pointer flex-col md:flex-row flex gap-6 text-lg items-center ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <motion.li whileHover={{ scale: 1.1 }}>About</motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <button onClick={() => setShowModal(true)}>Add Project</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>Search User</motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>Log Out</motion.li>
        </ul>
      </motion.nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <motion.div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </div>
      )}

      {/* Projects */}
      <motion.div className="flex flex-col items-center justify-center mt-10"
    
        variants={navVariants}
      initial="hidden"
      animate="visible"
      
      
      >
        <h2 className="text-4xl font-bold">Projects</h2>
      </motion.div>
      <motion.div
        className="mt-20 mx-10 justify-items-center grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {profile.projects && profile.projects.length > 0 ? (
          profile.projects.map((project) => (
            <motion.div
              key={project.id}
              className="border p-10 w-3/4   flex flex-col items-center gap-3  rounded shadow bg-gray-100 hover:shadow-lg transition"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
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
            </motion.div>
          ))
        ) : (
          <p className="mt-4">No projects available</p>
        )}
      </motion.div>
    </div>
  );
}

export default ProfilePage;
