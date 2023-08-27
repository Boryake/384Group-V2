import React, { useState, useEffect } from "react";
import { Nav } from "../Nav/Nav";
import { Link } from "react-router-dom";
import { FaUsers, FaClipboardList, FaTasks } from "react-icons/fa"; // Import icons
import axios from "axios";
import "./Home.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export function Home() {
  const [usersCount, setUsersCount] = useState(0);
  const [roleData, setRoleData] = useState([]);

  const getUsersCountFromApi = async () => {
    try {
      const response = await axios.get("https://giulianomuratore.com/384group/insertarusuarios.php");
      const usersData = response.data;

      // Counting roles
      const roles = {};
      usersData.forEach((user) => {
        const { rol } = user;
        if (roles[rol]) {
          roles[rol] += 1;
        } else {
          roles[rol] = 1;
        }
      });

      const totalCount = usersData.length;
      const data = Object.keys(roles).map((rol) => ({
        name: rol,
        value: roles[rol],
        percentage: ((roles[rol] / totalCount) * 100).toFixed(2),
      }));

      setRoleData(data);
      return totalCount;
    } catch (error) {
      console.error("Error al obtener el conteo de usuarios:", error);
    }
  };

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const count = await getUsersCountFromApi();
        setUsersCount(count);
      } catch (error) {
        console.error("Error al obtener el conteo de usuarios:", error);
      }
    };

    fetchUsersCount();
  }, []);
  
  return (
    <div className="home-container">
      <Nav />
      <div className="squares-container">
        <div className="square square-1">
          <Link to="/register" className="square-link">
            <div className="icon-container">
              <FaUsers className="icon" />
            </div>
            <div className="text-container">
              <span className="count">{usersCount}</span> Usuarios Activos
            </div>
          </Link>
        </div>
        <div className="square square-2">
          <Link to="/section2" className="square-link">
            <div className="icon-container">
              <FaClipboardList className="icon" />
            </div>
            <div className="text-container">
             5 Proyectos
            </div>
          </Link>
        </div>
        <div className="square square-3">
          <Link to="/section3" className="square-link">
            <div className="icon-container">
              <FaTasks className="icon" />
            </div>
            <div className="text-container">
            20 Actividades 
            </div>
          </Link>
        </div>
            </div>

            <div className="card-container">
        <div className="card">
          <h2 className="card-title">Porcentaje de Roles de Usuarios</h2>
          <div className="chart-container">
          <PieChart width={800} height={800}>
              <Pie
                data={roleData}
                cx="50%"
                cy="35%"
                innerRadius={90}
                outerRadius={200}
                fill="#8884d8"
                paddingAngle={20}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percentage }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#000"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={20}
                    >
                      {`${value} (${percentage}%)`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {roleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, { payload }) => `${value} (${payload.percentage}%)`} />
            </PieChart>
          </div>
          
          <div className="color-legend-container">
            {roleData.map((entry, index) => (
              <div key={index} className="color-legend">
                <span className="color-legend__color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="color-legend__name">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
