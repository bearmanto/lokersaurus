import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">Lokersaurus</h3>
                        <p className="footer-text">
                            Find your dream job or discover top talent.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">For Jobseekers</h4>
                        <ul className="footer-links">
                            <li><a href="/jobs">Browse Jobs</a></li>
                            <li><a href="/register">Create Profile</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">For Companies</h4>
                        <ul className="footer-links">
                            <li><a href="/register">Post a Job</a></li>
                            <li><a href="/register">Create Company Profile</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">About</h4>
                        <ul className="footer-links">
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} Lokersaurus. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
