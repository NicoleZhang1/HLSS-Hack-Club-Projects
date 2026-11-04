import React, { createContext, useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Link as LinkIcon,
  Menu,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import "./styles.css";
import "./modern.css";
import { mockProjects } from "./mockProjects";
import trophyImg from "./assets/snoopy_trophy.jpg";
import creativeImg from "./assets/snoopy_creative.jpg";
import beginnerImg from "./assets/snoopy_beginner.jpg";

const AuthContext = createContext({
  user: null,
  signUp: () => {},
  logIn: () => {},
  logOut: () => {},
});
const useAuth = () => useContext(AuthContext);

function Navbar() {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link className="brand" to="/">
        <span className="brand-mark">H</span>
        <span>HLSS HACKATHON</span>
      </Link>
      <button
        className="menu"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/new">Submit project</NavLink>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="email">{user.email}</span>
            <button className="button ghost" onClick={logOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link className="text-link" to="/login">
              Log in
            </Link>
            <Link className="button small" to="/signup">
              Sign up <ArrowUpRight size={15} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

function Landing() {
  return (
    <>
      <section className="hero">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-bg" />
        <h1>
          HLSS
          <br />
          <em>HACKATHON </em>
        </h1>
        <p className="hero-copy">Open to all students! ٩(ˊᗜˋ )و</p>
        <div className="hero-actions">
          <Link className="button large" to="/signup">
            Join the hackathon <ArrowUpRight />
          </Link>
          <Link className="watch-link" to="/projects">
            Explore projects <span>→</span>
          </Link>
        </div>
        <a href="#prizes" className="scroll">
          <span>SCROLL</span>
          <ArrowDown size={18} />
        </a>
      </section>
      <section id="prizes" className="prizes">
        <div className="section-head">
          <h2>Prizes</h2>
          <p>Each project can win more than one award. ♕⋆｡°✩</p>
        </div>
        <div className="prize-grid">
          <Prize title="Best Overall" amount="$40" image={trophyImg} />
          <Prize
            title="Most Creative"
            amount="$30"
            image={creativeImg}
            featured
          />
          <Prize
            title="Best Beginner Project"
            amount="$30"
            image={beginnerImg}
          />
        </div>
      </section>
      <section id="info" className="prizes info-section">
        <div className="section-head">
          <h2>Info</h2>
          <ul className="info-list">
            <li>
              Build any project you choose, such as a game, website, or app. The
              theme is <strong>Encouraging Women in STEM</strong>, but students
              of all genders are welcome to compete.
            </li>
            <li>Teams of any size are allowed.</li>
            <li>
              There are no hackathon meetings (in case you're busy at lunch!),
              aside from an awards meeting and possibly an opening meeting.
            </li>
            <li>Projects will be judged impartially by the hackathon hosts.</li>
            <li>There is no cost to enter.</li>
            <li>The last day to submit is January 2nd.</li>
          </ul>
          <p className="info-contact">
            Questions? Contact:{" "}
            <span className="info-emails">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=785129@pdsb.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                785129@pdsb.net
              </a>{" "}
              or{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=903991@pdsb.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                903991@pdsb.net
              </a>
            </span>
            .
          </p>
        </div>
      </section>
      <section className="final-cta">
        <div className="star">✳</div>
        <h2>
          HLSS
          <br />
          <em>HACKATHON</em>
        </h2>
        <Link className="button light large" to="/signup">
          Sign up now <ArrowUpRight />
        </Link>
        <Link className="login-under" to="/login">
          Already have an account? Log in
        </Link>
      </section>
    </>
  );
}
function Prize({ number, title, amount, image, featured = false }) {
  return (
    <article className={featured ? "prize-card creative-prize" : "prize-card"}>
      <span className="prize-num">{number}</span>
      <div className="prize-icon">
        <img src={image} alt={title} />
      </div>
      <h3>{title}</h3>
      <p>{amount}</p>
    </article>
  );
}

function ProjectCard({ project, mine, onDelete }) {
  return (
    <article
      className={
        "project-card " + (project.status === "pending" ? "pending" : "")
      }
    >
      <div className="card-art">
        <span>{project.name.slice(0, 1)}</span>
        <div className="card-scribble" />
      </div>
      {project.status === "pending" && <div className="review">In review</div>}
      <div className="card-body">
        <div className="project-top">
          <p>BY {project.author_name}</p>
          {mine && (
            <button
              className="trash"
              aria-label="Delete project"
              onClick={() => onDelete(project)}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <h3>{project.name}</h3>
        <p className="description">{project.description}</p>
        <a href={project.link} className="project-link" target="_blank">
          View project <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
function Projects() {
  const [mine, setMine] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const visible = mockProjects.filter((project) => {
    const isMine = project.user_id === "current-user";
    const isVisibleWhileInReview = project.status !== "pending" || isMine;
    return isVisibleWhileInReview && (!mine || isMine);
  });
  return (
    <main className="page projects-page">
      <div className="page-intro">
        <h1>Projects!</h1>
        <p>Everything submitted thus far! ヽ(°〇°)ﾉ</p>
      </div>
      <div className="filter-row">
        <span>{visible.length} PROJECTS</span>
        <button
          className={"toggle " + (mine ? "active" : "")}
          onClick={() => setMine(!mine)}
          aria-pressed={mine}
        >
          <span className="toggle-dot" /> My projects
        </button>
      </div>
      <div className="projects-grid">
        <Link to="/new" className="new-card">
          <Plus size={42} />
          <span>Submit a project</span>
        </Link>
        {visible.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            mine={p.user_id === "current-user"}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>
      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          close={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
function DeleteModal({ project, close }) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X size={20} />
        </button>
        <div className="danger-icon">
          <Trash2 size={23} />
        </div>
        <h2>Delete this project?</h2>
        <p>
          <strong>{project.name}</strong> will be removed. This can’t be undone.
        </p>
        <div className="modal-actions">
          <button className="button ghost" onClick={close}>
            Cancel
          </button>
          <button className="button danger" onClick={close}>
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}

function NewProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    author: "",
    description: "",
    link: "",
    image: null,
  });
  const submit = (e) => {
    e.preventDefault();
    console.log(form);
    navigate("/projects");
  };
  return (
    <main className="form-page">
      <div className="form-wrap">
        <div className="form-banner">
          <span>NEW PROJECT</span>
        </div>
        <form onSubmit={submit}>
          <h1>Submit your project</h1>
          <label>
            Project name <b>*</b>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Give it a memorable name"
            />
          </label>
          <label>
            Your name <b>*</b>
            <input
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="How should we credit you?"
            />
          </label>
          <label>
            Project description (optional)
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What did you build? What makes it special?"
            />
          </label>
          <label>
            Project link <b>*</b>
            <input
              required
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="Link to live demo, or repo"
            />
          </label>
          <label>
            Project image (optional) — only PNG and JPG allowed
            <input
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files?.[0] ?? null })
              }
            />
          </label>
          <button className="button large submit" type="submit">
            Submit project <ArrowUpRight />
          </button>
        </form>
      </div>
    </main>
  );
}
function AuthPage({ login = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const action = (e) => {
    e.preventDefault();
    console.log(form);
    navigate("/projects");
  };
  return (
    <main className="auth-page">
      <div className="auth-decoration">✦</div>
      <form className="auth-card" onSubmit={action}>
        <h1>{login ? "Log in" : "Sign up"}</h1>
        <p>{login ? "Hi again! （-＾▽＾-）" : "(ᵔ◡ᵔ) Woohoo!"}</p>
        <label>
          Email
          <input
            type="email"
            required
            placeholder={
              login ? "you@example.com" : "School (preferably) or personal"
            }
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="button large submit">
          {login ? "Log in" : "Create account"} <ArrowUpRight />
        </button>
        <p className="auth-switch">
          {login ? "New here? " : "Already have an account? "}
          <Link to={login ? "/signup" : "/login"}>
            {login ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </main>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <Link className="brand" to="/">
        <span className="brand-mark">H</span>
        <span>HLSS HACKATHON</span>
      </Link>
      <p></p>
      <span>2026</span>
    </footer>
  );
}
function App() {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        signUp: () => {},
        logIn: () => {},
        logOut: () => {},
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/create" element={<Projects />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
createRoot(document.getElementById("root")).render(<App />);
