#!/usr/bin/env python
import argparse
import threading
import time
import uvicorn
from src.ingestion.watcher import start_watcher

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--watcher", action="store_true", help="Lancer la surveillance de data/raw")
    args = parser.parse_args()
    
    if args.watcher:
        watcher_thread = threading.Thread(target=start_watcher, daemon=True)
        watcher_thread.start()
        print("👁️ Watcher actif en arrière-plan.")
    
    print("🚀 Démarrage de l'API FastAPI sur http://localhost:8000")
    uvicorn.run("src.api.app:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()