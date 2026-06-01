import FactCheckIcon from "@mui/icons-material/FactCheck";

import ProblemCollectionsPage from "@/app/clearn/components/ProblemCollectionsPage";

export default function ActividadesPage() {
  return (
    <ProblemCollectionsPage
      type="ACTIVIDAD"
      title="Actividades"
      subtitle="Actividades complementarias y material extra del curso."
      badge="LICC"
      sectionTitle="Actividades disponibles"
      cardLabel="Actividad"
      ctaLabel="Ver problemas"
      icon={<FactCheckIcon fontSize="small" />}
      basePath="/clearn/actividades"
    />
  );
}
