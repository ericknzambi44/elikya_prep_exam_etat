import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
from difflib import get_close_matches
from .utils import preprocess_for_similarity

def load_model():
    vectorizer = joblib.load("models/tfidf_vectorizer.joblib")
    X = joblib.load("models/tfidf_matrix.joblib")
    questions = joblib.load("models/questions_data.joblib")
    return vectorizer, X, questions

def get_question_frequency(questions):
    freq = {}
    for q in questions:
        text = q['texte_question']
        annee = q['annee']
        if text not in freq:
            freq[text] = set()
        freq[text].add(annee)
    return freq

def detect_matiere(texte_eleve, questions):
    mots = preprocess_for_similarity(texte_eleve).split()
    if not mots:
        return None
    matiere_proba = {}
    for q in questions:
        texte_q = q.get('texte_display', '')
        for mot in mots:
            if mot in texte_q:
                matiere_proba[q['matiere']] = matiere_proba.get(q['matiere'], 0) + 1
    if matiere_proba:
        return max(matiere_proba, key=matiere_proba.get)
    return None

def keyword_search(texte_eleve, questions, matiere=None, top_k=5):
    mots_requete = preprocess_for_similarity(texte_eleve).split()
    if not mots_requete:
        return []
    scores = []
    for q in questions:
        if matiere and q['matiere'] != matiere:
            continue
        texte_q = q.get('texte_display', '')
        score = 0
        for mot in mots_requete:
            if mot in texte_q:
                score += 1
            elif len(mot) > 3:
                matches = get_close_matches(mot, texte_q.split(), n=1, cutoff=0.7)
                if matches:
                    score += 0.5
        if score > 0:
            scores.append((score, q))
    scores.sort(key=lambda x: -x[0])
    return [q for _, q in scores[:top_k]]

def recommend_questions(texte_eleve, matiere=None, top_k=5, seuil_similarite=0.1):
    vect, X, questions = load_model()
    
    if not texte_eleve.strip():
        if matiere:
            indices = [i for i, q in enumerate(questions) if q['matiere'] == matiere]
            if not indices:
                return []
            freq_map = get_question_frequency([questions[i] for i in indices])
            sorted_q = sorted([questions[i] for i in indices],
                              key=lambda q: len(freq_map.get(q['texte_question'], set())), reverse=True)
            results = []
            for q in sorted_q[:top_k]:
                results.append({
                    "question": q['texte_question'],
                    "matiere": q['matiere'],
                    "annee": q['annee'],
                    "similarite": 0,
                    "annees": sorted(list(freq_map.get(q['texte_question'], [q['annee']])))
                })
            return results
        return []
    
    if not matiere:
        matiere = detect_matiere(texte_eleve, questions)
    
    if matiere:
        indices = [i for i, q in enumerate(questions) if q['matiere'] == matiere]
        if indices:
            X = X[indices]
            questions = [questions[i] for i in indices]
    
    req_clean = preprocess_for_similarity(texte_eleve)
    if not req_clean.strip():
        return []
    
    req_vec = vect.transform([req_clean])
    sims = cosine_similarity(req_vec, X).flatten()
    top_indices = np.argsort(sims)[::-1][:top_k]
    
    if len(top_indices) == 0 or sims[top_indices[0]] < seuil_similarite:
        keyword_results = keyword_search(texte_eleve, questions, matiere, top_k)
        if keyword_results:
            freq_map = get_question_frequency(questions)
            results = []
            for q in keyword_results:
                results.append({
                    "question": q['texte_question'],
                    "matiere": q['matiere'],
                    "annee": q['annee'],
                    "similarite": 0,
                    "annees": sorted(list(freq_map.get(q['texte_question'], [q['annee']])))
                })
            return results
    
    freq_map = get_question_frequency(questions)
    results = []
    for idx in top_indices:
        q = questions[idx]
        results.append({
            "question": q['texte_question'],
            "matiere": q['matiere'],
            "annee": q['annee'],
            "similarite": float(sims[idx]),
            "annees": sorted(list(freq_map.get(q['texte_question'], [q['annee']])))
        })
    
    unique = {}
    for r in results:
        if r['question'] not in unique or r['similarite'] > unique[r['question']]['similarite']:
            unique[r['question']] = r
    final = list(unique.values())
    final.sort(key=lambda x: -x['similarite'])
    return final[:top_k]

def process_pdf_text(pdf_text, matiere=None, top_k=5):
    return recommend_questions(pdf_text, matiere, top_k)

recommend_themes = recommend_questions