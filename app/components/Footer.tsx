export default function Footer() {
  return (
    <footer className="w-full items-center justify-center py-4 text-foreground">
      <div className="container mx-auto text-center">
        <p className="font-bold">
          Hecho con ♥️ por{" "}
          <a
            href="https://github.com/Victorsitou"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition hover:underline"
          >
            Victor
          </a>{" "}
          y{" "}
          <a
            href="https://github.com/Ssj400"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition hover:underline"
          >
            José
          </a>{" "}
          -{" "}
          <a
            href="https://github.com/Victorsitou/licc-ramos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition hover:underline"
          >
            Código en GitHub
          </a>
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Cualquier sugerencia o error, no dudes en contactarme por correo{" "}
          <a
            href="mailto:vvegaa5@estudiante.uc.cl"
            className="text-primary transition hover:underline"
          >
            vvegaa5@estudiante.uc.cl
          </a>
        </p>
      </div>
    </footer>
  );
}
