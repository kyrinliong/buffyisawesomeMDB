import { Link } from 'react-router-dom';

const socialLinks = [
  { name: 'TikTok', icon: '🎵', url: '#' },
  { name: 'Instagram', icon: '📷', url: '#' },
  { name: 'X', icon: '𝕏', url: '#' },
  { name: 'YouTube', icon: '▶', url: '#' },
  { name: 'Facebook', icon: '📘', url: '#' },
];

const footerLinks = [
  { label: 'Help', to: '#' },
  { label: 'Site Index', to: '#' },
  { label: 'buffyisawesomeMDBPro', to: '#' },
  { label: 'Box Office Mojo', to: '#' },
  { label: 'License Data', to: '#' },
];

const legalLinks = [
  { label: 'Press Room', to: '#' },
  { label: 'Advertising', to: '#' },
  { label: 'Jobs', to: '#' },
  { label: 'Conditions of Use', to: '#' },
  { label: 'Privacy Policy', to: '#' },
  { label: 'Your Ads Privacy Choices', to: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-card-white border-t border-pale-blush mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Top section: Social + App */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Social */}
          <div className="text-center md:text-left">
            <h3 className="font-cursive text-2xl text-rosy-pink mb-4">
              Follow buffyisawesomeMDB on social
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-lg hover:bg-rosy-pink hover:text-white transition-all"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* App */}
          <div className="text-center md:text-right">
            <h3 className="font-cursive text-2xl text-rosy-pink mb-4">
              Get the buffyisawesomeMDB app
            </h3>
            <p className="text-sm text-dusty-rose font-body mb-2">For Android and iOS</p>
            <div className="inline-block bg-white p-2 rounded-lg border border-pale-blush">
              <div className="w-24 h-24 bg-pale-blush/50 rounded flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-pale-blush/50 pt-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-dusty-rose hover:text-rosy-pink font-body transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs text-dusty-rose/70 hover:text-rosy-pink font-body transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-center">
            <p className="font-cursive text-lg text-rosy-pink/80">
              made with 💖 and pastel dreams
            </p>
            <p className="text-xs text-dusty-rose/60 mt-1 font-body">
              © 2026 buffyisawesomeMDB
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
