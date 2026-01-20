/**
 * Calcule le budget réel total du projet
 * 
 * Algorithme:
 * 1. Additionner TOUS les prix de TOUS les éléments
 * 2. SAUF: soustraire les prix des éléments parents qui ont des enfants
 *    (car les enfants sont déjà comptés dans le total)
 * 
 * Exemple:
 * - Élément A: 12$ (pas d'enfants) → compté
 * - Élément B: 12$ (pas d'enfants) → compté
 * - Élément C: 100$ avec enfants D et E → prix de C soustrait
 *   - Enfant D: 60$ → compté
 *   - Enfant E: 40$ → compté
 * Total = 12 + 12 + 60 + 40 = 124$ (le 100$ de C est soustrait)
 * 
 * @param elements - Tous les éléments du projet
 * @returns Le budget réel total
 */
export function calculateProjectActualBudget(
    elements: Array<{ id: number; price: string | number | null; parent_id: number | null }>
): number {
    // 1. Calculer la somme de TOUS les prix
    const totalAllPrices = elements.reduce((sum, element) => {
        const price = element.price ? Number(element.price) : 0;
        return sum + price;
    }, 0);

    // 2. Calculer la somme des prix des parents qui ont des enfants
    const parentsWithChildrenPrices = elements.reduce((sum, element) => {
        // Vérifier si cet élément a des enfants
        const hasChildren = elements.some(el => el.parent_id === element.id);

        if (hasChildren) {
            // Si l'élément a des enfants, ajouter son prix à la somme à soustraire
            const price = element.price ? Number(element.price) : 0;
            return sum + price;
        }

        return sum;
    }, 0);

    // 3. Retourner le total moins les prix des parents
    return totalAllPrices - parentsWithChildrenPrices;
}

/**
 * Formate un montant en dollars avec 2 décimales
 * 
 * @param amount - Le montant à formater
 * @returns Le montant formaté (ex: "75.00")
 */
export function formatBudget(amount: number): string {
    return amount.toFixed(2);
}

/**
 * Calcule la différence entre le budget estimé et le budget réel
 * 
 * @param estimatedBudget - Budget estimé par l'utilisateur
 * @param actualBudget - Budget réel calculé
 * @returns La différence (positif = sous budget, négatif = dépassement)
 */
export function calculateBudgetDifference(
    estimatedBudget: number | null,
    actualBudget: number
): number | null {
    if (estimatedBudget === null) return null;
    return estimatedBudget - actualBudget;
}

/**
 * Détermine si le projet est dans le budget
 * 
 * @param estimatedBudget - Budget estimé par l'utilisateur
 * @param actualBudget - Budget réel calculé
 * @returns true si dans le budget ou pas de budget estimé, false si dépassement
 */
export function isWithinBudget(
    estimatedBudget: number | null,
    actualBudget: number
): boolean {
    if (estimatedBudget === null) return true;
    return actualBudget <= estimatedBudget;
}

/**
 * Calcule le pourcentage du budget utilisé
 * 
 * @param estimatedBudget - Budget estimé par l'utilisateur
 * @param actualBudget - Budget réel calculé
 * @returns Le pourcentage (0-100+) ou null si pas de budget estimé
 */
export function calculateBudgetPercentage(
    estimatedBudget: number | null,
    actualBudget: number
): number | null {
    if (estimatedBudget === null || estimatedBudget === 0) return null;
    return (actualBudget / estimatedBudget) * 100;
}
