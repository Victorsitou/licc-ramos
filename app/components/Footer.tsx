export default function Footer() {
  return (
    <footer className="text-black dark:text-white font-bold py-4 items-center justify-center w-full">
      <div className="container mx-auto text-center">
        <p>
          Hecho con ♥️ por{" "}
          <a
            href="https://github.com/Victorsitou"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Victor
          </a>{" "}
          y{" "}
          <a
            href="https://github.com/Ssj400"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            José
          </a>{" "}
          -{" "}
          <a
            href="https://github.com/Victorsitou/licc-ramos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Código en GitHub
          </a>
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Cualquier sugerencia o error, no dudes en contactarme por correo{" "}
          <a
            href="mailto:vvegaa5@estudiante.uc.cl"
            className="text-blue-500 hover:underline"
          >
            vvegaa5@estudiante.uc.cl
          </a>
        </p>
      </div>
    </footer>
  );
}
