import FolderCopyIcon from "@mui/icons-material/FolderCopy";

import ProblemCollectionsPage from "@/app/clearn/components/ProblemCollectionsPage";

export default function CompiladosPage() {
  return (
    <ProblemCollectionsPage
      type="COMPILADO"
      title="Compilados"
      subtitle="Colecciones grandes de ejercicios mezclados para entrenamiento."
      badge="LICC"
      sectionTitle="Compilados disponibles"
      cardLabel="Compilado"
      ctaLabel="Ver problemas"
      icon={<FolderCopyIcon fontSize="small" />}
      basePath="/clearn/compilados"
    />
  );
}
