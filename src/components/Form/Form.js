import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav } from "../Nav/Nav";
import "./Form.css";
import Datetime from "react-datetime";
import { parse } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import Notification from "../Notification/Notification";
import { useAuth } from "../../context/authContext";

export const Form = () => {
  const [inputs, setInputs] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
    input8: "",
    input9: "",
    input10: "",
  });

  const [successNotification, setSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
    input8: "",
    input9: "",
    input10: "",
  });
  const [errorNotification, setErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [referidos, setReferidos] = useState([]);
  const [showReferidosModal, setShowReferidosModal] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const { user } = useAuth(); 
  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://api.geonames.org/countryInfoJSON", {
        params: {
          username: "giuli266", // Reemplaza con tu nombre de usuario de Geonames
          type: "JSON",
        },
      });
      setCountries(response.data.geonames);
    } catch (error) {
      console.error("Error al obtener la lista de países:", error);
    }
  };

  const fetchCities = async (countryCode) => {
    try {
      setSelectedCity(null); // Establecer la ciudad en null al cambiar de país
      const response = await axios.get("http://api.geonames.org/searchJSON", {
        params: {
          username: "giuli266", // Reemplaza con tu nombre de usuario de Geonames
          country: countryCode,
          type: "JSON",
        },
      });
      setCities(response.data.geonames);
      setFilteredCities(response.data.geonames);
    } catch (error) {
      console.error("Error al obtener la lista de ciudades:", error);
    }
  };

  useEffect(() => {
    setCurrentDate(new Date());
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "input4") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
      fetchCities(value);
    } else if (name === "input9") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
      setSelectedCity(value);
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }

    if (name === "input9") {
      const filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filteredCities);
    }
  };

  const handleCitySelect = (e) => {
    const { value } = e.target;
    setSelectedCity(value);
    setInputs((prevInputs) => ({
      ...prevInputs,
      input9: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedDate = parse(inputs.input7, "dd/MM/yyyy", new Date());
    if (selectedDate > currentDate) {
      setErrorNotification(true);
      setErrorMessage("La fecha de nacimiento no puede ser mayor a la fecha actual.");
      return;
    }

    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }

    try {
      const response = await axios.post(
        "https://giulianomuratore.com/384group/insertarfranquicias.php",
        formData
      );

      if (response.status === 200) {
        setSuccessNotification(true);
        setSuccessMessage("Datos guardados exitosamente");
        resetForm();
      } else {
        setErrorNotification(true);
        setErrorMessage("Error al guardar los datos");
      }
    } catch (error) {
      setErrorNotification(true);
      setErrorMessage("Error al guardar los datos");
    }
  };

  const resetForm = () => {
    setInputs({
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      input7: "",
      input8: "",
      input9: "",
      input10: "",
    });
    setErrors({});
    setErrorNotification(false);
    setErrorMessage("");
    setFilteredCities([]);
    setSelectedCity("");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (
      inputs.input1.trim() === "" ||
      inputs.input2.trim() === "" ||
      inputs.input3.trim() === "" ||
      inputs.input4.trim() === "" ||
      inputs.input5.trim() === "" ||
      inputs.input6.trim() === "" ||
      inputs.input7.trim() === "" ||
      inputs.input8.trim() === "" ||
      inputs.input9.trim() === "" ||
      inputs.input10.trim() === ""
    ) {
      isValid = false;
      setErrorNotification(true);
      setErrorMessage("¡Debe completar todos los datos!");
    } else if (inputs.input1.length > 30 || inputs.input2.length > 30) {
      isValid = false;
      setErrorNotification(true);
      setErrorMessage("¡El nombre debe tener máximo 30 caracteres!");
    } else if (inputs.input6.length !== 10 || !/^\d+$/.test(inputs.input3)) {
      isValid = false;
      setErrorNotification(true);
      setErrorMessage(
        "El teléfono debe ser numérico y tener 10 dígitos. Colócalo sin el 0 y sin el 15."
      );
    } else if (
      !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(inputs.input5)
    ) {
      isValid = false;
      setErrorNotification(true);
      setErrorMessage("¡El correo electrónico no es válido!");
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSuccessNotificationClose = () => {
    setSuccessNotification(false);
    setSuccessMessage("");
  };

  const handleErrorNotificationClose = () => {
    setErrorNotification(false);
  };

  const handleVerReferidos = async () => {
    try {
      const response = await axios.get("https://giulianomuratore.com/384group/insertarfranquicias.php");
  
      if (response.status === 200) {
        setReferidos(response.data); 
        setShowReferidosModal(true);
      } else {
        console.error("Error al obtener los referidos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener los referidos:", error);
    }
  };

  const handleCloseDataGrid = () => {
    setModalAnimation("hide");
    setTimeout(() => {
      setShowReferidosModal(false);
    }, 300);
  };

  if (!user) {
    return null;
  }

  const isValidDate = (current) => {
    return current.isBefore(currentDate);
  };

  const columns = [
    { field: "input1", headerName: "Nombre", width: 150 },
    { field: "input2", headerName: "Apellido", width: 150 },
    { field: "input3", headerName: "Documento", width: 150 },
    { field: "input5", headerName: "Email", width: 200 },
    { field: "input6", headerName: "Teléfono", width: 150 },
    { field: "input7", headerName: "Fecha de Nacimiento", width: 200 },
    { field: "input4", headerName: "País", width: 150 },
    { field: "input9", headerName: "Ciudad", width: 150 },
    { field: "input8", headerName: "Dirección", width: 200 },
  ];


  return (
    <div className="upload-form-container">
      <Nav></Nav>

      <h2>Cargar Referido</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="input1">Nombre:</label>
            <input
              type="text"
              name="input1"
              id="input1"
              value={inputs.input1}
              onChange={handleChange}
            />
            {errors.input1 && (
              <span className="error">{errors.input1}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="input2">Apellido:</label>
            <input
              type="text"
              name="input2"
              id="input2"
              value={inputs.input2}
              onChange={handleChange}
            />
            {errors.input2 && (
              <span className="error">{errors.input2}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="input3">Documento:</label>
            <input
              type="text"
              name="input3"
              id="input3"
              value={inputs.input3}
              onChange={handleChange}
              inputMode="numeric"
            />
            {errors.input3 && (
              <span className="error">{errors.input3}</span>
            )}
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="input7">Fecha de Nacimiento:</label>
            <Datetime
              name="input7"
              dateFormat="DD/MM/YYYY"
              timeFormat={false}
              inputProps={{ readOnly: true }}
              value={inputs.input7}
              onChange={(moment) => {
                const formattedDate = moment.isValid()
                  ? moment.format("DD/MM/YYYY")
                  : "";
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  input7: formattedDate,
                }));
              }}
              closeOnSelect={true}
              isValidDate={isValidDate}
              renderInput={(props) => (
                <input
                  {...props}
                  type="text"
                  name="input7"
                  id="input7"
                  value={inputs.input7}
                  onChange={handleChange}
                />
              )}
            />
          </div>
          <div className="input-group">
            <label htmlFor="input5">Email:</label>
            <input
              type="text"
              name="input5"
              id="input5"
              value={inputs.input5}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="input6">Teléfono:</label>
            <input
              type="text"
              name="input6"
              id="input6"
              value={inputs.input6}
              onChange={handleChange}
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="input4">País:</label>
            <select
              name="input4"
              id="input4"
              value={inputs.input4}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Seleccionar país</option>
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryCode}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="input9">Ciudad:</label>
            <select
              name="input9"
              id="input9"
              value={selectedCity}
              onChange={handleCitySelect}
              className="form-select"
            >
              <option value="">Seleccionar ciudad</option>
              {filteredCities.map((city) => (
                <option key={city.geonameId} value={city.name}>
                  {city.name}
                </option>
              ))}
              {selectedCity && !filteredCities.some((city) => city.name === selectedCity) && (
                <option value={selectedCity}>{selectedCity}</option>
              )}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="input8">Dirección:</label>
            <input
              type="text"
              name="input8"
              id="input8"
              value={inputs.input8}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="input10">Código Postal:</label>
            <input
              type="text"
              name="input10"
              id="input10"
              value={inputs.input10}
              onChange={handleChange}
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="container-buttons-form">
        <button type="submit" className="button-form">Guardar</button>
        <button type="button" className="button-form" onClick={handleVerReferidos}>
          Ver Referidos
        </button>
        </div>
      </form>

      {showReferidosModal && (
        <div className={`modal ${showReferidosModal ? "show" : ""} ${modalAnimation}`}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseDataGrid}>
              &times;
            </span>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid rows={referidos} columns={columns} pageSize={5} />
            </div>
          </div>
        </div>
      )}

      {successNotification && (
        <Notification
          message={successMessage}
          type="success"
          onClose={handleSuccessNotificationClose}
        />
      )}
      {errorNotification && (
        <Notification
          message={errorMessage}
          type="error"
          onClose={handleErrorNotificationClose}
        />
      )}
    </div>
  );
};

export default Form;
