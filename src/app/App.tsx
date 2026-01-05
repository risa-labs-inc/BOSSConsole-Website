import { useState, useEffect } from 'react';
import { Github, Download, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { useReleaseData } from '../hooks/useReleaseData';
import { useAllReleases } from '../hooks/useAllReleases';
import { detectPlatform, detectArchitecture, getDefaultDownloadUrl } from '../utils/platform';
import { GitHubAsset } from '../services/github';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'changelog'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch release data from GitHub API
  const { release, loading, error } = useReleaseData();

  // Detect user's platform and architecture
  const userPlatform = detectPlatform();
  const userArch = detectArchitecture();

  const navigateTo = (page: 'home' | 'pricing' | 'changelog') => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  // Smart download handler for nav bar and pricing buttons
  const handleSmartDownload = () => {
    console.log('=== Download Button Clicked ===');
    console.log('Release loaded:', !!release);
    console.log('Assets count:', release?.assets?.length || 0);
    console.log('Detected platform:', userPlatform);
    console.log('Detected architecture:', userArch);
    console.log('User agent:', navigator.userAgent);

    if (!release) {
      alert('Release data is still loading. Please try again in a moment.');
      return;
    }

    if (!release.assets || release.assets.length === 0) {
      alert('No downloads available. Please try again later.');
      return;
    }

    const downloadUrl = getDefaultDownloadUrl(
      release.assets,
      userPlatform,
      userArch
    );

    console.log('Download URL:', downloadUrl);

    if (downloadUrl) {
      window.location.href = downloadUrl;
    } else {
      console.log('Available assets:', release.assets.map(a => a.name));
      alert('Unable to detect your platform. Please choose from the platform cards below.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="tracking-wider" style={{ letterSpacing: '-0.05em' }}>
                BOSS CONSOLE
              </h1>
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`tracking-wide transition-colors ${
                    currentPage === 'home' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage('pricing')}
                  className={`tracking-wide transition-colors ${
                    currentPage === 'pricing' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => setCurrentPage('changelog')}
                  className={`tracking-wide transition-colors ${
                    currentPage === 'changelog' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Changelog
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/risa-labs-inc/BOSS-Releases"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </div>
              </a>
              <button
                onClick={handleSmartDownload}
                disabled={loading || !release}
                className="hidden sm:flex px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{loading ? 'Loading...' : 'Download'}</span>
                </div>
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-black">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigateTo('home')}
                  className={`text-left py-2 tracking-wide transition-colors ${
                    currentPage === 'home' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigateTo('pricing')}
                  className={`text-left py-2 tracking-wide transition-colors ${
                    currentPage === 'pricing' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => navigateTo('changelog')}
                  className={`text-left py-2 tracking-wide transition-colors ${
                    currentPage === 'changelog' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Changelog
                </button>
                <div className="pt-2 border-t border-white/20 space-y-3">
                  <a
                    href="https://github.com/risa-labs-inc/BOSS-Releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <button
                    onClick={handleSmartDownload}
                    disabled={loading || !release}
                    className="flex items-center gap-2 py-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>{loading ? 'Loading...' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-3 text-sm">
          <div className="container mx-auto">
            Failed to load release information. Download buttons may not work.
            <a
              href="https://github.com/risa-labs-inc/BOSS-Releases/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline hover:text-red-400"
            >
              View releases on GitHub →
            </a>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {currentPage === 'home' && <HomePage release={release} loading={loading} error={error} />}
        {currentPage === 'pricing' && <PricingPage release={release} loading={loading} handleSmartDownload={handleSmartDownload} />}
        {currentPage === 'changelog' && <ChangelogPage />}
      </div>
    </div>
  );
}

/**
 * Typewriter component that cycles through different AI coding assistants
 */
function Typewriter() {
  const phrases = ['Claude Code', 'OpenAI Codex', 'Google Jules', 'GitHub Copilot'];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
          setTypingSpeed(100);
        } else {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), 1000);
          return;
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentPhrase.substring(0, displayText.length - 1));
          setTypingSpeed(50);
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(500); // Pause before typing next phrase
          return;
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <span>
      The most powerful way to use <span className="text-white">{displayText}</span>
      <span className="animate-pulse">|</span>
    </span>
  );
}

interface HomePageProps {
  release: any;
  loading: boolean;
  error: string | null;
}

function HomePage({ release, loading, error }: HomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl mb-8 tracking-wider" style={{ letterSpacing: '-0.05em' }}>
            BOSS CONSOLE AI
          </h2>
          <p className="text-base md:text-lg text-white/60 mb-12 tracking-wide">
            <Typewriter />
          </p>

          {/* BOSS Console Screenshot */}
          <div className="mb-16">
            <img
              src="/boss-console-screenshot.png"
              alt="BOSS Console Interface"
              className="w-full max-w-5xl mx-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Platform Download Cards */}
          <div className="grid md:grid-cols-3 gap-8 w-full px-4 mx-auto">
            <PlatformCard
              icon={<AppleLogo />}
              title="macOS"
              downloads={
                release
                  ? [
                      {
                        label: 'Download for Apple Silicon',
                        recommended: true,
                        url: release.assets.find((a) =>
                          a.name.toLowerCase().includes('macos') &&
                          (a.name.toLowerCase().includes('arm64') || a.name.includes('Universal.dmg'))
                        )?.browser_download_url,
                      },
                      {
                        label: 'Download for Intel',
                        url: release.assets.find((a) =>
                          a.name.toLowerCase().includes('macos') &&
                          (a.name.toLowerCase().includes('x64') || a.name.includes('Universal.dmg'))
                        )?.browser_download_url,
                      },
                    ]
                  : [
                      { label: 'Loading...', recommended: true },
                      { label: 'Loading...' },
                    ]
              }
              requirements={[
                { label: 'OS', value: 'macOS 11.0 (Big Sur) or later' },
                { label: 'Architecture', value: 'Universal (Apple Silicon + Intel)' },
                { label: 'Memory', value: '4 GB RAM minimum, 8 GB recommended' },
                { label: 'Storage', value: '500 MB available space' },
              ]}
            />
            <PlatformCard
              icon={<WindowsLogo />}
              title="Windows"
              downloads={
                release
                  ? [
                      {
                        label: 'Download for x64',
                        url: release.assets.find((a) =>
                          a.name.toLowerCase().includes('windows') ||
                          a.name.toLowerCase().includes('win') ||
                          a.name.endsWith('.msi') ||
                          a.name.endsWith('.exe')
                        )?.browser_download_url,
                      },
                    ]
                  : [{ label: 'Loading...' }]
              }
              requirements={[
                { label: 'OS', value: 'Windows 10 (64-bit) or later' },
                { label: 'Memory', value: '4 GB RAM minimum, 8 GB recommended' },
                { label: 'Storage', value: '500 MB available space' },
                { label: 'Runtime', value: 'Java 17+ (bundled with installer)' },
              ]}
            />
            <PlatformCard
              icon={<LinuxLogo />}
              title="Linux"
              downloads={
                release
                  ? [
                      {
                        label: 'Download DEB',
                        url: release.assets.find((a) => a.name.includes('.deb'))?.browser_download_url ||
                             release.assets.find((a) => a.name.toLowerCase().includes('linux'))?.browser_download_url,
                      },
                      {
                        label: 'Download RPM',
                        url: release.assets.find((a) => a.name.includes('.rpm'))?.browser_download_url ||
                             release.assets.find((a) => a.name.toLowerCase().includes('linux'))?.browser_download_url,
                      },
                      {
                        label: 'Download JAR',
                        url: release.assets.find((a) => a.name.includes('.jar'))?.browser_download_url ||
                             release.assets.find((a) => a.name.toLowerCase().includes('linux'))?.browser_download_url,
                      },
                    ]
                  : [
                      { label: 'Loading...' },
                      { label: 'Loading...' },
                      { label: 'Loading...' },
                    ]
              }
              requirements={[
                { label: 'DEB Package', value: 'Ubuntu 18.04+ / Debian 10+ / Linux Mint 19+' },
                { label: 'RPM Package', value: 'RHEL 8+ / Fedora 30+ / openSUSE 15+ / CentOS 8+' },
                { label: 'JAR Package', value: 'Any Linux distribution with Java 17+' },
                { label: 'Architecture', value: 'x86_64 (64-bit)' },
                { label: 'Memory', value: '4 GB RAM minimum, 8 GB recommended' },
                { label: 'Storage', value: '500 MB available space' },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function AppleLogo() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function WindowsLogo() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 88 88" fill="currentColor">
      <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z"/>
    </svg>
  );
}

function LinuxLogo() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.097-1.237 2.476-1.053 3.987.165 1.328.583 2.553 1.248 3.65.665 1.097 1.575 2.056 2.717 2.784 1.142.728 2.51 1.174 4.062 1.174 1.552 0 2.92-.446 4.062-1.174 1.142-.728 2.052-1.687 2.717-2.784.665-1.097 1.083-2.322 1.248-3.65.184-1.511-.168-2.89-1.053-3.987-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm-.033 2.722c2.515.107 2.532 2.452 2.565 3.738.041 1.591.428 2.842 1.382 4.194.686.972.944 2.073.823 3.281-.121.973-.453 1.916-1.003 2.783-.55.867-1.319 1.593-2.253 2.105-.934.512-2.017.77-3.152.77s-2.218-.258-3.152-.77c-.934-.512-1.703-1.238-2.253-2.105-.55-.867-.882-1.81-1.003-2.783-.121-1.208.137-2.309.823-3.281.954-1.352 1.341-2.603 1.382-4.194.033-1.286.05-3.631 2.565-3.738.083-.004.164-.005.245-.005z"/>
    </svg>
  );
}

