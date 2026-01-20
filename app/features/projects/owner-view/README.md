# Architecture Refactorisée - Project Owner View

## 🏗️ Structure Modulaire

Ce dossier contient la version refactorisée du composant `ProjectOwnerView`, décomposée en modules maintenables.

## 📂 Organisation

```
owner-view/
├── hooks/           # Logique métier réutilisable
├── components/      # Composants UI de présentation
└── types.ts         # Types TypeScript partagés
```

## 🎣 Hooks Disponibles

### `useProjectData`
Gère le chargement et la synchronisation des données du projet.

**Retourne** :
- `project`: Données du projet
- `elements`: Liste des éléments
- `categories`: Catégories disponibles
- `timeEntries`: Entrées de temps
- `refetch()`: Fonction de rechargement

**Utilisation** :
```typescript
const { project, elements, refetch } = useProjectData(slug, locale);
```

### `useProjectBudget`
Calcule les métriques budgétaires du projet.

**Retourne** :
- `actualBudget`: Budget réel calculé
- `estimatedBudget`: Budget estimé
- `budgetDifference`: Différence
- `withinBudget`: Boolean de validation
- `budgetPercentage`: Pourcentage utilisé

**Utilisation** :
```typescript
const budgetData = useProjectBudget(project, elements);
```

### `useProjectElements`
Gère le CRUD complet des éléments du projet.

**Actions** :
- `handleAddElement()`: Ajouter un élément
- `handleToggleElementDone()`: Toggle état
- `handleDeleteElement()`: Supprimer un élément
- `resetForm()`: Réinitialiser le formulaire

**Utilisation** :
```typescript
const elementsManager = useProjectElements({ 
  slug, 
  onRefetch: refetch, 
  setElements 
});
```

### `useTimeEntries`
Gère les entrées de temps du projet.

**Actions** :
- `handleAddTimeEntry()`: Ajouter une entrée
- `handleDeleteTimeEntry()`: Supprimer une entrée

**Utilisation** :
```typescript
const timeManager = useTimeEntries({ 
  projectId: project?.id, 
  onRefetch: refetch, 
  setTimeEntries 
});
```

### `useProjectInfo`
Gère l'édition des informations du projet.

**Actions** :
- `handleSaveProjectInfo()`: Sauvegarder les modifications
- `handleImageUpload()`: Upload d'image
- `handleDeleteProject()`: Supprimer le projet
- `initEditedProject()`: Initialiser le formulaire

**Utilisation** :
```typescript
const projectInfo = useProjectInfo({ 
  project, 
  slug, 
  onRefetch: refetch 
});
```

## 🧩 Composants UI

### `ProjectStatsBar`
Affiche les statistiques du projet (progression, temps, budget).

### `ProjectInfoSection`
Section d'affichage et d'édition des informations du projet.

### `ProjectElementsSection`
Section de gestion des éléments du projet.

### `TimeTrackingSection`
Section de suivi du temps passé sur le projet.

### `ProjectGallerySection`
Section d'affichage de la galerie du projet.

## 🔄 Flux de Données

```
ProjectOwnerView (Orchestrateur)
    │
    ├─> useProjectData ────> Fetch API
    │
    ├─> useProjectBudget ──> Calculs
    │
    ├─> useProjectElements ─> CRUD API
    │
    ├─> useTimeEntries ─────> CRUD API
    │
    └─> useProjectInfo ─────> CRUD API
         │
         └─> Composants UI (Présentation)
```

## 🎯 Principes Appliqués

1. **Séparation des préoccupations** : Logique vs Présentation
2. **Single Responsibility** : Un hook = Une responsabilité
3. **Composition** : Assemblage de modules simples
4. **Testabilité** : Hooks et composants testables unitairement
5. **Réutilisabilité** : Hooks réutilisables dans d'autres contextes

## 📈 Métriques

| Métrique | Avant | Après |
|----------|-------|-------|
| Lignes par fichier | 1066 | <200 |
| Nombre de fichiers | 1 | 12 |
| États par composant | 20+ | 2-5 |
| Testabilité | ❌ | ✅ |
| Maintenabilité | ❌ | ✅ |

## 🚀 Migration

Pour utiliser la nouvelle architecture :

1. Importer depuis le module :
```typescript
import { 
  useProjectData, 
  useProjectBudget 
} from '@/app/features/projects/owner-view/hooks';
```

2. Utiliser dans votre composant :
```typescript
export function MyComponent({ slug }: Props) {
  const { project, refetch } = useProjectData(slug, locale);
  const budgetData = useProjectBudget(project, elements);
  
  return <ProjectStatsBar {...budgetData} />;
}
```

## 📚 Ressources

- [React Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Component Composition](https://react.dev/learn/passing-props-to-a-component)

