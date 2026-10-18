// 运行：npm test（Node 内置测试运行器，Node 22.18+ 可直接导入 .ts）
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {compareVersions, formatDate, formatSize, normalizeRelease, pickNewer} from './latest-release.ts';

const download = (name) => `https://github.com/Playa-Cyrene/Cyrene-Agent/releases/download/v1.3.4/${name}`;
const rawRelease = (overrides = {}) => ({
  tag_name: 'v1.3.4',
  html_url: 'https://github.com/Playa-Cyrene/Cyrene-Agent/releases/tag/v1.3.4',
  published_at: '2026-10-18T12:20:09Z',
  draft: false,
  prerelease: false,
  assets: [
    {name: 'Cyrene-Setup-1.3.4-Custom.exe', browser_download_url: download('Cyrene-Setup-1.3.4-Custom.exe'), size: 616507833},
    {name: 'Cyrene-Setup-1.3.4.exe', browser_download_url: download('Cyrene-Setup-1.3.4.exe'), size: 525549350},
    {name: 'Cyrene-Setup-1.3.4.exe.blockmap', browser_download_url: download('Cyrene-Setup-1.3.4.exe.blockmap'), size: 541017},
    {name: 'latest.yml', browser_download_url: download('latest.yml'), size: 341},
  ],
  ...overrides,
});

test('选出标准安装包，跳过 -Custom、.blockmap 与 latest.yml', () => {
  const release = normalizeRelease(rawRelease());
  assert.equal(release.version, '1.3.4');
  assert.equal(release.tag, 'v1.3.4');
  assert.deepEqual(release.installer, {name: 'Cyrene-Setup-1.3.4.exe', url: download('Cyrene-Setup-1.3.4.exe'), size: 525549350});
});

test('没有标准安装包时 installer 为 null，页面退回发布页链接', () => {
  const release = normalizeRelease(rawRelease({assets: [{name: 'latest.yml', browser_download_url: download('latest.yml'), size: 1}]}));
  assert.equal(release.installer, null);
  assert.equal(release.htmlUrl, 'https://github.com/Playa-Cyrene/Cyrene-Agent/releases/tag/v1.3.4');
});

test('不接受非本仓库发布地址的下载链接', () => {
  const release = normalizeRelease(rawRelease({
    assets: [{name: 'Cyrene-Setup-1.3.4.exe', browser_download_url: 'https://evil.example/Cyrene-Setup-1.3.4.exe', size: 1}],
  }));
  assert.equal(release.installer, null);
});

test('html_url 异常时按标签拼出发布页地址', () => {
  const release = normalizeRelease(rawRelease({html_url: 'https://evil.example/'}));
  assert.equal(release.htmlUrl, 'https://github.com/Playa-Cyrene/Cyrene-Agent/releases/tag/v1.3.4');
});

test('草稿、预发布、非版本号标签与异常响应返回 null', () => {
  assert.equal(normalizeRelease(rawRelease({draft: true})), null);
  assert.equal(normalizeRelease(rawRelease({prerelease: true})), null);
  assert.equal(normalizeRelease(rawRelease({tag_name: 'nightly'})), null);
  assert.equal(normalizeRelease({message: 'API rate limit exceeded'}), null);
  assert.equal(normalizeRelease(null), null);
  assert.equal(normalizeRelease('oops'), null);
});

test('compareVersions 按数字比较各段', () => {
  assert.ok(compareVersions('1.3.10', '1.3.9') > 0);
  assert.ok(compareVersions('1.4.0', '1.3.99') > 0);
  assert.equal(compareVersions('1.3.4', '1.3.4'), 0);
  assert.ok(compareVersions('1.3.0', '1.3.4') < 0);
});

test('pickNewer 只接受更新的版本：旧版本、相同版本与空结果都保留当前值', () => {
  const current = normalizeRelease(rawRelease());
  const newer = normalizeRelease(rawRelease({tag_name: 'v1.3.5'}));
  const older = normalizeRelease(rawRelease({tag_name: 'v1.3.3'}));
  assert.equal(pickNewer(current, newer), newer);
  assert.equal(pickNewer(current, older), current);
  assert.equal(pickNewer(current, current), current);
  assert.equal(pickNewer(current, null), current);
});

test('formatSize 与 formatDate', () => {
  assert.equal(formatSize(525549350), '501 MB');
  assert.equal(formatSize(0), '');
  assert.equal(formatDate('2026-10-18T12:20:09Z'), '2026-10-18');
  assert.equal(formatDate(''), '');
});

test('仓库快照与解析结果同形，可直接作为构建兜底', () => {
  const fallback = JSON.parse(readFileSync(new URL('../data/latest-release.fallback.json', import.meta.url), 'utf8'));
  assert.match(fallback.version, /^\d+\.\d+\.\d+$/);
  assert.equal(fallback.tag, `v${fallback.version}`);
  assert.match(fallback.htmlUrl, /^https:\/\/github\.com\/Playa-Cyrene\/Cyrene-Agent\/releases\/tag\//);
  assert.match(fallback.installer.url, /^https:\/\/github\.com\/Playa-Cyrene\/Cyrene-Agent\/releases\/download\/.+\/Cyrene-Setup-\d+\.\d+\.\d+\.exe$/);
});
