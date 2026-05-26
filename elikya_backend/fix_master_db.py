import pandas as pd
from pathlib import Path
import re
import shutil

# ============================================================================
# Dictionnaire de base : corrections manuelles essentielles
# ============================================================================
BASE_CORRECTIONS = {
    # Mathématiques
    'rsoudre': 'résoudre', 'resoudre': 'résoudre',
    'quation': 'équation', 'equation': 'équation', 'equa': 'équation',
    'degr': 'degré', 'degre': 'degré',
    'derivee': 'dérivée', 'derive': 'dérivée', 'deriv': 'dérivée',
    'fonction': 'fonction', 'fonct': 'fonction', 'fonc': 'fonction',
    'limite': 'limite', 'limit': 'limite',
    'probabilite': 'probabilité', 'probabil': 'probabilité',
    'calcul': 'calcul', 'calculer': 'calculer', 'calc': 'calculer',
    'integrale': 'intégrale', 'integral': 'intégrale',
    'vecteur': 'vecteur', 'vect': 'vecteur', 'vecto': 'vecteur',
    'matrice': 'matrice', 'matric': 'matrice',
    'geometrie': 'géométrie', 'geometr': 'géométrie', 'geom': 'géométrie',
    'trigonom': 'trigonométrie', 'trigonometrie': 'trigonométrie', 'trigo': 'trigonométrie',
    'theoreme': 'théorème', 'theor': 'théorème',
    'demonstration': 'démonstration', 'demonstr': 'démonstration', 'demo': 'démonstration',
    'ensemble': 'ensemble', 'ensemb': 'ensemble',
    'nombre': 'nombre', 'nomb': 'nombre',
    'entier': 'entier', 'ent': 'entier',
    'rationnel': 'rationnel', 'ration': 'rationnel',
    'reel': 'réel', 're': 'réel',
    'complexe': 'complexe', 'complex': 'complexe',
    'suite': 'suite', 'suites': 'suite',
    'serie': 'série', 'seri': 'série',
    'converge': 'convergence', 'converg': 'convergence',
    'primitiv': 'primitive', 'primitive': 'primitive',
    'inéquation': 'inéquation', 'inequa': 'inéquation',
    'systeme': 'système', 'syst': 'système',
    'mathematique': 'mathématique', 'mathemat': 'mathématique',
    'maths': 'mathématiques', 'math': 'mathématiques',
    'algebre': 'algèbre', 'algeb': 'algèbre',
    'analyse': 'analyse', 'analys': 'analyse',
    'statistique': 'statistique', 'statist': 'statistique',
    'discret': 'discret', 'discre': 'discret',
    'continu': 'continu', 'continuite': 'continuité',
    'derivation': 'dérivation', 'derivees': 'dérivées',
    'integrales': 'intégrales', 'integration': 'intégration',
    'equations': 'équations', 'equadiff': 'équation différentielle',
    'matrices': 'matrices', 'vecteurs': 'vecteurs',
    'cercle': 'cercle', 'triangle': 'triangle', 'carre': 'carré',
    'rectangle': 'rectangle', 'losange': 'losange',
    'parallelogramme': 'parallélogramme', 'trapeze': 'trapèze',
    'pythagore': 'Pythagore', 'thales': 'Thalès',
    'cours': 'cours', 'exercice': 'exercice', 'exercices': 'exercices',
    'probleme': 'problème', 'problemes': 'problèmes',
    'solution': 'solution', 'solutions': 'solutions',
    'racine': 'racine', 'racines': 'racines',
    'discriminant': 'discriminant', 'discri': 'discriminant',
    'somme': 'somme', 'produit': 'produit', 'quotient': 'quotient',
    'difference': 'différence', 'egalite': 'égalité', 'inegalite': 'inégalité',
    'numerique': 'numérique', 'algebrique': 'algébrique', 'analytique': 'analytique',

    # Français
    'grammaire': 'grammaire', 'gramm': 'grammaire',
    'conjugaison': 'conjugaison', 'conjug': 'conjugaison',
    'orthographe': 'orthographe', 'ortho': 'orthographe',
    'vocabulaire': 'vocabulaire', 'vocab': 'vocabulaire',
    'syntaxe': 'syntaxe', 'synt': 'syntaxe',
    'subjonctif': 'subjonctif', 'subj': 'subjonctif',
    'indicatif': 'indicatif', 'indic': 'indicatif',
    'conditionnel': 'conditionnel', 'condit': 'conditionnel',
    'participe': 'participe', 'particip': 'participe',
    'infinitif': 'infinitif', 'infini': 'infinitif',
    'phrase': 'phrase', 'phras': 'phrase',
    'proposition': 'proposition', 'propos': 'proposition',
    'relative': 'relative', 'relativ': 'relative',
    'complement': 'complément', 'complem': 'complément',
    'litterature': 'littérature', 'litterat': 'littérature',
    'poesie': 'poésie', 'poes': 'poésie',
    'theatre': 'théâtre', 'theatr': 'théâtre',
    'dissertation': 'dissertation', 'dissert': 'dissertation',
    'commentaire': 'commentaire', 'comment': 'commentaire',
    'argumentation': 'argumentation', 'argument': 'argumentation',
    'resume': 'résumé', 'resumer': 'résumer',
    'redaction': 'rédaction', 'rediger': 'rédiger',
    'ecrire': 'écrire', 'ecriture': 'écriture',
    'lecture': 'lecture', 'lire': 'lire',
    'comprendre': 'comprendre', 'comprehension': 'compréhension',
    'expression': 'expression', 'exprimer': 'exprimer',
    'argumenter': 'argumenter', 'convaincre': 'convaincre',
    'persuader': 'persuader', 'informer': 'informer',
    'desinformer': 'désinformer', 'manipuler': 'manipuler',
    'critique': 'critique', 'analyser': 'analyser',
    'comparer': 'comparer', 'opposer': 'opposer',
    'nuancer': 'nuancer', 'illustrer': 'illustrer',
    'exemplifier': 'exemplifier', 'citer': 'citer',
    'reference': 'référence', 'source': 'source', 'document': 'document',
    'oeuvre': 'œuvre', 'auteur': 'auteur', 'personnage': 'personnage',
    'intrigue': 'intrigue', 'theme': 'thème', 'idee': 'idée',
    'message': 'message', 'morale': 'morale', 'symbolique': 'symbolique',
    'metaphore': 'métaphore', 'metonymie': 'métonymie', 'allegorie': 'allégorie',
    'ironie': 'ironie', 'humour': 'humour', 'sarcasme': 'sarcasme',
    'registre': 'registre', 'ton': 'ton', 'style': 'style',
    'genre': 'genre', 'roman': 'roman', 'nouvelle': 'nouvelle',
    'poeme': 'poème', 'tragedie': 'tragédie', 'comedie': 'comédie',
    'drame': 'drame', 'essai': 'essai', 'article': 'article',
    'journal': 'journal', 'lettre': 'lettre', 'correspondance': 'correspondance',
    'autobiographie': 'autobiographie', 'biographie': 'biographie',
    'memoire': 'mémoire', 'histoire': 'histoire', 'conte': 'conte',
    'fable': 'fable', 'legend': 'légende', 'mythe': 'mythe',
    'epopee': 'épopée', 'recit': 'récit', 'narration': 'narration',
    'description': 'description', 'dialogue': 'dialogue', 'monologue': 'monologue',
    'discours': 'discours', 'explication': 'explication',
    'synthese': 'synthèse', 'interpretation': 'interprétation',
    'jugement': 'jugement', 'appreciation': 'appréciation', 'evaluation': 'évaluation',
    'comparaison': 'comparaison', 'contraste': 'contraste', 'similitude': 'similitude',
    'rapport': 'rapport', 'lien': 'lien', 'relation': 'relation',
    'correlation': 'corrélation', 'causalite': 'causalité',
    'consequence': 'conséquence', 'condition': 'condition',
    'hypothese': 'hypothèse', 'these': 'thèse', 'antithese': 'antithèse',
    'preuve': 'preuve', 'exemple': 'exemple', 'illustration': 'illustration',
    'citation': 'citation', 'temoignage': 'témoignage', 'fait': 'fait',
    'donnee': 'donnée', 'enquete': 'enquête', 'sondage': 'sondage',
    'experience': 'expérience', 'observation': 'observation',
    'experimentation': 'expérimentation', 'simulation': 'simulation',
    'modele': 'modèle', 'theorie': 'théorie',
    'postulat': 'postulat', 'axiome': 'axiome', 'definition': 'définition',
    'propriete': 'propriété', 'caracteristique': 'caractéristique',
    'particularite': 'particularité', 'specificite': 'spécificité',
    'generalite': 'généralité', 'principe': 'principe', 'regle': 'règle',
    'loi': 'loi', 'raisonnement': 'raisonnement', 'logique': 'logique',
    'deduction': 'déduction', 'induction': 'induction', 'abduction': 'abduction',
    'analogie': 'analogie', 'symbole': 'symbole', 'signe': 'signe',
    'indice': 'indice', 'trace': 'trace', 'vestige': 'vestige',
    'reste': 'reste', 'fragment': 'fragment', 'morceau': 'morceau',
    'partie': 'partie', 'element': 'élément', 'composant': 'composant',
    'constituant': 'constituant', 'facteur': 'facteur', 'parametre': 'paramètre',
    'variable': 'variable', 'constante': 'constante', 'inconnue': 'inconnue',
    'resultat': 'résultat', 'reponse': 'réponse', 'conclusion': 'conclusion',
    'decision': 'décision', 'choix': 'choix', 'option': 'option',
    'alternative': 'alternative', 'possibilite': 'possibilité',
    'eventualite': 'éventualité', 'chance': 'chance', 'risque': 'risque',
    'danger': 'danger', 'securite': 'sécurité', 'protection': 'protection',
    'prevention': 'prévention', 'anticipation': 'anticipation',
    'prediction': 'prédiction', 'prevision': 'prévision', 'projection': 'projection',
    'estimation': 'estimation', 'mesure': 'mesure', 'compte': 'compte',
    'denombrement': 'dénombrement', 'recensement': 'recensement', 'inventaire': 'inventaire',
    'liste': 'liste', 'sequence': 'séquence', 'succession': 'succession',
    'ordre': 'ordre', 'rang': 'rang', 'classement': 'classement',
    'categorie': 'catégorie', 'type': 'type', 'espece': 'espèce',
    'classe': 'classe', 'groupe': 'groupe', 'famille': 'famille',
    'collection': 'collection', 'amas': 'amas', 'agregat': 'agrégat',
    'total': 'total', 'moyenne': 'moyenne', 'mediane': 'médiane',
    'mode': 'mode', 'ecart': 'écart', 'variance': 'variance', 'ecart type': 'écart type',
    'deviation': 'déviation', 'dispersion': 'dispersion',
    'dependance': 'dépendance', 'independance': 'indépendance',
    'transformation': 'transformation', 'operation': 'opération',
    'action': 'action', 'processus': 'processus', 'mecanisme': 'mécanisme',
    'structure': 'structure', 'organisation': 'organisation',
    'agencement': 'agencement', 'disposition': 'disposition',
    'arrangement': 'arrangement', 'configuration': 'configuration',
    'forme': 'forme', 'figure': 'figure', 'dessin': 'dessin',
    'schema': 'schéma', 'diagramme': 'diagramme', 'graphique': 'graphique',
    'courbe': 'courbe', 'tableau': 'tableau', 'reseau': 'réseau',
    'arbre': 'arbre', 'graphe': 'graphe', 'chemin': 'chemin',
    'parcours': 'parcours', 'itineraire': 'itinéraire', 'trajet': 'trajet',
    'distance': 'distance', 'longueur': 'longueur', 'largeur': 'largeur',
    'hauteur': 'hauteur', 'profondeur': 'profondeur', 'epaisseur': 'épaisseur',
    'aire': 'aire', 'surface': 'surface', 'volume': 'volume',
    'capacite': 'capacité', 'contenance': 'contenance', 'masse': 'masse',
    'poids': 'poids', 'densite': 'densité', 'concentration': 'concentration',
    'temperature': 'température', 'pression': 'pression', 'energie': 'énergie',
    'puissance': 'puissance', 'travail': 'travail', 'chaleur': 'chaleur',
    'froid': 'froid', 'vitesse': 'vitesse', 'acceleration': 'accélération',
    'force': 'force', 'moment': 'moment', 'impulsion': 'impulsion',
    'quantite de mouvement': 'quantité de mouvement', 'champ': 'champ',
    'potentiel': 'potentiel', 'flux': 'flux', 'intensite': 'intensité',
    'tension': 'tension', 'resistance': 'résistance', 'conductance': 'conductance',
    'inductance': 'inductance', 'impedance': 'impédance', 'frequence': 'fréquence',
    'periode': 'période', 'longueur d onde': 'longueur d\'onde',
    'amplitude': 'amplitude', 'phase': 'phase', 'dephasage': 'déphasage',
    'resonance': 'résonance', 'interference': 'interférence', 'diffraction': 'diffraction',
    'polarisation': 'polarisation', 'reflexion': 'réflexion', 'refraction': 'réfraction',
    'absorption': 'absorption', 'emission': 'émission', 'spectre': 'spectre',
    'rayonnement': 'rayonnement', 'radioactivite': 'radioactivité', 'fission': 'fission',
    'fusion': 'fusion', 'reaction nucleaire': 'réaction nucléaire',
    'particule': 'particule', 'atome': 'atome', 'noyau': 'noyau',
    'electron': 'électron', 'proton': 'proton', 'neutron': 'neutron',
    'photon': 'photon', 'matiere': 'matière', 'antimatiere': 'antimatière',
    'vide': 'vide', 'cosmos': 'cosmos', 'univers': 'univers',
    'galaxie': 'galaxie', 'etoile': 'étoile', 'planete': 'planète',
    'satellite': 'satellite', 'comete': 'comète', 'asteroide': 'astéroïde',
    'trou noir': 'trou noir', 'supernova': 'supernova', 'big bang': 'big bang',
    'expansion': 'expansion', 'relativite': 'relativité', 'gravitation': 'gravitation',
    'mecanique quantique': 'mécanique quantique', 'theorie des cordes': 'théorie des cordes',
    'biologie': 'biologie', 'biol': 'biologie', 'bio': 'biologie',
    'cellule': 'cellule', 'cellul': 'cellule', 'mitose': 'mitose', 'meiose': 'méiose',
    'photosynthese': 'photosynthèse', 'respiration': 'respiration',
    'genetique': 'génétique', 'adn': 'ADN', 'arn': 'ARN',
    'proteine': 'protéine', 'enzyme': 'enzyme', 'metabolisme': 'métabolisme',
    'homeostasie': 'homéostasie', 'reproduction': 'reproduction',
    'developpement': 'développement', 'ecosysteme': 'écosystème',
    'biodiversite': 'biodiversité',
    'physique': 'physique', 'chimie': 'chimie',
    'sciences': 'sciences', 'technologie': 'technologie',
    'informatique': 'informatique', 'intelligence artificielle': 'intelligence artificielle',
    'apprentissage automatique': 'apprentissage automatique', 'deep learning': 'deep learning',
    'data science': 'data science', 'big data': 'big data',
    'cloud computing': 'cloud computing', 'cybersecurite': 'cybersécurité',
    'cryptographie': 'cryptographie', 'blockchain': 'blockchain',
    'algorithme': 'algorithme', 'programmation': 'programmation',
    'code': 'code', 'api': 'API', 'docker': 'Docker', 'kubernetes': 'Kubernetes',
    'react': 'React', 'python': 'Python', 'javascript': 'JavaScript',
}

