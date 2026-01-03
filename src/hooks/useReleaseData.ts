import { useState, useEffect } from 'react';
import { GitHubRelease, fetchLatestRelease } from '../services/github';

/**
 * Custom hook to fetch and manage GitHub release data
 * Fetches once on component mount and provides loading/error states
 */
export function useReleaseData() {
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestRelease()
      .then((data) => {
        setRelease(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { release, loading, error };
}
