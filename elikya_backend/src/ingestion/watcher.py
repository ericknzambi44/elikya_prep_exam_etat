"""
watcher.py
Surveille le dossier data/raw et transforme automatiquement tout nouveau fichier
(PDF, PNG, JPG) en CSV dans data/processed.
"""

import time
import os
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from .pdf_extractor import pdf_to_csv
from .image_extractor import image_to_csv

class ExamenHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        chemin = event.src_path
        ext = Path(chemin).suffix.lower()
        if ext == '.pdf':
            print(f"📄 Nouveau PDF détecté : {chemin}")
            pdf_to_csv(chemin)
        elif ext in ('.png', '.jpg', '.jpeg', '.bmp', '.tiff'):
            print(f"🖼️ Nouvelle image détectée : {chemin}")
            image_to_csv(chemin)
        else:
            print(f"⚠️ Format ignoré : {ext}")

def start_watcher(dossier_a_surveiller="data/raw"):
    """Lance la surveillance en arrière-plan."""
    path = Path(dossier_a_surveiller)
    path.mkdir(parents=True, exist_ok=True)
    event_handler = ExamenHandler()
    observer = Observer()
    observer.schedule(event_handler, str(path), recursive=False)
    observer.start()
    print(f"👁️ Surveillance démarrée sur {path.absolute()}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_watcher()