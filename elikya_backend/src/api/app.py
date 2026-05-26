from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pathlib import Path
from src.model.predict import recommend_questions, process_pdf_text
from src.ingestion.pdf_extractor import extraire_texte_pdf
import pandas as pd

app = FastAPI(title="Elikya API", description="Aide à la préparation de l'Examen d'État")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("data/raw")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in ['.pdf', '.png', '.jpg', '.jpeg', '.bmp']:
        raise HTTPException(400, "Format non supporté. Utilisez PDF ou image.")
    dest = UPLOAD_DIR / file.filename
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": f"Fichier {file.filename} reçu, en cours de traitement automatique."}

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...), matiere: str = Form(None)):
    ext = Path(file.filename).suffix.lower()
    if ext != '.pdf':
        raise HTTPException(400, "Format non supporté. Seuls les PDF sont acceptés.")
    temp_path = UPLOAD_DIR / f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        texte_brut = extraire_texte_pdf(str(temp_path))
        if not texte_brut.strip():
            raise HTTPException(400, "Impossible d'extraire le texte du PDF.")
        questions = process_pdf_text(texte_brut, matiere, top_k=5)
        return {"questions_similaires": questions}
    except Exception as e:
        raise HTTPException(500, f"Erreur lors du traitement : {str(e)}")
    finally:
        if temp_path.exists():
            temp_path.unlink()

@app.post("/recommend")
async def recommend(texte: str = Form(""), matiere: str = Form(None)):
    if not texte.strip() and not matiere:
        raise HTTPException(400, "Veuillez saisir un texte ou sélectionner une matière.")
    questions = recommend_questions(texte, matiere)
    return {"themes_recommandes": questions}

@app.get("/stats")
async def stats():
    master_path = Path("data/master_db.csv")
    if not master_path.exists():
        return {"error": "Aucune donnée disponible, commencez par uploader des sujets."}
    df = pd.read_csv(master_path)
    return {
        "total_questions": len(df),
        "matieres": df['matiere'].value_counts().to_dict(),
        "annees_disponibles": sorted(df['annee'].unique().tolist())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)