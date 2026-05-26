import pandas as pd
import joblib
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from .utils import preprocess_for_similarity, preprocess_for_display

def load_master_db(csv_path="data/master_db.csv"):
    if not Path(csv_path).exists():
        print("❌ master_db.csv introuvable.")
        return None
    df = pd.read_csv(csv_path)
    df['texte_sim'] = df['texte_question'].apply(preprocess_for_similarity)
    df['texte_display'] = df['texte_question'].apply(preprocess_for_display)
    return df

def train_model(df):
    vectorizer = TfidfVectorizer(max_features=2000, ngram_range=(1,2))
    X = vectorizer.fit_transform(df['texte_sim'])
    Path("models").mkdir(exist_ok=True)
    joblib.dump(vectorizer, "models/tfidf_vectorizer.joblib")
    joblib.dump(X, "models/tfidf_matrix.joblib")
    # Stocke toutes les informations utiles
    questions_data = df[['matiere', 'annee', 'texte_question', 'texte_display']].to_dict('records')
    joblib.dump(questions_data, "models/questions_data.joblib")
    print(f"✅ Modèle entraîné sur {len(df)} questions. Dimensions: {X.shape}")

if __name__ == "__main__":
    df = load_master_db()
    if df is not None:
        train_model(df)