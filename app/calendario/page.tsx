"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";

import { ramos } from "../utils";

import MainLayout from "../components/layout/MainLayout";

import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../calendar.css";

moment.updateLocale("es", {
  week: {
    dow: 1,
  },
});
moment.locale("es");
const localizer = momentLocalizer(moment);

const COLORS: Record<number, string> = {
  1: "#3b82f6", // blue
  2: "#22c55e", // green
  3: "#f97316", // orange
  4: "#ef4444", // red
  5: "#a855f7", // purple
  6: "#06b6d4", // cyan
  7: "#ec4899", // pink
  8: "#eab308", // yellow
};

const MODULOS = {
  2: {
    inicio: "09:40",
    fin: "10:50",
  },
  4: {
    inicio: "12:20",
    fin: "13:30",
  },
};

const messages = {
  today: "Hoy",
  previous: "Anterior",
  next: "Siguiente",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total: number) => `+ Ver más (${total})`,
};

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function fechasConHoras(fecha: string, modulo: number) {
  const horario = MODULOS[modulo as keyof typeof MODULOS];

  const start = new Date(`${fecha}T${horario.inicio}:00`);
  const end = new Date(`${fecha}T${horario.fin}:00`);

  return { start, end, modulo };
}
function calendarEvents() {
  const interrogaciones = ramos.flatMap((ramo) =>
    ramo.info_interrogaciones.map((interrogacion) => ({
      id: `${ramo.sigla}-i${interrogacion.interrogacion}`,
      title: `${ramo.sigla} - I${interrogacion.interrogacion}`,
      start: fechasConHoras(interrogacion.fecha, interrogacion.modulo).start,
      end: fechasConHoras(interrogacion.fecha, interrogacion.modulo).end,

      type: "interrogacion",
      sigla: ramo.sigla,
      clase: null,
      interrogacion: interrogacion.interrogacion,
    })),
  );
  const clases = ramos.flatMap((ramo) =>
    ramo.info_clases.map((clase) => ({
      id: `${ramo.sigla}-c${clase.clase}`,
      title: `${ramo.sigla} - Clase ${clase.clase}`,
      start: parseLocalDate(clase.fecha),
      end: new Date(parseLocalDate(clase.fecha).getTime() + 60 * 60 * 1000),

      type: "clase",
      sigla: ramo.sigla,
      clase: clase.clase,
      interrogacion: clase.interrogacion || 0,
    })),
  );
  return [...interrogaciones, ...clases];
}

export default function CalendarPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [view, setView] = useState<"agenda" | "month">(
    isMobile ? "agenda" : "month",
  );
  useEffect(() => {
    setView(isMobile ? "agenda" : "month");
  }, [isMobile]);

  return (
    <MainLayout title="Calendario" fullWidth>
      <div className="h-[calc(100vh-120px)] p-2 sm:p-4 md:p-8">
        <Calendar
          messages={messages}
          style={{ height: "100%" }}
          localizer={localizer}
          events={calendarEvents()}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                COLORS[event.interrogacion as keyof typeof COLORS] || "#6b7280",
              borderRadius: "8px",
              border: "none",
              color: "white",
              padding: "2px 6px",
            },
          })}
          onSelectEvent={(event) => {
            if (event.type == "clase") {
              router.push(`/${event.sigla}/clases/${event.clase}`);
            }
          }}
          views={{ month: true, agenda: true }}
          view={view}
          onView={(newView) => {
            setView(newView as "month" | "agenda");
          }}
        />
      </div>
    </MainLayout>
  );
}
