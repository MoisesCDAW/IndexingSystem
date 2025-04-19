import './HeaderStyle.css';
import { NavLink } from 'react-router-dom';

function HeaderComponent(props) {
    return (
        <div className="header-container">
            <div className="header-content">
                <h2 className="header-title">{props.title}</h2>
                <nav>
                    <ul className="header-list">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                Validation
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/urls"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                Collection
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default HeaderComponent;