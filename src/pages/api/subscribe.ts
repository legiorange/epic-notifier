import type { APIRoute } from 'astro';

// 定义 Cloudflare Pages Functions 的环境类型
type Env = {
    DB: D1Database; // 必须匹配 Pages 控制台中的绑定名称
};

// 处理 POST 请求 (订阅/退订逻辑)
export const POST: APIRoute = async ({ request, locals }) => {
    // 强制类型转换以访问 Pages Functions 的运行时环境
    const env = (locals.runtime as any).env as Env; 
    
    // 跨域设置，允许您的 Pages 页面调用此 API
    const headers = { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json' 
    };

    try {
        const { email, action } = await request.json();

        if (!email || !action) {
            return new Response(JSON.stringify({ error: "邮箱或操作参数缺失。" }), { status: 400, headers });
        }

        if (action === 'subscribe') {
            // 插入新邮箱或将已存在的邮箱状态更新为 'active'
            await env.DB.prepare(
                `INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO UPDATE SET status = 'active'`
            ).bind(email).run();
            return new Response(JSON.stringify({ message: "订阅成功！您将收到免费游戏通知。" }), { status: 200, headers });

        } else if (action === 'unsubscribe') {
            // 将邮箱状态更新为 'inactive'
            await env.DB.prepare(
                `UPDATE subscribers SET status = 'inactive' WHERE email = ?`
            ).bind(email).run();
            return new Response(JSON.stringify({ message: "退订成功。" }), { status: 200, headers });

        } else {
            return new Response(JSON.stringify({ error: "无效的操作类型。" }), { status: 400, headers });
        }
        
    } catch (e) {
        console.error("API 错误:", e);
        return new Response(JSON.stringify({ error: "服务器内部错误，请稍后再试。" }), { status: 500, headers });
    }
};

// 处理 OPTIONS 请求 (CORS 预检)
export const OPTIONS: APIRoute = () => {
    const headers = { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    return new Response(null, { headers, status: 204 });
};