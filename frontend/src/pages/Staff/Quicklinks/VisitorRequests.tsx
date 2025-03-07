import React from 'react';

const VisitorRequests: React.FC = () => {
  const requests = [
    { id: 1, name: 'XYZ High School', date: '2024-11-20', status: 'Pending' },
    { id: 2, name: 'ABC Academy', date: '2024-11-21', status: 'Pending' },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Visitor Requests</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {requests.length === 0 ? (
          <p className="text-gray-700">No visitor requests at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{request.name}</h3>
                  <p className="text-gray-600">Date: {request.date}</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Deny
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default VisitorRequests;
