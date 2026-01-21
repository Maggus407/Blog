# Blog Website - TanStack Start

This is a production-ready **Blog Website** featuring **TanStack Start**, **Drizzle ORM**, **Tailwind CSS v4**, **Shadcn UI**, **PostgreSQL**, and **DDEV**.

## Features

- **Framework**: [TanStack Start](https://tanstack.com/start) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration) + [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Drizzle ORM](https://orm.drizzle.team/))
- **Environment**: [DDEV](https://ddev.com/) for reproducible local development
- **Type Safety**: strict TypeScript
- **Linting**: ESLint + Prettier

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [DDEV](https://ddev.com/get-started/)


## Getting Started

1.  **Start the Project**
    ```bash
    ddev start
    ```
    This automatically installs dependencies, sets up the database, and starts the development server.

2.  **Access the Application**
    Open [https://blog.ddev.site](https://blog.ddev.site)

3.  **(Optional) Seed Database**
    To populate the database with initial data:
    ```bash
    ddev npm run db:seed
    ```

## Scripts

| Script | Description |
| :--- | :--- |
| `dev` | Start the development server |
| `build` | Build for production |
| `start` | Run the production build |
| `lint` | Run ESLint |
| `format` | Format code with Prettier |
| `db:push` | Push schema changes to DB (prototyping) |
| `db:generate` | Generate SQL migrations |
| `db:migrate` | Apply migrations |
| `db:studio` | Open Drizzle Studio |
| `db:seed` | Seed database with initial data |

## Project Structure

- `src/db`: Database schema, connection, and seed scripts.
- `src/routes`: File-based routing (TanStack Router).
- `.ddev`: DDEV configuration.

## Contributing

1.  Fork the repo
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Create a Pull Request
