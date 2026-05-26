import re
from unidecode import unidecode
from nltk.corpus import stopwords
import nltk
from .verb_expansion import VERB_EXPANSION

try:
    stopwords.words('french')
except LookupError:
    nltk.download('stopwords')

STOP_WORDS = set(stopwords.words('french'))
EXTRA_STOP_WORDS = {
    'citer', 'donnez', 'expliquez', 'quelle', 'quelles', 'quel', 'quels',
    'pourquoi', 'comment', 'combien', 'deux', 'trois', 'quatre', 'cinq',
    'premier', 'deuxieme', 'troisieme', 'dernier', 'exemple', 'phrase',
    'schema', 'illustrer', 'definir', 'calculer', 'determiner', 'resoudre',
    'simplifier', 'comparer', 'proposer', 'completer', 'avantage', 'ligne',
    'resume', 'suivant', 'notion', 'pratique', 'theorique', 'application',
    'faire', 'etre', 'avoir', 'aller', 'dire', 'voir', 'savoir', 'pouvoir',
    'falloir', 'devoir', 'vouloir', 'prendre', 'mettre', 'donner', 'arriver',
    'passer', 'comprendre', 'rester', 'tenir', 'porter', 'chercher', 'trouver'
}
STOP_WORDS.update(EXTRA_STOP_WORDS)

# Correction orthographique étendue (mots clés)
SPELLING_CORRECTIONS = {
    'math': 'mathematiques',
    'maths': 'mathematiques',
    'mathematique': 'mathematiques',
    'mathe': 'mathematiques',
    'algebre': 'algebre',
    'geometrie': 'geometrie',
    'equation': 'equation',
    'equa': 'equation',
    'biolog': 'biologie',
    'bio': 'biologie',
    'physique': 'physique',
    'phys': 'physique',
    'chimie': 'chimie',
    'chim': 'chimie',
    'francais': 'francais',
    'franc': 'francais',
    'histoir': 'histoire',
    'geo': 'geographie',
    'geograph': 'geographie',
    'def': 'definir',
    'expl': 'expliquer',
    'expliq': 'expliquer',
    'calc': 'calculer',
    'res': 'resoudre',
    'determ': 'determiner',
}

def correct_spelling(word: str) -> str:
    return SPELLING_CORRECTIONS.get(word, word)

def expand_abbreviations(text: str) -> str:
    words = text.split()
    expanded = [VERB_EXPANSION.get(w, w) for w in words]
    return ' '.join(expanded)

def preprocess_for_display(text: str) -> str:
    if not isinstance(text, str):
        text = str(text)
    text = text.lower()
    text = unidecode(text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = expand_abbreviations(text)
    words = text.split()
    words = [correct_spelling(w) for w in words]
    words = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return ' '.join(words)

preprocess_for_similarity = preprocess_for_display