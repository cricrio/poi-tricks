# Roadmap

## Phase 1: Astro

-   [x] Poi-trick with Astro
-   [x] Poi-trick with Astro

## Phase 2: Contributions

- [ ] Edit trick page
- [ ] Moderate contributions page

## Individual tasks

- [x] CRUD for tags
- [x] CRUD for tags
- [x] Use tags instead of types
- [ ] Display if tags is used in trick or contributions
- [ ] Prevent tag suppression if used in trick or contributions
- [ ] Update import script to use tags instead of types
- [ ] Remove prisma tags from database barrel roll. The database should not be needed to run the tests.
- [ ] User management
  -  [ ] Role management
  -  [ ] List of users
- [ ] Limit tags deletion to ADMIN role only
- [ ] Mono repo architecture with pnnpm then move import script inside it
- [ ] Block redirection on config tag page if a input is modified
- [ ] Errors boundaries and 404 pages
- [ ] Decide whether to use username or name.
- [ ] Toggle dark theme
- [ ] Pagination
- [ ] Improve design of Save trick button
- [ ] Use i18n
- [ ] Add error boundary
- [ ] Improve join workflows
- [ ] Natural sort with prisma (at this time Z is before a) [Solution](https://github.com/prisma/prisma/issues/3707#issuecomment-1165701760)
- [ ] Log everything action, keep track of every actions (CRUD des tags)
- [ ] Create a storybook to development and improve components in insulations
- [ ] Better handling of Prisma enum (TrickDifficulty)
- [ ] Fix broken test `thread 'tokio-runtime-worker' panicked` mallocs errors
- [ ] Consider the use of `remix-flat-routes/`
- [] Youtube preview download for the preview https://github.com/twarped/tattered-lead-archaeopteryx/ + https://github.com/ffmpegwasm/ffmpeg.wasm/tree/main/apps/react-vite-app