# ============================================================================
# Génération automatique de variantes orthographiques (accents, lettres doubles, etc.)
# ============================================================================
def generate_variations(word, correct):
    """
    Génère des variations courantes d'un mot : accents manquants, lettres doubles,
    suppression de lettres, etc. Retourne un dictionnaire {variante: correct}
    """
    variants = {}
    # 1. Suppression des accents (déjà fait via unidecode, mais on anticipe)
    # 2. Doublons de lettres (ex: 'tt' pour 't')
    if len(word) > 2:
        for i in range(len(word)-1):
            if word[i] == word[i+1]:
                variants[word[:i] + word[i+1:]] = correct
        # ajout de doubles lettres aléatoires (pour les fautes)
        for i in range(len(word)):
            variants[word[:i] + word[i]*2 + word[i:]] = correct
    # 3. Échange de lettres voisines (fréquent)
    for i in range(len(word)-1):
        swapped = word[:i] + word[i+1] + word[i] + word[i+2:]
        variants[swapped] = correct
    # 4. Suppression d'une lettre (surtout les doublons)
    for i in range(len(word)):
        variants[word[:i] + word[i+1:]] = correct
    # 5. Remplacement de 'e' par 'é', 'è', 'ê'
    if 'e' in word:
        variants[word.replace('e', 'é')] = correct
        variants[word.replace('e', 'è')] = correct
        variants[word.replace('e', 'ê')] = correct
    return variants

