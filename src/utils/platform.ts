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
      // Try to find ARM64 or x64 specific build, fallback to any macOS build
      if (arch === 'arm64') {
        const arm = assets.find((a) => a.name.toLowerCase().includes('macos') && a.name.toLowerCase().includes('arm64'));
        if (arm) return arm.browser_download_url;
      }

      // Check for DMG files first (official releases)
      const dmg = assets.find((a) => a.name.includes('Universal.dmg') || (a.name.includes('macos') && a.name.endsWith('.dmg')));
      if (dmg) return dmg.browser_download_url;

      // Fallback to any macOS zip or package
      const macBuild = assets.find((a) => a.name.toLowerCase().includes('macos') || a.name.toLowerCase().includes('darwin'));
      return macBuild?.browser_download_url || null;

    case 'Windows':
      // Check for MSI first (official releases), then EXE, then ZIP
      const msi = assets.find((a) => a.name.endsWith('.msi'));
      if (msi) return msi.browser_download_url;

      const exe = assets.find((a) => a.name.endsWith('.exe'));
      if (exe) return exe.browser_download_url;

      const winZip = assets.find((a) => a.name.toLowerCase().includes('windows') || a.name.toLowerCase().includes('win'));
      return winZip?.browser_download_url || null;

    case 'Linux':
      // Try DEB first (most common), then RPM, then JAR, then any Linux build
      const deb = assets.find((a) => a.name.includes('amd64.deb') || a.name.endsWith('.deb'));
      if (deb) return deb.browser_download_url;

      const rpm = assets.find((a) => a.name.includes('.rpm'));
      if (rpm) return rpm.browser_download_url;

      const jar = assets.find((a) => a.name.includes('.jar'));
      if (jar) return jar.browser_download_url;

      const linuxBuild = assets.find((a) => a.name.toLowerCase().includes('linux'));
      return linuxBuild?.browser_download_url || null;

    default:
      return null;
  }
}
