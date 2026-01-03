import { GitHubAsset } from '../services/github';

/**
 * Detect the user's operating system from user agent
 */
export function detectPlatform(): 'macOS' | 'Windows' | 'Linux' | 'Unknown' {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('mac os x') || userAgent.includes('macintosh')) {
    return 'macOS';
  } else if (userAgent.includes('win')) {
    return 'Windows';
  } else if (userAgent.includes('linux') || userAgent.includes('x11')) {
    return 'Linux';
  }

  return 'Unknown';
}

/**
 * Detect the user's CPU architecture from user agent
 */
export function detectArchitecture(): 'arm64' | 'x64' | 'unknown' {
  const userAgent = window.navigator.userAgent.toLowerCase();

  // Check for ARM64 (Apple Silicon, ARM servers)
  if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
    return 'arm64';
  }

  // Check for x64 (Intel/AMD 64-bit)
  if (
    userAgent.includes('x86_64') ||
    userAgent.includes('x64') ||
    userAgent.includes('amd64') ||
    userAgent.includes('wow64')
  ) {
    return 'x64';
  }

  return 'unknown';
}

/**
 * Get the appropriate download URL based on detected platform and architecture
 * Used for smart download buttons (nav bar, pricing page)
 */
export function getDefaultDownloadUrl(
  assets: GitHubAsset[],
  platform: string,
  arch: string
): string | null {
  if (!assets || assets.length === 0) {
    return null;
  }

  switch (platform) {
    case 'macOS':
      // macOS uses Universal binary (supports both Intel and ARM)
      const dmg = assets.find((a) => a.name.includes('Universal.dmg'));
      return dmg?.browser_download_url || null;

    case 'Windows':
      // Windows uses MSI installer
      const msi = assets.find((a) => a.name.endsWith('.msi'));
      return msi?.browser_download_url || null;

    case 'Linux':
      // Linux: Default to DEB package (most common - Ubuntu/Debian)
      // Could be enhanced to detect distro type, but DEB is safe fallback
      const deb = assets.find((a) => a.name.includes('amd64.deb'));
      return deb?.browser_download_url || null;

    default:
      return null;
  }
}
