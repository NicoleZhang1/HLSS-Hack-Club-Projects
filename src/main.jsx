import React, { createContext, useContext, useState, useEffect } from "react";
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
import { supabase } from "./supabaseClient";
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
            <button className="button logout-button" onClick={logOut}>
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
        "project-card " +
        (project.status === "pending" ? "pending" : "") +
        (project.status === "rejected" ? " rejected" : "")
      }
    >
      <div className="card-art">
        {project.image_url ? (
          <img
            className="card-image"
            src={project.image_url}
            alt={project.name}
          />
        ) : (
          <>
            <span>{project.name.slice(0, 1)}</span>
            <div className="card-scribble" />
          </>
        )}
      </div>
      {project.status === "pending" && <div className="review">In review</div>}
      {project.status === "rejected" && (
        <div className="review rejected-tag">
          <span>Not approved</span>
          <small>Check your email. 😢</small>
        </div>
      )}
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
  const { user } = useAuth();
  const [mine, setMine] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setProjects(
          data.map((p) => ({
            id: p.id,
            name: p.project_name,
            author_name: p.creator_name,
            description: p.description,
            link: p.project_link,
            image_url: p.image_url,
            status: p.status,
            user_id: p.user_id,
          })),
        );
      });
  }, [user]);
  const deleteProject = async (project) => {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .select();
    if (error || !data || data.length === 0) {
      console.error(error);
      alert("Couldn't delete the project. Please try again.");
      return;
    }
    if (project.image_url) {
      const path = project.image_url.split("/project-images/")[1];
      if (path) {
        await supabase.storage.from("project-images").remove([path]);
      }
    }
    setProjects((current) => current.filter((p) => p.id !== project.id));
    setDeleteTarget(null);
  };
  const visible = projects.filter((project) => {
    const isMine = !!user && project.user_id === user.id;
    return !mine || isMine;
  });
  const hasSubmittedProject = projects.some(
    (project) => !!user && project.user_id === user.id,
  );
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
            mine={!!user && p.user_id === user.id}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>
      {hasSubmittedProject && (
        <p className="project-edit-note">
          Want to edit a project? Submit another version for review and delete
          your previous one.
        </p>
      )}
      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          close={() => setDeleteTarget(null)}
          onConfirm={() => deleteProject(deleteTarget)}
        />
      )}
    </main>
  );
}
function DeleteModal({ project, close, onConfirm }) {
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
          <button className="button danger" onClick={onConfirm}>
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}

function NewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    author: "",
    description: "",
    link: "",
    image: null,
  });
  const submit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (form.image) {
      const ext = form.image.name.split(".").pop().toLowerCase();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, form.image);
      if (uploadError) {
        console.error(uploadError);
        alert("Image upload failed. Is it a PNG or JPG under 2 MB?");
        return;
      }
      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("projects").insert({
      project_name: form.name,
      creator_name: form.author,
      description: form.description,
      project_link: form.link,
      image_url: imageUrl,
    });
    if (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      return;
    }
    navigate("/projects");
  };
  if (!user) {
    return (
      <main className="form-page">
        <div className="form-wrap">
          <div className="form-banner">
            <span>NEW PROJECT</span>
          </div>
          <div className="submit-gate">
            <h1>Sign up to submit</h1>
            <p className="submit-gate-description">
              You need an account to submit a project.
            </p>
            <Link className="button large" to="/signup">
              Sign up <ArrowUpRight />
            </Link>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }
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
  const { signUp, logIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [emailInUse, setEmailInUse] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signupNotice, setSignupNotice] = useState("");
  const showAuthError = (error) => {
    const message = error?.message || "Something went wrong. Please try again.";
    const accountMissing =
      login &&
      (["user_not_found", "user_does_not_exist"].includes(error?.code) ||
        /invalid login credentials|user (?:not found|does not exist)|account (?:not found|does not exist)/i.test(
          message,
        ));
    setAuthError(
      accountMissing
        ? "This account does not yet exist, or the password is incorrect. Please sign up or check your password."
        : message,
    );
  };
  const action = async (e) => {
    e.preventDefault();
    setEmailInUse(false);
    setAuthError("");
    setSignupNotice("");
    let result;
    try {
      result = login
        ? await logIn(form.email, form.password)
        : await signUp(form.email, form.password);
    } catch (error) {
      showAuthError(error);
      return;
    }
    const { data, error } = result;
    if (error) {
      if (
        !login &&
        (error.code === "user_already_exists" ||
          /already (registered|in use|exists)/i.test(error.message))
      ) {
        setEmailInUse(true);
        return;
      }
      showAuthError(error);
      return;
    }

    if (!login && data?.user?.identities?.length === 0) {
      setEmailInUse(true);
      return;
    }

    if (!data?.session) {
      if (!login && data?.user) {
        setSignupNotice(
          "Account created! Check your email to confirm it before logging in.",
        );
      } else {
        setAuthError(
          "We couldn't complete that. Please check your details and try again.",
        );
      }
      return;
    }

    navigate("/projects");
  };
  return (
    <main className="auth-page">
      <div className="auth-decoration">✦</div>
      <form className="auth-card" onSubmit={action}>
        <h1>{login ? "Log in" : "Sign up"}</h1>
        <p>{login ? "Hi again! （-＾▽＾-）" : "(ᵔ◡ᵔ) Woohoo!"}</p>
        {(authError || (!login && emailInUse)) && (
          <p className="auth-error" role="alert">
            {authError
              ? `${authError} 😡`
              : "This email is already in use. Please log in or use another email. 😡"}
          </p>
        )}
        {!login && signupNotice && (
          <p className="auth-notice" role="status">
            {signupNotice}
          </p>
        )}
        <label>
          Email
          <input
            type="email"
            required
            placeholder={
              login ? "you@example.com" : "School (preferably) or personal"
            }
            value={form.email}
            onChange={(e) => {
              setEmailInUse(false);
              setAuthError("");
              setSignupNotice("");
              setForm({ ...form, email: e.target.value });
            }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setAuthError("");
              setForm({ ...form, password: e.target.value });
            }}
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const logIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });
  const logOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
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