# ============================================================================
# Expansion à partir des verbes d'expansion (importé)
# ============================================================================
try:
    from src.model.verb_expansion import VERB_EXPANSION
except ImportError:
    VERB_EXPANSION = {}

# Construction du dictionnaire final CORRECTIONS
CORRECTIONS = dict(BASE_CORRECTIONS)

# Ajouter toutes les variantes générées pour chaque correction
for wrong, right in list(BASE_CORRECTIONS.items()):
    for var in generate_variations(wrong, right):
        if var not in CORRECTIONS:
            CORRECTIONS[var] = right

# Ajouter les verbes d'expansion
for abrev, complet in VERB_EXPANSION.items():
    if abrev not in CORRECTIONS:
        CORRECTIONS[abrev] = complet

# ============================================================================
# Correction heuristique finale (accentuation et nettoyage)
# ============================================================================
def corriger_texte(texte: str) -> str:
    if not isinstance(texte, str):
        return texte
    mots = re.findall(r'\b\w+\b', texte)
    mots_corriges = []
    for mot in mots:
        mot_lower = mot.lower()
        if mot_lower in CORRECTIONS:
            mots_corriges.append(CORRECTIONS[mot_lower])
        else:
            # Tentative d'ajout d'accent sur les premiers caractères
            mot_corrige = mot_lower
            if mot_corrige.startswith(('pre', 'prem', 'premi')):
                mot_corrige = 'pré' + mot_corrige[3:]
            elif mot_corrige.startswith(('re', 'rem', 'rema')):
                mot_corrige = 'ré' + mot_corrige[2:]
            elif mot_corrige.startswith(('de', 'dem', 'dema')):
                mot_corrige = 'dé' + mot_corrige[2:]
            elif mot_corrige.startswith(('ce', 'cer', 'cert')):
                mot_corrige = 'cé' + mot_corrige[2:]
            # Suppression des lettres triplées
            mot_corrige = re.sub(r'([a-z])\1{2,}', r'\1\1', mot_corrige)
            mots_corriges.append(mot_corrige)
    result = ' '.join(mots_corriges)
    result = re.sub(r'\s+', ' ', result)
    return result.strip()

def main():
    master_path = Path("data/master_db.csv")
    if master_path.exists():
        df = pd.read_csv(master_path)
        original_count = len(df)
        print("Correction des questions en cours...")
        df['texte_question'] = df['texte_question'].apply(corriger_texte)
        df.to_csv(master_path, index=False, encoding='utf-8')
        print(f"✅ master_db.csv corrigé et enrichi ({original_count} questions traitées)")
    else:
        print("❌ master_db.csv introuvable")

    models_dir = Path("models")
    if models_dir.exists():
        shutil.rmtree(models_dir)
        print("🗑️ Ancien modèle supprimé. Relancez : python -m src.model.train")

if __name__ == "__main__":
    main()