import AssignmentIcon from "@mui/icons-material/Assignment";

import ProblemCollectionsPage from "@/app/clearn/components/ProblemCollectionsPage";

export default function SetsPage() {
  return (
    <ProblemCollectionsPage
      type="SET"
      title="Sets"
      subtitle="Practica organizada por unidades."
      badge="LICC"
      sectionTitle="Sets disponibles"
      cardLabel="Set"
      ctaLabel="Ver problemas"
      icon={<AssignmentIcon fontSize="small" />}
      basePath="/clearn/sets"
    />
  );
}