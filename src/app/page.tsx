import Link from 'next/link'
import Button from '@/components/ui/Button'
import './page.css'

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-blob blob-1"></div>
                    <div className="hero-blob blob-2"></div>

                    {/* Floating Elements */}
                    <div className="floating-tag tag-1 tag-pastel-blue">
                        <span className="tag-icon">🌍</span> Remote
                    </div>
                    <div className="floating-tag tag-2 tag-pastel-green">
                        <span className="tag-icon">💼</span> Full-time
                    </div>
                    <div className="floating-tag tag-3 tag-pastel-orange">
                        <span className="tag-icon">🎨</span> Product Design
                    </div>
                    <div className="floating-tag tag-4 tag-pastel-purple">
                        <span className="tag-icon">💰</span> $120k/yr
                    </div>
                    <div className="floating-tag tag-5 tag-pastel-red">
                        <span className="tag-icon">⚛️</span> React
                    </div>
                    <div className="floating-tag tag-6 tag-pastel-yellow">
                        <span className="tag-icon">⭐️</span> Senior
                    </div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-label uppercase">Reverse Job Board</div>
                        <h1 className="hero-title display-lg serif">
                            Companies find you.<br />
                            Not the other way around.
                        </h1>
                        <p className="hero-description">
                            Stop endless job searching. Create your profile once and let companies
                            discover you based on your skills, experience, and preferences.
                        </p>
                        <div className="hero-actions">
                            <Link href="/register?role=JOBSEEKER">
                                <Button variant="primary" size="lg">
                                    Create Profile
                                </Button>
                            </Link>
                            <Link href="/register?role=HR" className="hero-link">
                                Post a Job <span className="arrow">→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number display-sm serif">1,247</div>
                            <div className="stat-label uppercase">Active Candidates</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number display-sm serif">532</div>
                            <div className="stat-label uppercase">Companies</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number display-sm serif">95%</div>
                            <div className="stat-label uppercase">Match Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="process-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title serif">How it works</h2>
                    </div>

                    <div className="process-grid">
                        <div className="process-step">
                            <div className="step-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div className="step-number serif">01</div>
                            <h3 className="step-title serif">Build your profile</h3>
                            <p className="step-description">
                                Add your skills, experience, work preferences, and what you're looking for in your next role.
                            </p>
                        </div>

                        <div className="process-step">
                            <div className="step-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <div className="step-number serif">02</div>
                            <h3 className="step-title serif">Get matched</h3>
                            <p className="step-description">
                                Our algorithm automatically matches your profile with relevant job openings from companies.
                            </p>
                        </div>

                        <div className="process-step">
                            <div className="step-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                            </div>
                            <div className="step-number serif">03</div>
                            <h3 className="step-title serif">Companies reach out</h3>
                            <p className="step-description">
                                When there's a match, companies can contact you directly. You decide if you're interested.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Companies */}
            <section className="companies-section">
                <div className="container">
                    <div className="companies-grid">
                        <div className="companies-content">
                            <div className="section-label uppercase">For Hiring Teams</div>
                            <h2 className="companies-title display-md serif">
                                Find qualified candidates instantly
                            </h2>
                            <p className="companies-description">
                                Post a job and see auto-matched candidates immediately. Or search
                                our talent database to find the perfect fit for your team.
                            </p>

                            <div className="feature-list">
                                <div className="feature-item">
                                    <div className="feature-icon">⚡️</div>
                                    <div className="feature-text">Automatic candidate matching</div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">🔍</div>
                                    <div className="feature-text">Advanced talent search filters</div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">💬</div>
                                    <div className="feature-text">Direct candidate communication</div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">🎥</div>
                                    <div className="feature-text">Video introduction requests</div>
                                </div>
                            </div>

                            <Link href="/register?role=HR">
                                <Button variant="primary" size="lg">
                                    Start Hiring
                                </Button>
                            </Link>
                        </div>

                        <div className="companies-visual">
                            <div className="visual-card card-1">
                                <div className="visual-header">
                                    <div className="visual-avatar"></div>
                                    <div className="visual-info">
                                        <div className="visual-line line-lg"></div>
                                        <div className="visual-line line-sm"></div>
                                    </div>
                                </div>
                                <div className="visual-tag">Match: 98%</div>
                            </div>
                            <div className="visual-card card-2">
                                <div className="visual-header">
                                    <div className="visual-avatar"></div>
                                    <div className="visual-info">
                                        <div className="visual-line line-lg"></div>
                                        <div className="visual-line line-sm"></div>
                                    </div>
                                </div>
                                <div className="visual-tag">Match: 95%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title display-md serif">
                            Ready to be discovered?
                        </h2>
                        <p className="cta-description">
                            Join thousands of professionals who get matched with their dream jobs.
                        </p>
                        <Link href="/register">
                            <Button variant="primary" size="lg">
                                Get Started — It's Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
