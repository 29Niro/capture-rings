import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

export const ServiceSelection = ({ formData, setFormData, nextStep }) => {
  const [packages, setPackages] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesSnapshot = await getDocs(collection(db, 'packages'));
        const fetchedPackages = packagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackages(fetchedPackages);

        // Fetch teams
        const teamsSnapshot = await getDocs(collection(db, 'teams'));
        const fetchedTeams = teamsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(fetchedTeams);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter the packages based on the selected team
  const filteredPackages =
    selectedTeam === 'All'
      ? packages
      : packages.filter((pkg) => pkg.team === selectedTeam);

  const handleSelectPackage = (pkg) => {
    setFormData({
      ...formData,
      title: pkg.title,
      price: pkg.price,
      team: pkg.team,
      duration: pkg.duration,
    });
    nextStep();
  };

  return (
    <div className="m-6">
      <div className="text-start">
        <h2 className="text-lg font-semibold mb-4">Select Category</h2>
        {/* Filter Buttons */}
        <div className="mb-4">
          {['All', ...teams.map((team) => team.name)].map((team) => (
            <button
              key={team}
              className={`px-4 py-1 rounded-lg mx-2 ${
                selectedTeam === team
                  ? 'border-2 border-primaryBtn bg-white text-primaryBtn'
                  : 'border-2 border-gray-400 bg-white text-gray-700'
              }`}
              onClick={() => setSelectedTeam(team)}
            >
              {team}
            </button>
          ))}
        </div>
      </div>
      {/* Packages */}
      <h2 className="text-lg font-semibold mb-4">Select Service</h2>
      {loading ? (
        <p>Loading packages...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 border border-gray-300 rounded-lg flex items-start space-x-4 hover:bg-gray-100"
              onClick={() => handleSelectPackage(pkg)}
            >
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{pkg.title}</h3>
                <p className="text-gray-700 text-justify">{pkg.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-600">Duration: {pkg.duration} h</p>
                  <p className="text-lg font-semibold text-primaryBtn bg-purple-100 p-2 rounded-lg">
                    Price: {pkg.price} Rs
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border w-full my-4"></div>
      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="bg-primaryBtn text-white px-4 py-2 rounded-lg mt-4"
        >
          Next: Date & Time
        </button>
      </div>
    </div>
  );
};
