import { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { Context } from "../context";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.get("/user/admin/logout");
      toast.success(res.data.message);
      setIsAuthenticated(false);
      setAdmin({});
      setShow(false);
      navigateTo("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const goTo = (path) => {
    navigateTo(path);
    setShow(false);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome title="Dashboard" onClick={() => goTo("/")} />
          <FaUserDoctor title="Doctors" onClick={() => goTo("/doctors")} />
          <MdAddModerator title="Add New Admin" onClick={() => goTo("/admin/addnew")} />
          <IoPersonAddSharp title="Add New Doctor" onClick={() => goTo("/doctor/addnew")} />
          <AiFillMessage title="Messages" onClick={() => goTo("/messages")} />
          <RiLogoutBoxFill title="Logout" onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
