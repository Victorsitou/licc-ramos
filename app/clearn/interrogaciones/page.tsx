import QuizIcon from "@mui/icons-material/Quiz";

import ProblemCollectionsPage from "@/app/clearn/components/ProblemCollectionsPage";

export default function InterrogacionesPage() {
  return (
    <ProblemCollectionsPage
      type="INTERROGACION"
      title="Interrogaciones"
      subtitle="Ensayos e interrogaciones anteriores para medir tu nivel."
      badge="LICC"
      sectionTitle="Interrogaciones disponibles"
      cardLabel="Interrogacion"
      ctaLabel="Ver problemas"
      icon={<QuizIcon fontSize="small" />}
      basePath="/clearn/interrogaciones"
    />
  );
}
