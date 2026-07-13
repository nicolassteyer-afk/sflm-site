# Flam's site

Site vitrine Next.js pour Flam's avec back-office CMS.

## Installation

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

## Variables

- `DATABASE_URL`: connexion PostgreSQL.
- `ADMIN_SESSION_SECRET`: secret long pour signer les sessions admin.
- `ADMIN_EMAIL` et `ADMIN_PASSWORD`: identifiants utilises par le seed et la creation admin.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: cle publique Google Maps JavaScript API pour activer la carte professionnelle du store locator. Sans cette cle, le site garde une carte de secours.

## Back-office

Le CMS est disponible sur `/admin`.

Pour creer ou reinitialiser un administrateur:

```bash
ADMIN_EMAIL="admin@flams.fr" ADMIN_PASSWORD="mot-de-passe-solide" npm run admin:create
```

Le back-office permet de gerer pages, blocs, restaurants, horaires, carte,
medias, navigation, footer, SEO et parametres globaux.

## Contenus publics

Les pages publiques principales lisent les donnees CMS quand la base est
configuree et gardent les contenus statiques actuels en secours.
