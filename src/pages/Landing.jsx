import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

export const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const sectionIds = ['hero', 'workforce', 'attendance', 'payroll', 'analytics', 'security'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // Triggers when section occupies the middle of the viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.landing}>
      {/* Global Header */}
      <header className={styles.header}>
        <div className={styles.brand} onClick={() => scrollToSection('hero')}>
          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          <h1 className={styles.brandTitle}>EXECUTIVE</h1>
        </div>
        
        <nav className={styles.navLinks}>
          <span className={styles.navLink} onClick={() => scrollToSection('hero')}>Hero</span>
          <span className={styles.navLink} onClick={() => scrollToSection('workforce')}>Workforce</span>
          <span className={styles.navLink} onClick={() => scrollToSection('attendance')}>Attendance</span>
          <span className={styles.navLink} onClick={() => scrollToSection('payroll')}>Payroll</span>
          <span className={styles.navLink} onClick={() => scrollToSection('analytics')}>Analytics</span>
          <span className={styles.navLink} onClick={() => scrollToSection('security')}>Security</span>
        </nav>

        <div className={styles.headerActions}>
          <button type="button" className={styles.loginBtn} onClick={handleLoginClick}>Sign In</button>
          <button type="button" className={styles.btnLiaison} onClick={handleGetStartedClick}>Get Started</button>
        </div>
      </header>

      {/* Fixed Chapter Indicator on the Right */}
      <div className={styles.chapterIndicator}>
        <span className={styles.indicatorLabel}>CHAPTERS</span>
        <div className={`${styles.indicatorItem} ${activeSection === 0 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('hero')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>01 Hero</span>
        </div>
        <div className={`${styles.indicatorItem} ${activeSection === 1 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('workforce')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>02 Workforce</span>
        </div>
        <div className={`${styles.indicatorItem} ${activeSection === 2 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('attendance')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>03 Attendance</span>
        </div>
        <div className={`${styles.indicatorItem} ${activeSection === 3 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('payroll')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>04 Payroll</span>
        </div>
        <div className={`${styles.indicatorItem} ${activeSection === 4 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('analytics')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>05 Analytics</span>
        </div>
        <div className={`${styles.indicatorItem} ${activeSection === 5 ? styles.indicatorItemActive : ''}`} onClick={() => scrollToSection('security')}>
          <div className={styles.indicatorDot} />
          <span className={styles.indicatorText}>06 Security</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className={styles.section} style={{ padding: 0 }}>
        {/* Full-screen background image provided by the user with dark vignette/blur overlay */}
        <div 
          className={styles.heroBg} 
          style={{ 
            backgroundImage: `url('/boardroom.png')`,
            filter: 'blur(1px)'
          }} 
        />
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <div className={styles.signatureRuleCenter} />
          <h2 className={styles.displayTitle} style={{ fontSize: '72px', marginBottom: '24px' }}>
            The Future of Enterprise Workforce Management
          </h2>
          <p className={styles.bodyLarge} style={{ maxWidth: '720px', margin: '0 auto 48px auto' }}>
            One intelligent platform for modern HR teams.
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <button type="button" className={styles.btnBronze} onClick={handleGetStartedClick}>Get Started</button>
            <button type="button" className={styles.btnInquiry} onClick={handleLoginClick}>Login</button>
          </div>
        </div>

        <div className={styles.scrollIndicatorBottom} onClick={() => scrollToSection('workforce')}>
          <div className={styles.mouseIcon}>
            <div className={styles.mouseWheel} />
          </div>
          <span>Explore</span>
        </div>
      </section>

      {/* CHAPTER 1: Workforce Section */}
      <section id="workforce" className={styles.section}>
        <div className={styles.layoutWidth}>
          <div className={styles.signatureRuleCenter} />
          <h2 className={styles.displayTitle} style={{ textAlign: 'center', marginBottom: '20px' }}>Everything About Your Workforce.</h2>
          <p className={styles.bodyLarge} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px auto' }}>
            Manage employees, departments, documents, onboarding and organizational structure from one secure platform.
          </p>
          
          <div className={styles.workforceGrid}>
            <div className={styles.glassCard}>
              <span className={`material-symbols-outlined ${styles.cardIcon}`}>badge</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Employee Directory</h4>
              <p className={styles.bodyMedium}>Maintain clean digital employee records and unified profiles across your entire footprint.</p>
            </div>
            
            <div className={styles.glassCard}>
              <span className={`material-symbols-outlined ${styles.cardIcon}`}>cloud_done</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Document Storage</h4>
              <p className={styles.bodyMedium}>Store confidential digital files, resumes, and compliance documents in encrypted storage vaults.</p>
            </div>

            <div className={styles.glassCard}>
              <span className={`material-symbols-outlined ${styles.cardIcon}`}>flowchart</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Organisation Structure</h4>
              <p className={styles.bodyMedium}>Model reporting relationships, hierarchy flows, and corporate departments dynamically.</p>
            </div>

            <div className={styles.glassCard}>
              <span className={`material-symbols-outlined ${styles.cardIcon}`}>assignment_ind</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Digital Onboarding</h4>
              <p className={styles.bodyMedium}>Streamline new hire paperwork, default permission sets, and employee credentials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 2: Attendance Section */}
      <section id="attendance" className={styles.section}>
        <div className={styles.layoutWidth}>
          <div className={styles.attendanceGrid}>
            <div className="text-left">
              <div className={styles.signatureRule} />
              <h2 className={styles.displayTitle}>Attendance Without Manual Work.</h2>
              <p className={styles.bodyLarge} style={{ margin: '24px 0 40px 0' }}>
                Automate attendance, leave approvals, work hours and employee availability with complete visibility.
              </p>
              <div className={styles.techList}>
                <div className={styles.techItem}>
                  <span className={`material-symbols-outlined ${styles.techIcon}`}>done_all</span>
                  <span className={styles.bodyMedium} style={{ color: '#e3e2e3', fontWeight: '500' }}>Real-Time Attendance logs &amp; records</span>
                </div>
                <div className={styles.techItem}>
                  <span className={`material-symbols-outlined ${styles.techIcon}`}>date_range</span>
                  <span className={styles.bodyMedium} style={{ color: '#e3e2e3', fontWeight: '500' }}>Leave Calendars &amp; approvals</span>
                </div>
                <div className={styles.techItem}>
                  <span className={`material-symbols-outlined ${styles.techIcon}`}>assessment</span>
                  <span className={styles.bodyMedium} style={{ color: '#e3e2e3', fontWeight: '500' }}>Daily presence reports &amp; availability grids</span>
                </div>
              </div>
            </div>
            
            {/* Redesigned Image Container occupying 55% of layout, height 600px, rounded corners 24px */}
            <div className={styles.attendanceImageContainer}>
              <img src="/office_checkin.png" alt="Axon Global Reception Checkin" className={styles.attendanceImage} />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: Payroll Section */}
      <section id="payroll" className={styles.section}>
        <div className={styles.layoutWidth}>
          <div className={styles.signatureRuleCenter} />
          <h2 className={styles.displayTitle} style={{ textAlign: 'center', marginBottom: '20px' }}>Payroll That Runs Itself.</h2>
          <p className={styles.bodyLarge} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px auto' }}>
            Calculate salaries, payroll approvals, budgets and financial records while maintaining company-wide compliance.
          </p>
          
          <div className={styles.payrollGrid}>
            <div className={styles.payrollCard}>
              <div>
                <span className={styles.payrollLbl}>Audit Ready</span>
                <div className={styles.payrollVal}>100%</div>
              </div>
              <p className={styles.bodyMedium}>Instant reports and automated tax logs ensure continuous compliance audit standing.</p>
            </div>
            
            <div className={styles.payrollCard}>
              <div>
                <span className={styles.payrollLbl}>Smart Payroll Engine</span>
                <div className={styles.payrollVal}>Auto</div>
              </div>
              <p className={styles.bodyMedium}>Automatically calculates salaries, deductions, bonuses and tax components from attendance and employee records without manual processing.</p>
            </div>

            <div className={styles.payrollCard}>
              <div>
                <span className={styles.payrollLbl}>One-Click Payroll Runs</span>
                <div className={styles.payrollVal}>One Click</div>
              </div>
              <p className={styles.bodyMedium}>Disburse monthly salaries directly linked to target department budget allowances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 4: Analytics Section */}
      <section id="analytics" className={styles.section}>
        <div className={styles.layoutWidth}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <div className={styles.signatureRuleCenter} />
            <h2 className={styles.displayTitle}>Data That Helps You Lead.</h2>
            <p className={styles.bodyLarge}>
              Monitor workforce performance, employee growth, attendance trends and operational metrics from one intelligent dashboard.
            </p>
          </div>
          
          <div className={styles.analyticsContainer}>
            {/* 50% Larger dashboard mockup with glow, depth, and glass highlights */}
            <div className={styles.dashboardMockup}>
              <div className={styles.mockupHeader}>
                <span className={styles.mockupTitle}>Workforce Intelligence</span>
                <span style={{ fontSize: '12px', color: '#B58863', fontWeight: 'bold', letterSpacing: '0.05em' }}>LIVE MONITOR</span>
              </div>
              <div className={styles.mockupGrid}>
                <div className={styles.mockupCard}>
                  <span style={{ fontSize: '11px', color: '#8d9195', display: 'block', marginBottom: '8px' }}>Active Employees</span>
                  <span className={styles.mockupValue}>1,248</span>
                </div>
                <div className={styles.mockupCard}>
                  <span style={{ fontSize: '11px', color: '#8d9195', display: 'block', marginBottom: '8px' }}>Present Today</span>
                  <span className={styles.mockupValue}>98.4%</span>
                </div>
                <div className={styles.mockupCard}>
                  <span style={{ fontSize: '11px', color: '#8d9195', display: 'block', marginBottom: '8px' }}>Budget Allocations</span>
                  <span className={styles.mockupValue}>99.1%</span>
                </div>
              </div>
              <div className={styles.mockupChart}>
                <div className={styles.mockupBar} style={{ height: '35%' }} />
                <div className={styles.mockupBar} style={{ height: '70%' }} />
                <div className={styles.mockupBar} style={{ height: '55%' }} />
                <div className={styles.mockupBar} style={{ height: '95%' }} />
                <div className={styles.mockupBar} style={{ height: '80%' }} />
                <div className={styles.mockupBar} style={{ height: '65%' }} />
                <div className={styles.mockupBar} style={{ height: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 5: Security Section */}
      <section id="security" className={styles.section}>
        <div className={styles.layoutWidth}>
          <div className={styles.signatureRuleCenter} />
          <h2 className={styles.displayTitle} style={{ textAlign: 'center', marginBottom: '24px' }}>Enterprise Security Built In.</h2>
          <p className={styles.bodyLarge} style={{ textAlign: 'center', marginBottom: '64px' }}>
            Role-based permissions, company-level data isolation, secure authentication and protected employee records from day one.
          </p>
          
          <div className={styles.securityGrid}>
            <div className={styles.glassCard}>
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ display: 'block', marginBottom: '16px' }}>verified_user</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Role-Based Access</h4>
              <p className={styles.bodyMedium}>Set granular clearances restricting standard employees to profile reads, reserving administration controls for HR.</p>
            </div>
            
            <div className={styles.glassCard}>
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ display: 'block', marginBottom: '16px' }}>domain_disabled</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Company Isolation</h4>
              <p className={styles.bodyMedium}>All attendance records, leaves, payroll configurations, and employee directories are isolated by company schema.</p>
            </div>

            <div className={styles.glassCard}>
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ display: 'block', marginBottom: '16px' }}>enhanced_encryption</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Encrypted Storage</h4>
              <p className={styles.bodyMedium}>AES-256 military-grade encryption protection for raw database fields and employee resume attachments.</p>
            </div>

            <div className={styles.glassCard}>
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ display: 'block', marginBottom: '16px' }}>fingerprint</span>
              <h4 className={styles.bodyLarge} style={{ fontWeight: '700', marginBottom: '12px', color: '#e4c0a1' }}>Secure Authentication</h4>
              <p className={styles.bodyMedium}>Strict password rules, multi-factor tokens, and audit login trails for secure compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA & FOOTER */}
      <section id="cta" className={styles.section} style={{ padding: '160px 0 40px 0', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className={styles.ctaWrapper}>
          <div className={styles.signatureRuleCenter} />
          <h2 className={styles.ctaTitle}>Build a Smarter Workplace.</h2>
          <p className={styles.ctaDesc}>
            Whether you're managing 20 employees or 20,000, Executive grows with your business.
          </p>
          <div className={styles.ctaButtons}>
            <button type="button" className={styles.btnBronze} onClick={handleGetStartedClick}>Get Started</button>
            <button type="button" className={styles.btnInquiry} onClick={handleLoginClick}>Sign In</button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.footerSection}>
          <footer className={styles.footer}>
            <span className={styles.labelSmall} style={{ color: '#8d9195' }}>
              © 2026 THE EXECUTIVE. ALL RIGHTS RESERVED.
            </span>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Support</a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Landing;
