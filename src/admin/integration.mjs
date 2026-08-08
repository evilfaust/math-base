/**
 * Подключает админку блога только при `astro dev`.
 *
 * Файлы админки лежат в src/admin/, а не в src/pages/, поэтому Astro не
 * превращает их в маршруты автоматически. Единственный путь, которым они
 * попадают в приложение, — injectRoute ниже, и он отсекается по command.
 * Значит `astro build` физически не видит ни страницы, ни эндпоинтов:
 * в /dist ничего от админки не попадает и на VPS уезжать нечему.
 */
export function blogAdmin() {
  return {
    name: "blog-admin",
    hooks: {
      "astro:config:setup": ({ command, injectRoute, logger }) => {
        if (command !== "dev") return;

        injectRoute({
          pattern: "/admin",
          entrypoint: "./src/admin/AdminPage.astro",
          prerender: false,
        });

        for (const name of ["posts", "preview", "upload", "git"]) {
          injectRoute({
            pattern: `/api/admin/${name}`,
            entrypoint: `./src/admin/api/${name}.ts`,
            prerender: false,
          });
        }

        logger.info("админка блога доступна на /admin (только в dev)");
      },
    },
  };
}
