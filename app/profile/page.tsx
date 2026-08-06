"use client";

import { useEffect, useState } from "react";
import { getUser, User, getRamos, RamoInterface } from "@/app/utils";
import { updateUser } from "@/app/services/users";

import MainLayout from "../components/layout/MainLayout";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function Profile() {
  const [tab, setTab] = useState("0");
  const [user, setUser] = useState<User | null>(null);
  const [ramos, setRamos] = useState<RamoInterface[]>([]);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
    getRamos().then((ramos) => {
      setRamos(ramos);
    });
  }, []);

  if (!user) {
    return <div>Cargando...</div>;
  }

  const handleToggleRamo = (sigla: string, checked: boolean) => {
    if (!user) return;

    const updatedCourses = checked
      ? [...user.courses, sigla]
      : user.courses.filter((course) => course !== sigla);

    updateUser({ courses: updatedCourses }).then(() => {
      setUser({ ...user, courses: updatedCourses });
    });
  };

  return (
    <MainLayout title="Configuración de perfil">
      <TabContext value={tab}>
        <TabList onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Ramos inscritos" value="0" />
        </TabList>
        <TabPanel value="0">
          <div className="flex flex-col gap-4">
            {ramos.map((ramo) => (
              <Box
                key={ramo.sigla}
                sx={{
                  width: "fit-content",
                  display: "flex",
                  alignItems: "center",
                }}
                className="gap-2 border border-border p-4 rounded-xl shadow-sm transition hover:scale-105 hover:border-primary hover:shadow-lg cursor-pointer"
              >
                <Checkbox
                  checked={user.courses.includes(ramo.sigla)}
                  onChange={(e) =>
                    handleToggleRamo(ramo.sigla, e.target.checked)
                  }
                />
                <span>
                  {ramo.nombre} ({ramo.sigla})
                </span>
              </Box>
            ))}
          </div>
        </TabPanel>
      </TabContext>
    </MainLayout>
  );
}
