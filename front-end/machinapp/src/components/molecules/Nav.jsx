import { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaUserGear } from "react-icons/fa6";
import { TbPointFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { Icons } from "../atoms/icons/Icons";

import {
  HomeIcon,
  MapIcon,
  DocumentTextIcon,
  ServerIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const Nav = ({ rol }) => {
  const menus = [
    { name: "Inicio", link: "/home", icon: HomeIcon },
    {
      name: "Sitios",
      link: "#",
      icon: MapIcon,
      submenu: true,
      submenus: [
        { name: "Sedes", link: "/Sedes" },
        { name: "Areas", link: "/Areas" },
        { name: "Ambientes", link: "/Ambientes" },
      ],
    },
    {
      name: "Mantenimientos",
      link: "#",
      icon: DocumentTextIcon,
      submenu: true,
      submenus: [
        { name: "Registrar Solicitud", link: "/crearsolicitud" },
        { name: "Registrar Mantenimiento", link: "/crear_ficha_mantenimiento" },
        { name: "Solicitudes", link: "/solicitudes" },
      ],
    },
    { name: "Equipo y Maquinaria", link: "/Maquinas", icon: ServerIcon },
    { name: "Historial", link: "/Historial", icon: ClockIcon },
    {
      name: "Panel de control",
      link: "/Panelcontrol",
      icon: FaUserGear,
    },
  ];

  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(() => {
    const saved = localStorage.getItem("submenuOpen");
    return saved ? JSON.parse(saved) : {};
  });

  const handleSubmenuToggle = (name) => {
    setSubmenuOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    const storedSubmenuOpen = JSON.parse(localStorage.getItem("submenuOpen"));
    if (storedSubmenuOpen !== null) {
      setSubmenuOpen(storedSubmenuOpen);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submenuOpen", JSON.stringify(submenuOpen));
  }, [submenuOpen]);

 
  return (
    <section className="flex gap-6">
      <div
        className={`bg-[white] min-h-screen border shadow-md rounded-e-lg ${
          open ? "w-72" : "w-20"
        } duration-500 text-black px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-9 flex flex-col gap-4 relative">
          {menus?.map(
            (menu, i) =>
              (menu.name !== "Panel de control" || rol === "Administrador") && (
                <div key={i} className="relative">
                  <Link
                    to={menu?.link}
                    className={` ${
                      menu?.margin && "mt-96"
                    } group flex items-center text-sm gap-3.5 font-medium p-4 hover:shadow-md border-b shadow-sm hover:bg-gray-100 rounded-md`}
                    onClick={(e) => {
                      if (menu?.submenu) {
                        e.preventDefault();
                        handleSubmenuToggle(menu.name);
                      }
                    }}
                  >
                    <div className="p-1 rounded-full">
                      <Icons icon={menu.icon} />
                    </div>
                    <h2
                      style={{
                        transitionDelay: `${i + 3}00ms`,
                      }}
                      className={`whitespace-pre duration-500 ${
                        !open && "opacity-0 translate-x-28 overflow-hidden"
                      }`}
                    >
                      {menu?.name}
                    </h2>
                    <h2
                      className={`${
                        open && "hidden"
                      } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                    >
                      {menu?.name}
                    </h2>
                  </Link>
                  {menu?.submenu && (
                    <div
                      className={`ml-6 mt-2 flex flex-col gap-2 transition-all duration-500 ease-in-out transform ${
                        submenuOpen[menu.name]
                          ? "max-h-40 opacity-100 translate-y-0 pointer-events-auto"
                          : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      {menu?.submenus.map((submenu, j) => (
                        <Link
                          to={submenu?.link}
                          key={j}
                          className={`text-sm font-medium p-2 hover:shadow-md hover:bg-gray-100 rounded-md flex items-center gap-2`}
                        >
                          <TbPointFilled size={16} />
                          {submenu?.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default Nav;