function PlatformCard({
  icon,
  title,
  downloads,
  requirements,
}: {
  icon: React.ReactNode;
  title: string;
  downloads: { label: string; url?: string; recommended?: boolean }[];
  requirements: { label: string; value: string }[];
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-white/20 rounded-lg p-6 hover:border-white/40 transition-colors flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div>{icon}</div>
        <h4 className="text-lg tracking-wide text-left">{title}</h4>
      </div>

      {/* Fixed height container for downloads to ensure alignment */}
      <div className="h-[140px] mb-8">
        <div className="space-y-2">
          {downloads.map((download, idx) => (
            <button
              key={idx}
              onClick={() => download.url && (window.location.href = download.url)}
              disabled={!download.url}
              className="w-full px-4 py-2.5 text-sm border border-white/40 rounded-lg hover:bg-white hover:text-black transition-colors text-left flex items-center justify-between whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-left">{download.label}</span>
              {download.url && <Download className="w-3.5 h-3.5 flex-shrink-0 ml-3" />}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center justify-between w-full text-sm text-white/60 hover:text-white transition-colors mb-3 text-left"
      >
        <span className="text-left">System Requirements</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
      </button>

      {showDetails && (
        <div className="space-y-3 pt-3 border-t border-white/20 text-xs text-left">
          {requirements.map((req, idx) => (
            <div key={idx} className="text-left">
              <div className="text-white/60 mb-1 text-left">{req.label}</div>
              <div className="text-white text-left">{req.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PricingPageProps {
  release: any;
  loading: boolean;
  handleSmartDownload: () => void;
}

function PricingPage({ release, loading, handleSmartDownload }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="container mx-auto px-6 py-20 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-5 tracking-wider">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base text-white/60 mb-8 tracking-wide">
            Choose the plan that works best for you
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 border border-white/20 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 text-sm rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 text-sm rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <div className="border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl mb-2 tracking-wide">Hobby Mode</h3>
            <p className="text-sm text-white/60 mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-5xl">FREE</span>
            </div>
            <button
              onClick={handleSmartDownload}
              disabled={loading || !release}
              className="w-full mb-6 px-5 py-2.5 text-sm border border-white rounded-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Download Now'}
            </button>
            <div className="space-y-3 text-sm">
              <p className="mb-3">What's included:</p>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>One-week Pro Trial</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>Limited Agent Requests</span>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <span>-</span>
                <span className="line-through">Background Agents</span>
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <span>-</span>
                <span className="line-through">Extended Context Windows</span>
              </div>
            </div>
          </div>

          <div className="border border-white rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 text-xs rounded">
              RECOMMENDED
            </div>
            <h3 className="text-2xl mb-2 tracking-wide">BOSS Mode</h3>
            <p className="text-sm text-white/60 mb-6">For power users</p>
            <div className="mb-6">
              <span className="text-white/60 text-sm">$ </span>
              <span className="text-5xl">{billingCycle === 'monthly' ? '10k' : '100k'}</span>
              <span className="text-white/60 text-sm"> /{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <a
              href="https://calendly.com/anis-risalabs/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-6 px-5 py-2.5 text-sm bg-white text-black rounded-lg hover:bg-white/90 transition-colors block text-center"
            >
              Get BOSS Mode
            </a>
            <div className="space-y-3 text-sm">
              <p className="mb-3">Everything in Hobby Mode, plus:</p>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>Extended limits on Agent Requests</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>Background Agents</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>Maximum Context Windows</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-white/60">✓</span>
                <span>Priority Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border border-white/20 rounded-lg p-10 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl mb-3 tracking-wide">
            Ready to get started?
          </h3>
          <p className="text-white/60 mb-6 text-base">
            Download BOSS Console today and start building with Claude Code
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <button
              onClick={handleSmartDownload}
              disabled={loading || !release}
              className="px-6 py-2.5 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Download Now'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to parse asset information
function parseAssetInfo(asset: GitHubAsset) {
  const name = asset.name.toLowerCase();

  let platform = 'Unknown';
  let architecture = 'Unknown';
  let packageType = 'Unknown';

  // Detect platform and package type
  if (name.includes('.dmg')) {
    platform = 'macOS';
    packageType = 'DMG';
    architecture = name.includes('universal') ? 'Universal (Apple Silicon + Intel)' : 'Unknown';
  } else if (name.includes('.msi') || name.includes('.exe')) {
    platform = 'Windows';
    packageType = name.includes('.msi') ? 'MSI' : 'EXE';
    architecture = 'x64';
  } else if (name.includes('.deb')) {
    platform = 'Linux';
    packageType = 'DEB';
    architecture = name.includes('arm64') ? 'ARM64' : 'AMD64';
  } else if (name.includes('.rpm')) {
    platform = 'Linux';
    packageType = 'RPM';
    architecture = name.includes('arm64') ? 'ARM64' : 'AMD64';
  } else if (name.includes('.jar')) {
    platform = 'Linux';
    packageType = 'JAR';
    architecture = name.includes('arm64') ? 'ARM64' : 'AMD64';
  }

  return { platform, architecture, packageType, url: asset.browser_download_url };
}

function ChangelogPage() {
  const { releases, loading, error } = useAllReleases();

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-20 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl mb-3 tracking-wider">Changelog</h2>
          <p className="text-sm text-white/60 mb-12">Loading changelog...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-6 py-20 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl mb-3 tracking-wider">Changelog</h2>
          <p className="text-sm text-red-500 mb-12">
            Failed to load changelog. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-20 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl mb-3 tracking-wider">Changelog</h2>
        <p className="text-sm text-white/60 mb-12">
          Track all BOSS Console updates and improvements
        </p>

        <div className="space-y-12">
          {releases.map((release, idx) => {
            // Parse release body to extract What's New section
            const extractWhatsNew = (body: string) => {
              if (!body) return ['Release notes not available'];

              // Find the What's New section (handling emojis and various formats)
              const whatsNewRegex = /##?\s*[✨🚀📦🔧]*\s*What'?s\s+New[^#\n]*\n+([\s\S]*?)(?=\n##|$)/i;
              const whatsNewMatch = body.match(whatsNewRegex);

              if (whatsNewMatch && whatsNewMatch[1]) {
                // Extract bullet points
                const content = whatsNewMatch[1];
                const bullets = content
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line.startsWith('-') || line.startsWith('*'))
                  .map(line => line.replace(/^[-*]\s*/, '').trim());

                if (bullets.length > 0) {
                  return bullets;
                }
              }

              // Fallback: return release notes not available
              return ['Release notes not available'];
            };

            const releaseNotes = extractWhatsNew(release.body || '');

            // Parse assets for download table
            const downloads = release.assets.map(asset => parseAssetInfo(asset));

            // Format date
            const releaseDate = new Date(release.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={release.tag_name} className="border border-white/20 rounded-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-white/40 text-xs">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="text-right">
                      <h3 className="text-3xl mb-1">{release.tag_name}</h3>
                      <p className="text-xs text-white/60">Released: {releaseDate}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg mb-5"># {release.name || release.tag_name}</h4>
                  </div>

                  {/* What's New */}
                  <div className="mb-10">
                    <h5 className="text-base mb-4 flex items-center gap-2">
                      ✨ What's New
                    </h5>
                    <ul className="space-y-2 text-sm">
                      {releaseNotes.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-white/80 leading-relaxed flex items-start gap-2">
                          <span className="text-white/60 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Downloads Table */}
                  <div>
                    <h5 className="text-base mb-4 flex items-center gap-2">
                      📦 Downloads
                    </h5>
                    <div className="border border-white/20 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left py-3 px-4 text-white/60">Platform</th>
                            <th className="text-left py-3 px-4 text-white/60">Architecture</th>
                            <th className="text-left py-3 px-4 text-white/60">Package</th>
                            <th className="text-right py-3 px-4 text-white/60">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {downloads.map((download, downloadIdx) => (
                            <tr key={downloadIdx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">{download.platform}</td>
                              <td className="py-3 px-4">{download.architecture}</td>
                              <td className="py-3 px-4">
                                <span className="border border-white/40 rounded px-2 py-0.5 text-xs">
                                  {download.packageType}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <a
                                  href={download.url}
                                  className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 text-xs"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}