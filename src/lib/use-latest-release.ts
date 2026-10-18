import {useEffect, useState} from 'react';
import {LATEST_RELEASE_API, normalizeRelease, pickNewer, type ReleaseInfo} from './latest-release';

const CACHE_KEY = 'cyrene-latest-release';
const CACHE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 5000;

/**
 * 先用构建时写入的版本渲染（无需等网络，也是失败时的兜底），挂载后再向 GitHub 查一次。
 * 未登录的 GitHub API 每个 IP 每小时只有 60 次额度，结果在会话内缓存 10 分钟。
 */
export function useLatestRelease(initial: ReleaseInfo): ReleaseInfo {
  const [release, setRelease] = useState(initial);

  useEffect(() => {
    const cached = readCache();
    if (cached !== undefined) {
      if (cached) setRelease((current) => pickNewer(current, cached));
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    fetch(LATEST_RELEASE_API, {signal: controller.signal, headers: {Accept: 'application/vnd.github+json'}})
      .then((response) => (response.ok ? response.json() : null))
      .then((json: unknown) => {
        const latest = json ? normalizeRelease(json) : null;
        writeCache(latest);
        if (latest) setRelease((current) => pickNewer(current, latest));
      })
      // 网络失败、超时或额度用完时保留构建时的版本，页面不报错
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return release;
}

/** 返回 undefined 表示没有可用缓存；null 表示近期查过但没有拿到有效版本。 */
function readCache(): ReleaseInfo | null | undefined {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as {at?: number; release?: ReleaseInfo | null};
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > CACHE_TTL_MS) return undefined;
    return parsed.release ?? null;
  } catch {
    return undefined;
  }
}

function writeCache(release: ReleaseInfo | null): void {
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({at: Date.now(), release}));
  } catch {
    // 隐私模式等场景下存储不可用，只是少一层缓存
  }
}
