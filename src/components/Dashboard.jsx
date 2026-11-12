import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { Navigate } from "react-router-dom";
import { api, getErrorMessage } from "../api";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          api.get("/appointment/getall"),
          api.get("/user/admin/doctors"),
        ]);
        setAppointments(appointmentsRes.data.appointments || []);
        setDoctorCount((doctorsRes.data.doctors || []).length);
      } catch (error) {
        setAppointments([]);
        toast.error(getErrorMessage(error));
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await api.put(`/appointment/update/${appointmentId}`, {
        status,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin?.firstName && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
              <p>
                A dedicated healthcare professional at ZeeCare Medical
                Institute, this doctor offers compassionate, patient-centered
                care, using the latest medical advancements to ensure excellent
                outcomes.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{doctorCount}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date?.substring(0, 16)}</td>
                      <td>{`${appointment.doctor?.firstName ?? ""} ${appointment.doctor?.lastName ?? ""}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>
                        {appointment.hasVisited === true ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={6}>No Appointments Found!</td>
                  </tr>
                )}
            </tbody>
          </table>

        </div>
      </section>
    </>
  );
};

export default Dashboard;
