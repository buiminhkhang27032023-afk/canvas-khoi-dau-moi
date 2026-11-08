import sqlite3, json, os, shutil
from pathlib import Path

cur_dir = Path(__file__).parent.resolve()
studio_dir = Path.cwd()
if not (studio_dir / "data" / "studio.db").exists() and (studio_dir.parent / "data" / "studio.db").exists():
    studio_dir = studio_dir.parent

db_path = studio_dir / "data" / "studio.db"
assets_dir = studio_dir / "data" / "assets"
bundle_path = cur_dir / "canvas_khoi_dau_moi.json"
pack_assets = cur_dir / "assets"

if pack_assets.exists():
    for f in pack_assets.glob("**/*"):
        if f.is_file():
            rel = f.relative_to(pack_assets)
            dest = assets_dir / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, dest)

with open(bundle_path, "r", encoding="utf-8") as f:
    bundle = json.load(f)

conn = sqlite3.connect(db_path)
c = conn.cursor()
p = bundle.get("project", {})
if p:
    c.execute('INSERT OR REPLACE INTO projects (id, name, thumbnail, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
              (p["id"], p["name"], p.get("thumbnail"), p["created_at"], p["updated_at"]))

g = bundle.get("graph", {})
if g:
    c.execute('INSERT OR REPLACE INTO graphs (project_id, data, updated_at) VALUES (?, ?, ?)',
              (g["project_id"], g["data"], g["updated_at"]))

for a in bundle.get("assets", []):
    c.execute('INSERT OR REPLACE INTO assets (id, project_id, name, kind, mime, url, meta, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              (a["id"], a["project_id"], a["name"], a["kind"], a["mime"], a["url"], a.get("meta"), a["created_at"]))

for k, v in bundle.get("settings", {}).items():
    c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', (k, v))

conn.commit()
conn.close()
print("Đã nạp thành công vào studio.db bằng Python!")
