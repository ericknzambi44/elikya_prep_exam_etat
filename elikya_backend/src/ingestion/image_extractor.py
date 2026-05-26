import csv
import re
from pathlib import Path
from typing import Optional, List, Tuple
from PIL import Image
import pytesseract

def ocr_from_image(chemin_image: str, lang: str = 'fra') -> str:
    img = Image.open(chemin_image)
    texte = pytesseract.image_to_string(img, lang=lang)
    return texte

def decouper_questions(texte: str) -> List[Tuple[str, str]]:
    pattern = r'(?:^|\n)(\d+)[.)]\s*(.*?)(?=(?:\n\d+[.)])|$)'
    matches = re.findall(pattern, texte, re.DOTALL)
    if matches:
        return matches
    pattern2 = r'question\s+(\d+)\s*:?\s*(.*?)(?=(?:question\s+\d+|$))'
    matches2 = re.findall(pattern2, texte, re.DOTALL)
    return matches2 if matches2 else []

def deviner_matiere(texte: str) -> str:
    m = {
        'mathématiques': ['math', 'algèbre', 'géométrie', 'équation', 'fonction', 'dérivée'],
        'français': ['français', 'littérature', 'grammaire', 'conjugaison'],
        'biologie': ['biologie', 'cellule', 'génétique', 'écosystème'],
        'physique-chimie': ['physique', 'chimie', 'atome', 'réaction'],
        'histoire-géo': ['histoire', 'géographie', 'congo', 'afrique']
    }
    texte_lower = texte.lower()
    for mat, mots in m.items():
        if any(mot in texte_lower for mot in mots):
            return mat
    return "autre"

def deviner_annee(texte: str) -> str:
    match = re.search(r'20\d{2}', texte)
    return match.group(0) if match else "inconnue"

def sauvegarder_csv(questions, matiere, annee, nom_base, dossier_sortie):
    chemin_csv = dossier_sortie / f"{nom_base}_{annee}_{matiere}.csv"
    chemin_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(chemin_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['matiere', 'annee', 'num_question', 'texte_question'])
        for num, txt in questions:
            writer.writerow([matiere, annee, num, txt.strip()])
    print(f"✅ CSV créé depuis image : {chemin_csv}")
    return chemin_csv

def image_to_csv(chemin_image: str, dossier_sortie: str = "data/processed") -> Optional[Path]:
    try:
        texte_brut = ocr_from_image(chemin_image)
        if not texte_brut.strip():
            return None
        questions = decouper_questions(texte_brut)
        if not questions:
            return None
        matiere = deviner_matiere(texte_brut)
        annee = deviner_annee(texte_brut)
        nom_base = Path(chemin_image).stem
        dossier_sortie_path = Path(dossier_sortie)
        csv_path = sauvegarder_csv(questions, matiere, annee, nom_base, dossier_sortie_path)
        # Fusionner après chaque ajout
        from .merge_db import merge_all_csv
        merge_all_csv(processed_dir=dossier_sortie, master_path="data/master_db.csv")
        return csv_path
    except Exception as e:
        print(f"❌ Erreur OCR : {e}")
        return None