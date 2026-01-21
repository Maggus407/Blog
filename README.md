# TanStack Start - Golden Standard Starter

This is a production-ready starter template featuring **TanStack Start**, **Drizzle ORM**, **Tailwind CSS v4**, **Shadcn UI**, **PostgreSQL**, and **DDEV**.

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

## Using this Template

After creating a new repository from this template, follow these steps to rename the project:

1.  **Update Project Name in `package.json`**:
    Change the `"name"` field to your project name.

2.  **Update DDEV Config in `.ddev/config.yaml`**:
    Change `name: template` to your desired project name (e.g., `name: my-app`).
    *Note: This will determine your local URL (e.g., `https://my-app.ddev.site`).*

3.  **Update Vite Config in `vite.config.ts`**:
    Update the `allowedHosts` array to match your new DDEV URL:
    ```ts
    allowedHosts: ['my-app.ddev.site'],
    ```

4.  **Start the Project**:
    ```bash
    ddev start
    ```

## Getting Started

1.  **Initialize the Environment**
    ```bash
    ddev start
    ```
    This automatically installs dependencies, sets up the database, and starts the development server.

2.  **Access the Application**
    Open [https://template.ddev.site](https://template.ddev.site)

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
