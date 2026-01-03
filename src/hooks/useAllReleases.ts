import { useState, useEffect } from 'react';
import { GitHubRelease, fetchAllReleases } from '../services/github';

/**
 * Custom hook to fetch and manage all GitHub releases
 * Fetches once on component mount and provides loading/error states
 */
export function useAllReleases() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReleases()
      .then((data) => {
        setReleases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { releases, loading, error };
}
