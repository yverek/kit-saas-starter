# SvelteKit SaaS Starter

Bootstrap your next SaaS project with this SvelteKit template. 🚀

🌍 Live: https://kit-saas-starter.pages.dev/

## How to use

Clone this repo with

```bash
pnpm dlx degit --mode=git yverek/kit-saas-starter my-project
cd my-project
pnpm install
cp wrangler.example.toml wrangler.toml
```

Go to [Cloudflare](cloudflare.com) and [deploy](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-site/) this project.

Log in with your Cloudflare account by running:

```bash
pnpm exec wrangler login
```

Now create your D1 database with

```bash
$ pnpm exec wrangler d1 create my-db-prod

✅ Successfully created DB "my-db-prod"

[[d1_databases]]
binding = "DB"
database_name = "my-db-prod"
database_id = "<unique-ID-for-your-database>"
```

Go to `wrangler.toml` and change `database_name` and `database_id`.

Go to `drizzle.config.ts` and change `dbName`.

Go to `package.json` and change dbName in `drizzle:push:dev` and `drizzle:push:prod`.

```bash
pnpm drizzle:push:dev
```

Now, you can run

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Testing

Install Playwright testing tools with

```bash
pnpm exec playwright install
```

Run

```bash
pnpm test
```

## Deploy

Just migrate schema to production database

```bash
pnpm drizzle:push:prod
```
