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
import toyotaInnova from "../assets/Vehiclesimages/Toyota_Innova_Crysta.jpg";
import hondaCity from "../assets/Vehiclesimages/Honda_City.jpg";
import suzukiSwift from "../assets/Vehiclesimages/maruti-suzuki-dzire.jpg";
import mahindraXuv from "../assets/Vehiclesimages/mahindra_xuv.jpg";
import forceTraveller from "../assets/Vehiclesimages/force-traveller.jpg";
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
      image:hondaCity,
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
      image:suzukiSwift,
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
      image:mahindraXuv,
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
      image:forceTraveller,
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

      <div className="table-card1">

        <div className="table-top1">
          <h2>All Vehicles</h2>

          <div className="filters1">
             <button className="add-btn">+ Add Vehicle</button>
{/* Status Filter */}
<select className="filter-select">
  <option value="all">All Status</option>
  <option value="active">Active</option>
  <option value="maintenance">Under Maintenance</option>
  <option value="inactive">Inactive</option>
</select>

{/* Vehicle Type Filter */}
<select className="filter-select">
  <option value="all">All Types</option>
  <option value="suv">SUV</option>
  <option value="sedan">Sedan</option>
  <option value="hatchback">Hatchback</option>
  <option value="van">Van</option>
  <option value="luxury">Luxury</option>
  <option value="electric">Electric</option>
</select>

<button className="filter-btn1">
  Filter
</button>
            <button className="filter-btn1">
              Filter
            </button>
          </div>
        </div>

        <div className="table-wrapper1">

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
                    <span className="type-badge1">
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
                    <div className="actions1">
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