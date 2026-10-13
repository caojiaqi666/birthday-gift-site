// 运行时内容:所有文字、图片、主题色、各页开关与顺序都在这里定义;后台(/admin/)改的就是这份 JSON。
// 读取顺序:./api/content(服务端,后台保存后立即生效)→ ./content.json(随构建打包的兜底)→ DEFAULT_CONTENT。
// 文字里可写 **加粗**、{收件人}、{寄件人}、换行。
import { createContext, useContext, Fragment } from 'react';
import type { ReactNode } from 'react';

export type StageKey = 'sevenDays' | 'welcome' | 'counter' | 'balloons' | 'memories' | 'photoReel' | 'letter' | 'cake' | 'giftbox' | 'starry' | 'rose';
export const ALL_STAGES: StageKey[] = ['sevenDays', 'welcome', 'counter', 'balloons', 'memories', 'photoReel', 'letter', 'cake', 'giftbox', 'starry', 'rose'];

// 默认内容在 default-content.json(后台也读这份当字段默认值)
import DEFAULTS from './default-content.json';
export const DEFAULT_CONTENT = DEFAULTS as Omit<typeof DEFAULTS, 'order' | 'counter' | 'theme'> & { order: StageKey[]; counter: Omit<typeof DEFAULTS.counter, 'untilMode'> & { untilMode: 'date' | 'now' }; theme: Omit<typeof DEFAULTS.theme, 'balloon'> & { balloon: 'gold' | 'red' | 'pink' | 'silver' } };
export type Content = typeof DEFAULT_CONTENT;

// 深合并:服务器内容缺的字段用默认值补齐(后台新增字段后,旧 JSON 也能用)
export function merge<T>(base: T, over: any): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (base && typeof base === 'object') { const out: any = { ...base }; if (over && typeof over === 'object') for (const k of Object.keys(over)) out[k] = k in (base as any) ? merge((base as any)[k], over[k]) : over[k]; return out; }
  return (over === undefined || over === null ? base : over) as T;
}
export async function loadContent(): Promise<Content> {
  // 后台「预览」:?draft=1 时读后台写进本机的草稿(不用先保存)
  if (/[?&]draft=1/.test(location.search)) { try { const d = localStorage.getItem('gift-draft'); if (d) return merge(DEFAULT_CONTENT, JSON.parse(d)); } catch { /* 忽略 */ } }
  for (const url of ['./api/content', './content.json']) {
    try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return merge(DEFAULT_CONTENT, await r.json()); } catch { /* 下一个 */ }
  }
  return DEFAULT_CONTENT;
}

export const ContentCtx = createContext<Content>(DEFAULT_CONTENT);
export const useContent = () => useContext(ContentCtx);

// 「我们认识的天数」:counter.start → until(或今天)
export function daysTogether(c: Content, now = new Date()) {
  const s = new Date(c.counter.start); const e = c.counter.untilMode === 'now' ? now : new Date(c.counter.until);
  return Math.max(0, Math.floor((e.getTime() - s.getTime()) / 86400000));
}
// 占位符替换
export function fill(c: Content, s: string, extra: Record<string, string | number> = {}) {
  const v: Record<string, string | number> = { 收件人: c.names.recipient, 昵称: c.names.nickname || c.names.recipient, 寄件人: c.names.sender, 出发城市: c.welcome.cityFrom, 到达城市: c.welcome.cityTo, 天数: daysTogether(c), ...extra };
  return String(s ?? '').replace(/\{([^}]+)\}/g, (m, k) => (k in v ? String(v[k]) : m));
}
// 富文本:**加粗** + 换行
export function Rich({ text, extra }: { text: string; extra?: Record<string, string | number> }) {
  const c = useContent(); const s = fill(c, text, extra);
  const lines = s.split('\n'); const out: ReactNode[] = [];
  lines.forEach((ln, li) => { ln.split(/(\*\*[^*]+\*\*)/).forEach((p, i) => out.push(p.startsWith('**') && p.endsWith('**') ? <strong key={`${li}-${i}`}>{p.slice(2, -2)}</strong> : <Fragment key={`${li}-${i}`}>{p}</Fragment>)); if (li < lines.length - 1) out.push(<br key={`br-${li}`} />); });
  return <>{out}</>;
}
// 主题:整体色相旋转到主题色(默认玫瑰红 #e6396e,色相 341°);照片/金色气球反向旋转保持原色
export function hueOf(hex: string) { const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) return 341; const n = parseInt(m[1], 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return 341; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; return h < 0 ? h + 360 : h; }
export function themeVars(c: Content) { const shift = Math.round(hueOf(c.theme.color) - 341); const sat = Math.max(.2, Math.min(2, Number(c.theme.saturation) || 1)); return { '--hue-shift': `${shift}deg`, '--sat': String(sat), '--sat-inv': String(1 / sat) } as Record<string, string>; }
