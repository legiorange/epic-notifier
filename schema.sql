-- schema.sql

-- 订阅用户表：存储用户邮箱和订阅状态
CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' 或 'inactive'
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 已推送游戏记录表：防止重复发送通知
CREATE TABLE IF NOT EXISTS pushed_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    epic_id TEXT NOT NULL UNIQUE, 
    title TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    push_date DATETIME DEFAULT CURRENT_TIMESTAMP
);