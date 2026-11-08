const fs = require('fs');
const path = require('path');

let studioDir = process.cwd();
if (!fs.existsSync(path.join(studioDir, 'data', 'studio.db')) && fs.existsSync(path.join(studioDir, '..', 'data', 'studio.db'))) {
    studioDir = path.join(studioDir, '..');
}

const dbPath = path.join(studioDir, 'data', 'studio.db');
const assetsDir = path.join(studioDir, 'data', 'assets');
const bundlePath = path.join(__dirname, 'canvas_khoi_dau_moi.json');
const packAssetsDir = path.join(__dirname, 'assets');

console.log('====================================================================');
console.log('   NHẬP CANVAS "KHỞI ĐẦU MỚI" VÀO SEECUT STUDIO');
console.log('====================================================================');

if (!fs.existsSync(dbPath)) {
    console.error('LỖI: Không tìm thấy data/studio.db tại ' + studioDir);
    process.exit(1);
}

// 1. Copy assets
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDir(srcPath, destPath);
        else fs.copyFileSync(srcPath, destPath);
    }
}
if (fs.existsSync(packAssetsDir)) {
    copyDir(packAssetsDir, assetsDir);
    console.log('[1/3] Đã copy toàn bộ hình ảnh, âm thanh, video vào data/assets!');
}

// 2. Import into SQLite
let Database;
try {
    Database = require('better-sqlite3');
} catch (e) {
    try {
        Database = require(path.join(studioDir, 'node_modules', 'better-sqlite3'));
    } catch (e2) {
        Database = null;
    }
}

if (Database) {
    const db = new Database(dbPath);
    const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));

    // Project
    const p = bundle.project;
    if (p && p.id) {
        db.prepare('INSERT OR REPLACE INTO projects (id, name, thumbnail, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
          .run(p.id, p.name, p.thumbnail || null, p.created_at, p.updated_at);
        console.log(`[2/3] Đã nạp Project: "${p.name}" (ID: ${p.id})`);
    }

    // Graph
    const g = bundle.graph;
    if (g && g.project_id) {
        db.prepare('INSERT OR REPLACE INTO graphs (project_id, data, updated_at) VALUES (?, ?, ?)')
          .run(g.project_id, g.data, g.updated_at);
        const graphObj = JSON.parse(g.data);
        console.log(`      Đã nạp Graph: ${graphObj.nodes?.length || 0} nodes, ${graphObj.edges?.length || 0} liên kết`);
    }

    // Assets
    if (Array.isArray(bundle.assets)) {
        const insertAsset = db.prepare('INSERT OR REPLACE INTO assets (id, project_id, name, kind, mime, url, meta, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const insertMany = db.transaction((items) => {
            for (const item of items) {
                insertAsset.run(item.id, item.project_id, item.name, item.kind, item.mime, item.url, item.meta || null, item.created_at);
            }
        });
        insertMany(bundle.assets);
        console.log(`      Đã nạp ${bundle.assets.length} bản ghi asset vào database`);
    }

    // Settings
    if (bundle.settings) {
        const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
        for (const [k, v] of Object.entries(bundle.settings)) {
            insertSetting.run(k, v);
        }
    }
    db.close();
    console.log('[3/3] HOÀN TẤT NHẬP CANVAS THÀNH CÔNG!');
} else {
    console.log('Chuyển sang chạy python import...');
    require('child_process').execSync(`python "${path.join(__dirname, 'import_canvas.py')}"`, { stdio: 'inherit' });
}
