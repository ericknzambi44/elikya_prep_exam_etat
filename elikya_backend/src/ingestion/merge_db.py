import pandas as pd
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def merge_all_csv(processed_dir: str = "data/processed", master_path: str = "data/master_db.csv"):
    processed = Path(processed_dir)
    if not processed.exists():
        logger.warning(f"Le dossier {processed_dir} n'existe pas, fusion ignorée.")
        return

    csv_files = list(processed.glob("*.csv"))
    if not csv_files:
        logger.info("Aucun CSV à fusionner.")
        return

    dfs = []
    for f in csv_files:
        try:
            df = pd.read_csv(f)
            dfs.append(df)
            logger.info(f"Lu {f.name} : {len(df)} lignes")
        except Exception as e:
            logger.error(f"Erreur lecture {f.name} : {e}")

    if dfs:
        master = pd.concat(dfs, ignore_index=True)
        master = master.drop_duplicates()
        master_path = Path(master_path)
        master_path.parent.mkdir(parents=True, exist_ok=True)
        master.to_csv(master_path, index=False)
        logger.info(f"master_db.csv mis à jour avec {len(master)} questions uniques (source: {len(csv_files)} fichiers).")
    else:
        logger.warning("Aucune donnée valide trouvée pour la fusion.")