// 下载页的最新版本信息：构建时由插件写入页面，浏览器端再尝试刷新一次。
// 构建端（docusaurus.config.ts 插件）与浏览器端（useLatestRelease）共用这里的解析规则，
// 保证两边对「哪个文件是安装包」「哪个版本更新」的判断一致。

export const RELEASE_REPO = 'Playa-Cyrene/Cyrene-Agent';
export const LATEST_RELEASE_API = `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`;
export const RELEASES_PAGE = `https://github.com/${RELEASE_REPO}/releases`;

/** 标准安装包：Cyrene-Setup-x.y.z.exe。-Custom 等变体与 .blockmap 不作为主下载。 */
const INSTALLER_NAME = /^Cyrene-Setup-\d+\.\d+\.\d+\.exe$/;

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface ReleaseInfo {
  version: string;
  tag: string;
  publishedAt: string;
  htmlUrl: string;
  installer: ReleaseAsset | null;
}

/** 把 GitHub releases/latest 的响应整理成页面需要的字段；不是有效正式版时返回 null。 */
export function normalizeRelease(raw: unknown): ReleaseInfo | null {
  if (!raw || typeof raw !== 'object') return null;
  const release = raw as Record<string, unknown>;
  if (release.draft === true || release.prerelease === true) return null;
  const tag = typeof release.tag_name === 'string' ? release.tag_name.trim() : '';
  const version = tag.replace(/^v/i, '');
  if (!/^\d+\.\d+\.\d+$/.test(version)) return null;
  const htmlUrl = typeof release.html_url === 'string' && release.html_url.startsWith('https://github.com/')
    ? release.html_url
    : `${RELEASES_PAGE}/tag/${tag}`;
  const publishedAt = typeof release.published_at === 'string' ? release.published_at : '';
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const installer = assets
    .map(readAsset)
    .find((asset): asset is ReleaseAsset => asset !== null && INSTALLER_NAME.test(asset.name)) ?? null;
  return {version, tag, publishedAt, htmlUrl, installer};
}

function readAsset(raw: unknown): ReleaseAsset | null {
  if (!raw || typeof raw !== 'object') return null;
  const asset = raw as Record<string, unknown>;
  const name = typeof asset.name === 'string' ? asset.name : '';
  const url = typeof asset.browser_download_url === 'string' ? asset.browser_download_url : '';
  const size = typeof asset.size === 'number' && Number.isFinite(asset.size) ? asset.size : 0;
  // 只接受 GitHub 发布文件地址，避免把异常响应里的任意链接放到下载按钮上
  if (!name || !url.startsWith(`https://github.com/${RELEASE_REPO}/releases/download/`)) return null;
  return {name, url, size};
}

/** 比较 x.y.z 版本号：a 更新返回正数，相同返回 0。 */
export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let index = 0; index < 3; index++) {
    const diff = (left[index] ?? 0) - (right[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** 浏览器端拿到的版本只有比构建时更新才替换，避免缓存或异常响应把页面退回旧版本。 */
export function pickNewer(current: ReleaseInfo, candidate: ReleaseInfo | null): ReleaseInfo {
  return candidate && compareVersions(candidate.version, current.version) > 0 ? candidate : current;
}

/** 安装包大小，按 MB（1024²）取整显示。 */
export function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

/** 发布日期显示为 YYYY-MM-DD（UTC），构建端与浏览器端结果一致，避免水合时文本不一致。 */
export function formatDate(iso: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T/.exec(iso);
  return match ? match[1] : '';
}
