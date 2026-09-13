# Déploiement continu sur Vercel

Le workflow `.github/workflows/ci.yml` vérifie chaque pull request vers `main` et chaque push sur `main`. Quand les vérifications passent sur `main`, il construit puis publie automatiquement la version de production sur Vercel.

## Fonctionnement

1. Installation reproductible avec `npm ci` et le lockfile committé.
2. Vérification des contenus, tests unitaires et lint.
3. Build Next.js, contrôle TypeScript (après génération des types Next.js), puis test HTTP du serveur de production.
4. Pour `main` uniquement : récupération des paramètres Vercel, build de production Vercel, publication de l’artefact avec `--prebuilt --prod`.
5. L’adresse publiée et le commit apparaissent dans le résumé GitHub Actions et dans l’environnement `production`.

Les pull requests n’ont pas accès aux secrets de déploiement. Les Actions sont épinglées par SHA, le CLI Vercel par version, les permissions GitHub sont limitées à la lecture du contenu. Dependabot propose les mises à jour des Actions chaque semaine. La version du CLI se met à jour explicitement dans `VERCEL_CLI_VERSION` après vérification.

Les exécutions sur `main` sont sérialisées, sans interrompre une publication en cours. Les exécutions de PR devenues obsolètes sont annulées. Juste avant publication, le workflow vérifie que le commit est toujours en tête de `main` ; sinon il laisse la nouvelle exécution publier. En cas de pushes rapprochés, les commits intermédiaires peuvent donc être ignorés. Si un push arrive pendant une publication déjà lancée, la nouvelle version passera ensuite.

## Configuration initiale — une seule fois

### 1. Créer ou lier le projet Vercel

Créer un projet Next.js à la racine du dépôt `pierrehanne/sigmath`. Choisir Node.js **22.x** dans Vercel pour correspondre au runner GitHub. Les commandes d’installation et de build sont définies dans `vercel.json`.

Pour lier le dossier local à ce projet :

```bash
npx vercel@59.16.0 login
npx vercel@59.16.0 link
```

Sélectionner le compte ou l’équipe puis le projet SigMath. Ces commandes lient le projet, elles ne publient pas le site. Le fichier local `.vercel/project.json` fournit les valeurs `orgId` et `projectId`. Le dossier `.vercel/` est ignoré par Git.

### 2. Ajouter les secrets GitHub

Dans le dépôt GitHub, ouvrir **Settings → Secrets and variables → Actions → New repository secret** :

| Secret | Valeur |
| --- | --- |
| `VERCEL_TOKEN` | Token créé dans les paramètres du compte Vercel, avec accès à l’équipe propriétaire du projet |
| `VERCEL_ORG_ID` | Champ `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Champ `projectId` de `.vercel/project.json` |

Les secrets peuvent aussi être placés dans l’environnement GitHub `production`. Ne pas les mettre dans le code ni les envoyer dans une conversation. Renouveler le token avant son expiration et mettre à jour le secret correspondant.

### 3. Préparer l’environnement GitHub

Créer **Settings → Environments → production**. Autoriser uniquement la branche `main`. Pour un déploiement entièrement automatique, ne pas ajouter d’approbation manuelle obligatoire à cet environnement.

Il est conseillé de protéger `main` avec une règle exigeant le contrôle **Quality gate** avant fusion des PR. Cette règle est à configurer dans GitHub ; les fichiers du dépôt ne l’activent pas à eux seuls.

### 4. Éviter les doubles publications

`vercel.json` désactive les déploiements Git natifs de Vercel pour `main`. Ainsi GitHub Actions contrôle la publication et attend les tests. Les previews natives sur les autres branches restent possibles si l’intégration GitHub de Vercel est connectée ; elles sont indépendantes de ce workflow.

Ne pas ajouter de règle Vercel `deploymentEnabled` à `true` qui corresponde aussi à `main` : elle réactiverait le déploiement natif. Un premier import depuis le tableau de bord peut nécessiter de lier le projet par CLI, puis de lancer le workflow.

### 5. Activer le pipeline

Committer et pousser les fichiers du site et les fichiers de CI sur `main`, puis ouvrir l’onglet **Actions → CI and Vercel**. Si le workflow était déjà présent avant l’ajout des secrets, utiliser **Run workflow** avec la branche `main` pour relancer les vérifications et la publication.

Cette automatisation publie une version du site à chaque push validé ; elle ne crée pas de tags SemVer ni de GitHub Releases.

## Vérification et incidents

Localement, le test HTTP s’exécute après un build :

```bash
npm run build
node scripts/smoke.mjs
```

Le script utilise le port local 3197 et arrête son serveur même si une vérification échoue. Il contrôle les pages principales, une leçon, la langue française, les redirections, les niveaux exclus et le sitemap.

Le contrôle HTTP de CI porte sur le build local. La publication Vercel attend le résultat de la commande de déploiement, mais ne réalise pas de test fonctionnel distant. Après la première publication, ouvrir l’URL du résumé et vérifier un cours et un jeu. Vérifier aussi le domaine définitif : les métadonnées, le sitemap et `robots.txt` utilisent actuellement `https://sigmath.org`.

- **Tests ou build en échec** : la production n’est pas déployée ; corriger l’étape en rouge puis pousser sur `main`.
- **Secret manquant** : le job de déploiement donne son nom, sans afficher sa valeur. Ajouter le secret puis relancer.
- **Erreur d’authentification Vercel** : vérifier l’expiration du token, l’équipe et les identifiants du projet.
- **Retour arrière** : restaurer une version depuis le tableau de bord Vercel, puis répercuter la correction dans Git (par exemple avec un revert du commit fautif) pour que les prochains pushes ne réintroduisent pas le problème.

## Références

- [GitHub Actions avec Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
- [Configuration des déploiements Git Vercel](https://vercel.com/docs/project-configuration/git-configuration)
- [Syntaxe GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
