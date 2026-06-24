import React from "react";
import {
  FaCar,
  FaCheckCircle,
  FaTools,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaUserFriends,
} from "react-icons/fa";
import '../css/Vehicles.css';
import toyotaInnova from "../assets/Vehivlesimages/Toyota_Innova_Crysta.jpg";

function Vehicles() {
  const vehicles = [
    {
      name: "Toyota Innova Crysta",
      details: "7 Seater • Diesel",
      type: "SUV",
      plate: "KA01AB1234",
      capacity: 7,
      year: 2021,
      status: "Active",
      service: "20 May 2024",
      image: toyotaInnova,
    } ,
    {
      name: "Honda City",
      details: "Sedan • Petrol",
      type: "Sedan",
      plate: "KA01CD5678",
      capacity: 4,
      year: 2022,
      status: "Active",
      service: "18 May 2024",
    },
    {
      name: "Maruti Suzuki Swift",
      details: "Hatchback • Petrol",
      type: "Hatchback",
      plate: "KA01EF9101",
      capacity: 4,
      year: 2020,
      status: "Under Maintenance",
      service: "15 May 2024",
    },
    {
      name: "Mahindra XUV500",
      details: "7 Seater • Diesel",
      type: "SUV",
      plate: "KA01GH1122",
      capacity: 7,
      year: 2019,
      status: "Active",
      service: "10 May 2024",
    },
    {
      name: "Force Traveller",
      details: "12 Seater • Diesel",
      type: "Van",
      plate: "KA01IJ3344",
      capacity: 12,
      year: 2018,
      status: "Inactive",
      service: "02 May 2024",
    },
  ];

  return (
    <div className="vehicles-page">

      {/* Stats */}

<div className="stats-grid">

  <div className="stat-card card1">
    <FaCar className="icon blue" />
    <div>
      <span>Total Vehicles</span>
      <h2>128</h2>
    </div>
  </div>

  <div className="stat-card card2">
    <FaCheckCircle className="icon green" />
    <div>
      <span>Active Vehicles</span>
      <h2>102</h2>
    </div>
  </div>

  <div className="stat-card card3">
    <FaTools className="icon purple" />
    <div>
      <span>Under Maintenance</span>
      <h2>14</h2>
    </div>
  </div>

  <div className="stat-card card4">
    <FaTimesCircle className="icon red" />
    <div>
      <span>Inactive Vehicles</span>
      <h2>12</h2>
    </div>
  </div>

</div>

      {/* Table */}

      <div className="table-card">

        <div className="table-top">
          <h2>All Vehicles</h2>

          <div className="filters">
             <button className="add-btn">+ Add Vehicle</button>
            <select>
              <option>All Status</option>
            </select>

            <select>
              <option>All Types</option>
            </select>

            <button className="filter-btn">
              Filter
            </button>
          </div>
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Plate Number</th>
                <th>Capacity</th>
                <th>Year</th>
                <th>Status</th>
                <th>Last Service</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {vehicles.map((item, index) => (
                <tr key={index}>

                  <td>
                    <div className="vehicle-info">

                      <img
                          src={item.image}
                          alt={item.name}
                          className="vehicle-img"
                      />

                      <div>
                        <h4>{item.name}</h4>
                        <span>{item.details}</span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <span className="type-badge">
                      {item.type}
                    </span>
                  </td>

                  <td>{item.plate}</td>

                  <td>
                    <FaUserFriends />
                    {" "}
                    {item.capacity}
                  </td>

                  <td>{item.year}</td>

                  <td>
                    <span
                      className={`status ${item.status
                        .replace(/\s/g, "-")
                        .toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>{item.service}</td>

                  <td>
                    <div className="actions">
                      <FaEye />
                      <FaEdit />
                      <FaTrash />
                      <FaEllipsisV />
                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Vehicles;