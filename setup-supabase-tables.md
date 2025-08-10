# Configuration des tables Supabase

## Étapes à suivre dans l'interface Supabase :

### 1. Accéder à l'interface SQL

1. Allez sur votre projet Supabase : https://supabase.com/dashboard/project/wyezkprcotvvospsepxw
2. Cliquez sur "SQL Editor" dans le menu de gauche
3. Cliquez sur "New query"

### 2. Exécuter le script SQL

Copiez et collez le contenu du fichier `supabase-schema.sql` dans l'éditeur SQL, puis cliquez sur "Run".

### 3. Vérifier que les tables sont créées

Après l'exécution, vous devriez voir :

- Table `games`
- Table `players`
- Table `game_actions`

### 4. Activer Realtime

1. Allez dans "Database" > "Replication"
2. Vérifiez que les tables suivantes ont Realtime activé :
   - `games`
   - `players`
   - `game_actions`

Si ce n'est pas le cas, exécutez ces commandes SQL :

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_actions;
```

### 5. Vérifier les politiques RLS

1. Allez dans "Database" > "Tables"
2. Vérifiez que chaque table a RLS activé
3. Vérifiez que les politiques sont créées (elles devraient permettre toutes les opérations)

## Test de connexion

Une fois les tables créées, vous pouvez tester la connexion en lançant l'application :

```bash
pnpm dev
```

Le composant `SupabaseStatus` devrait afficher "Connecté" si tout fonctionne correctement.
