/**
 * GitHub Release Asset Interface
 */
export interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
  content_type: string;
}

/**
 * GitHub Release Interface
 */
export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: GitHubAsset[];
}

/**
 * Fetch the latest release from GitHub API
 * @returns Promise with release data
 * @throws Error if fetch fails
 */
export async function fetchLatestRelease(): Promise<GitHubRelease> {
  const response = await fetch(
    'https://api.github.com/repos/risa-labs-inc/BOSS-Releases/releases/latest'
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch release: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch all releases from GitHub API
 * @returns Promise with array of release data
 * @throws Error if fetch fails
 */
export async function fetchAllReleases(): Promise<GitHubRelease[]> {
  const response = await fetch(
    'https://api.github.com/repos/risa-labs-inc/BOSS-Releases/releases'
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch releases: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
