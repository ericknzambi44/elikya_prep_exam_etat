"""
common.py
Fonctions partagées entre les extracteurs PDF et image.
"""

import csv 
import re
from pathlib import Path
from typing import List, Tuple
from unidecode import unidecode
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def normaliser_texte(texte: str) -> str:
    """Normalise le texte : minuscules, sans accents, nettoyage retours ligne."""
    texte = texte.lower()
    texte = unidecode(texte)
    texte = re.sub(r'\n+', '\n', texte)
    texte = texte.replace('-\n', '')
    texte = re.sub(r'([a-z])-\n([a-z])', r'\1\2', texte)
    return texte

def decouper_questions(texte: str) -> List[Tuple[str, str]]:
    """Détecte les questions numérotées."""
    pattern = r'(?:^|\n)(\d+)[.)]\s*(.*?)(?=(?:\n\d+[.)])|$)'
    matches = re.findall(pattern, texte, re.DOTALL)
    if matches:
        return matches
    pattern2 = r'question\s+(\d+)\s*:?\s*(.*?)(?=(?:question\s+\d+|$))'
    matches2 = re.findall(pattern2, texte, re.DOTALL)
    return matches2 if matches2 else []

def deviner_matiere(texte: str) -> str:
    """Heuristique basée sur mots-clés."""
    m = {
        'mathématiques': ['math', 'algèbre', 'géométrie', 'équation', 'fonction', 'dérivée'],
        'français': ['français', 'littérature', 'grammaire', 'conjugaison', 'orthographe', 'rédaction'],
        'biologie': ['biologie', 'cellule', 'génétique', 'écosystème', 'reproduction'],
        'physique-chimie': ['physique', 'chimie', 'atome', 'réaction', 'molécule', 'ohm'],
        'histoire-géo': ['histoire', 'géographie', 'congo', 'afrique', 'colonie', 'carte']
    }
    texte_lower = texte.lower()
    for mat, mots in m.items():
        if any(mot in texte_lower for mot in mots):
            return mat
    return "autre"

def deviner_annee(texte: str) -> str:
    """Recherche une année 20xx."""
    match = re.search(r'20\d{2}', texte)
    return match.group(0) if match else "inconnue"

def sauvegarder_csv(questions: List[Tuple[str, str]], matiere: str, annee: str,
                    nom_base: str, dossier_sortie: Path) -> Path:
    """Sauvegarde les questions dans un CSV."""
    chemin_csv = dossier_sortie / f"{nom_base}_{annee}_{matiere}.csv"
    chemin_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(chemin_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['matiere', 'annee', 'num_question', 'texte_question'])
        for num, txt in questions:
            writer.writerow([matiere, annee, num, txt.strip()])
    logger.info(f"CSV créé : {chemin_csv}")
    return chemin_csv