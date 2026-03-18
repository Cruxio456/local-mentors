const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                <circle cx="16" cy="16" r="14" fill="hsl(152 60% 42%)" />
                <path d="M12 22V14L20 10V18" stroke="hsl(152 45% 6%)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="22" r="3" fill="hsl(152 45% 6%)" />
                <circle cx="18" cy="18" r="3" fill="hsl(80 65% 55%)" />
              </svg>
              <span className="font-display font-bold text-lg">Local Mentor</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting local mentors with students. Learn, teach, and grow together.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Find Mentors", "Categories", "Become a Mentor", "How It Works"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
            { title: "Support", links: ["Help Center", "Safety", "Terms", "Privacy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          © 2026 Local Mentor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
